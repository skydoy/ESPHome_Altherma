#!/usr/bin/env python3
"""Firmware size check: app image vs. app partition, with a report of what takes the space.

Fails (exit 1) when the app image (the OTA .bin) uses more than --max-percent of the app
partition, so an over-the-air update can never be too big for the board. The threshold is
one number, MAX_PERCENT below (validate.yml and publish.yml both use it), so it can be lowered
later (e.g. to 80). The FIRMWARE_MAX_PERCENT environment variable or --max-percent override it.

Inputs, all from one ESPHome build:
  *.ota.bin      the app image (what OTA writes into the app partition)
  *.factory.bin  ESP32: its partition table (offset 0x8000) gives the app partition size
  *.elf          optional: symbol sizes for the "biggest contributors" report

  python tools/firmware_size.py --dir <folder with the files> --label esp32/generic
  python tools/firmware_size.py --ota a.ota.bin --factory a.factory.bin --elf a.elf ...

Works without the toolchain: the partition table and the ELF symbol table are parsed here.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import struct
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

# The one place to change the limit (percent of the app partition the app image may use).
MAX_PERCENT = 90

# ESP8266 has no partition table. Arduino ESP8266 4 MB layouts (ESPHome's default for d1_mini and
# other 4 MB boards) cap the sketch at the 1 MB flash-mapped window: upload.maximum_size = 1044464.
ESP8266_APP_MAX = 1044464
PART_TABLE_OFFSET = 0x8000
PART_MAGIC = b"\xaa\x50"


def esp32_app_partition(factory: bytes) -> tuple[int, str] | None:
    """Smallest OTA app partition (ota_0/ota_1 are the same size), else the factory app."""
    table = factory[PART_TABLE_OFFSET:PART_TABLE_OFFSET + 0xC00]
    apps = []
    for i in range(0, len(table) - 31, 32):
        e = table[i:i + 32]
        if e[:2] != PART_MAGIC:
            break
        ptype, subtype = e[2], e[3]
        _off, size = struct.unpack_from("<II", e, 4)
        label = e[12:28].split(b"\0", 1)[0].decode(errors="replace")
        if ptype == 0:  # app
            apps.append((subtype, size, label))
    if not apps:
        return None
    ota = [a for a in apps if 0x10 <= a[0] <= 0x1F]
    pick = min(ota or apps, key=lambda a: a[1])
    return pick[1], pick[2]


# --- minimal ELF32 little-endian reader (symbols and section sizes) ---------------------------
def read_elf(path: Path):
    data = path.read_bytes()
    if data[:4] != b"\x7fELF" or data[4] != 1 or data[5] != 1:
        raise ValueError("not a 32-bit little-endian ELF")
    (e_shoff,) = struct.unpack_from("<I", data, 0x20)
    e_shentsize, e_shnum, e_shstrndx = struct.unpack_from("<HHH", data, 0x2E)
    secs = []
    for i in range(e_shnum):
        o = e_shoff + i * e_shentsize
        name, stype, flags, addr, off, size, link, info, align, entsize = struct.unpack_from("<10I", data, o)
        secs.append(dict(name_off=name, type=stype, flags=flags, off=off, size=size, link=link, entsize=entsize))
    shstr = secs[e_shstrndx]

    def cstr(base, o):
        end = data.index(b"\0", base + o)
        return data[base + o:end].decode(errors="replace")

    for s in secs:
        s["name"] = cstr(shstr["off"], s["name_off"])
    syms = []
    for s in secs:
        if s["type"] != 2:  # SHT_SYMTAB
            continue
        strtab = secs[s["link"]]
        for o in range(s["off"], s["off"] + s["size"], 16):
            st_name, st_value, st_size, st_info, st_other, st_shndx = struct.unpack_from("<IIIBBH", data, o)
            if st_size == 0 or st_shndx == 0 or st_shndx >= len(secs):
                continue
            if (st_info & 0xF) not in (1, 2):  # OBJECT, FUNC
                continue
            syms.append((cstr(strtab["off"], st_name), st_size, st_shndx))
    return secs, syms


def in_image(sec) -> bool:
    # SHF_ALLOC and not SHT_NOBITS (.bss): bytes that are stored in the flash image.
    return bool(sec["flags"] & 0x2) and sec["type"] != 8 and sec["size"] > 0


MANGLED = re.compile(r"_ZN[KVL]*(?:St)?(\d+)([A-Za-z_]\w*)")


def group_of(sym: str) -> str:
    if sym.startswith(("_ZNSt", "_ZSt", "_ZNKSt", "_ZNSt3__1")):
        return "std (C++ library)"
    m = MANGLED.match(sym)
    if m:
        n = int(m.group(1))
        ns = m.group(2)[:n]
        if ns == "esphome":
            rest = m.group(2)[n:]
            m2 = re.match(r"(\d+)(\w+)", rest)
            if m2:
                comp = m2.group(2)[:int(m2.group(1))]
                return f"esphome::{comp}"
            return "esphome (core)"
        return ns
    if sym.startswith("_Z"):
        return "other C++"
    for prefix, label in (("mbedtls_", "mbedtls (TLS)"), ("lwip_", "lwIP (network)"), ("esp_wifi", "Wi-Fi driver"),
                          ("wifi_", "Wi-Fi driver"), ("ieee80211", "Wi-Fi driver"), ("ppT", "Wi-Fi driver"),
                          ("esp_", "ESP-IDF / SDK"), ("tcp_", "lwIP (network)"), ("pbuf", "lwIP (network)"),
                          ("httpd_", "HTTP server"), ("esp_http", "HTTP client"), ("nvs_", "NVS")):
        if sym.startswith(prefix):
            return label
    return "C / SDK (other)"


def demangle(names: list[str]) -> list[str]:
    tool = shutil.which("c++filt")
    if not tool or not names:
        return names
    try:
        out = subprocess.run([tool], input="\n".join(names), capture_output=True, text=True, check=True).stdout
        res = out.split("\n")[: len(names)]
        return res if len(res) == len(names) else names
    except Exception:
        return names


def find(d: Path, patterns: list[str]) -> Path | None:
    for p in patterns:
        hits = sorted(d.glob(p))
        if hits:
            return hits[0]
    return None


def kib(n: int) -> str:
    return f"{n / 1024:,.1f} KiB"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dir", type=Path, help="folder with *.ota.bin, *.factory.bin and optionally *.elf")
    ap.add_argument("--ota", type=Path)
    ap.add_argument("--factory", type=Path)
    ap.add_argument("--elf", type=Path)
    ap.add_argument("--label", default="firmware")
    ap.add_argument("--max-percent", type=float, default=float(os.environ.get("FIRMWARE_MAX_PERCENT") or MAX_PERCENT))
    ap.add_argument("--app-max", type=int, help="override the app partition size in bytes")
    ap.add_argument("--top", type=int, default=12)
    ap.add_argument("--json", type=Path, help="write the numbers as JSON")
    a = ap.parse_args()

    if a.dir:
        a.ota = a.ota or find(a.dir, ["*.ota.bin", "firmware.ota.bin"])
        a.factory = a.factory or find(a.dir, ["*.factory.bin", "firmware.factory.bin"])
        a.elf = a.elf or find(a.dir, ["*.elf"])
    if not a.ota or not a.ota.is_file():
        print(f"::error::{a.label}: no OTA image (*.ota.bin) found")
        return 2
    image = a.ota.stat().st_size

    platform, part_label = "esp8266", "sketch area (1 MB flash window)"
    part = None
    if a.factory and a.factory.is_file():
        info = esp32_app_partition(a.factory.read_bytes())
        if info:
            part, part_label = info[0], f"app partition '{info[1]}'"
            platform = "esp32"
    if part is None:
        part = ESP8266_APP_MAX
    if a.app_max:
        part, part_label = a.app_max, "app partition (--app-max)"
    pct = 100.0 * image / part
    ok = pct <= a.max_percent

    lines = [f"### Firmware size: {a.label}", "",
             "| Image | Partition | Used | Limit | Free |", "|---|---|---|---|---|",
             f"| {image:,} B ({kib(image)}) | {part:,} B ({kib(part)}), {part_label} | **{pct:.1f}%** | {a.max_percent:g}% "
             f"| {part - image:,} B |", ""]

    groups_out, top_out, sections_out = [], [], []
    if a.elf and a.elf.is_file():
        try:
            secs, syms = read_elf(a.elf)
            image_secs = {i for i, s in enumerate(secs) if in_image(s)}
            sections_out = sorted(((s["name"], s["size"]) for i, s in enumerate(secs) if i in image_secs),
                                  key=lambda x: -x[1])
            groups = defaultdict(int)
            flash_syms = [(n, sz) for n, sz, sh in syms if sh in image_secs]
            for n, sz in flash_syms:
                groups[group_of(n)] += sz
            groups_out = sorted(groups.items(), key=lambda x: -x[1])[: a.top]
            top = sorted(flash_syms, key=lambda x: -x[1])[: a.top]
            top_out = list(zip(demangle([n for n, _ in top]), [sz for _, sz in top]))
            lines += ["Biggest contributors (symbol sizes from the ELF; strings without symbols are not counted):", "",
                      "| Group | Size |", "|---|---|"]
            lines += [f"| {g} | {kib(sz)} |" for g, sz in groups_out]
            lines += ["", "| Largest symbols | Size |", "|---|---|"]
            lines += [f"| `{(n[:90] + '…') if len(n) > 90 else n}` | {kib(sz)} |" for n, sz in top_out]
            lines += ["", "| Section | Size |", "|---|---|"]
            lines += [f"| {n} | {kib(sz)} |" for n, sz in sections_out[:8]]
        except Exception as exc:  # the size check itself must not depend on the ELF
            lines.append(f"(ELF not analysed: {exc})")
    else:
        lines.append("(no ELF: biggest contributors not listed)")
    report = "\n".join(lines)
    print(report)

    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as fh:
            fh.write(report + "\n\n")
    if a.json:
        a.json.write_text(json.dumps(dict(label=a.label, platform=platform, image=image, partition=part,
                                          percent=round(pct, 2), max_percent=a.max_percent,
                                          groups=groups_out, top=top_out), indent=2))
    if ok:
        print(f"OK: {a.label} uses {pct:.1f}% of the app partition (limit {a.max_percent:g}%).")
        return 0
    print(f"::error title=Firmware too big::{a.label} uses {pct:.1f}% of the app partition "
          f"({image:,} of {part:,} bytes); the limit is {a.max_percent:g}%.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
