#!/usr/bin/env python3
"""Prepare the next firmware release (used by the auto-release workflows).

Picks the version:
  * altherma_version in boards/base.yaml newer than the latest v* tag: release that version
    as it is (a release prepared by hand, for example a minor bump);
  * otherwise: latest tag + 1 patch.
Then sets altherma_version, moves the CHANGELOG.md "Unreleased" notes under
"## [x.y.z] - YYYY-MM-DD" (Europe/Lisbon date) and, with --esphome, writes the new pin to
.github/esphome-version and adds a changelog line. When "Unreleased" is empty the notes are the
subjects of the firmware commits since the latest tag. Prints the version; with
GITHUB_OUTPUT set it also writes version=/tag= there.

  python3 tools/release_bump.py [--esphome 2026.12.0] [--dry-run]
"""
from __future__ import annotations

import argparse
import os
import re
import subprocess
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "boards" / "base.yaml"
CHANGELOG = ROOT / "CHANGELOG.md"
PIN = ROOT / ".github" / "esphome-version"
# Same list as the "paths" filter of .github/workflows/auto-release.yml.
FIRMWARE_PATHS = ["components", "confs", "boards", "installer", ".github/esphome-version"]
VERSION_RE = re.compile(r'^(\s*altherma_version:\s*)"?(\d+\.\d+\.\d+)"?', re.M)


def vtuple(v: str) -> tuple[int, int, int]:
    m = re.fullmatch(r"v?(\d+)\.(\d+)\.(\d+)", v.strip())
    if not m:
        raise SystemExit(f"not a x.y.z version: {v!r}")
    return int(m.group(1)), int(m.group(2)), int(m.group(3))


def git(*args: str) -> str:
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True).strip()


def latest_tag() -> str:
    tags = [t for t in git("tag", "--list", "v*").split() if re.fullmatch(r"v\d+\.\d+\.\d+", t)]
    if not tags:
        raise SystemExit("no vX.Y.Z tag found (fetch tags first)")
    return max(tags, key=vtuple)


def firmware_subjects(since: str) -> list[str]:
    out = git("log", "--no-merges", "--format=%s", f"{since}..HEAD", "--", *FIRMWARE_PATHS)
    return [s for s in out.splitlines() if s.strip() and not s.startswith("release v")]


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--esphome", help="new ESPHome pin (x.y.z) for .github/esphome-version")
    ap.add_argument("--dry-run", action="store_true", help="print the plan, change nothing")
    args = ap.parse_args()

    base_text = BASE.read_text(encoding="utf-8")
    m = VERSION_RE.search(base_text)
    if not m:
        raise SystemExit("altherma_version not found in boards/base.yaml")
    current = m.group(2)
    tag = latest_tag()
    if vtuple(current) > vtuple(tag):
        new = current
    elif vtuple(current) == vtuple(tag):
        major, minor, patch = vtuple(tag)
        new = f"{major}.{minor}.{patch + 1}"
    else:
        raise SystemExit(f"boards/base.yaml has {current}, older than the latest tag {tag}")
    if new in git("tag", "--list", f"v{new}").split():
        raise SystemExit(f"tag v{new} already exists")

    old_pin = PIN.read_text(encoding="utf-8").strip()
    if args.esphome:
        vtuple(args.esphome)
        if vtuple(args.esphome) <= vtuple(old_pin):
            raise SystemExit(f"ESPHome {args.esphome} is not newer than the pin {old_pin}")

    text = CHANGELOG.read_text(encoding="utf-8")
    date = datetime.now(ZoneInfo("Europe/Lisbon")).strftime("%Y-%m-%d")
    if re.search(rf"^## \[{re.escape(new)}\]", text, re.M):
        # Prepared by hand: keep that section, only add the ESPHome line if needed.
        section_exists = True
    else:
        section_exists = False
        um = re.search(r"^## \[Unreleased\][^\n]*\n(.*?)(?=^## \[)", text, re.M | re.S)
        if not um:
            raise SystemExit("no '## [Unreleased]' section followed by a release in CHANGELOG.md")
        notes = um.group(1).strip()
        lines = []
        if args.esphome:
            lines.append(
                f"- ESPHome {args.esphome} (antes {old_pin}) no CI, na publicação e no firmware pré-compilado "
                "(atualização automática diária; o build de todas as placas passou antes da publicação)."
            )
        if notes:
            lines.append(notes)
        elif not args.esphome:
            subjects = firmware_subjects(tag)
            if not subjects:
                raise SystemExit(f"no firmware commits since {tag} and no Unreleased notes; nothing to release")
            lines.append("Alterações no firmware (publicação automática):")
            lines.extend(f"- {s}" for s in subjects)
        lines.append(f"- Versão do projeto {new} para o Device Builder detetar a atualização.")
        section = f"## [{new}] - {date}\n\n" + "\n".join(lines) + "\n\n"
        text = text[: um.start()] + "## [Unreleased]\n\n" + section + text[um.end():]

    if section_exists and args.esphome:
        line = f"- ESPHome {args.esphome} (antes {old_pin}) no CI, na publicação e no firmware pré-compilado."
        text = re.sub(rf"(^## \[{re.escape(new)}\][^\n]*\n\n?)", lambda mm: mm.group(1) + line + "\n", text, count=1, flags=re.M)

    print(f"latest tag {tag}, boards/base.yaml {current} -> release v{new}" + (f", ESPHome {old_pin} -> {args.esphome}" if args.esphome else ""))
    if args.dry_run:
        return
    BASE.write_text(VERSION_RE.sub(lambda mm: f'{mm.group(1)}"{new}"', base_text, count=1), encoding="utf-8")
    CHANGELOG.write_text(text, encoding="utf-8")
    if args.esphome:
        PIN.write_text(args.esphome + "\n", encoding="utf-8")
    out = os.environ.get("GITHUB_OUTPUT")
    if out:
        with open(out, "a", encoding="utf-8") as handle:
            handle.write(f"version={new}\ntag=v{new}\n")


if __name__ == "__main__":
    main()
