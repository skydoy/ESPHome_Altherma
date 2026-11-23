#!/usr/bin/env python3
"""Publish the docs site without rebuilding firmware.

The live GitHub Pages site is the last successful tag of
"Build firmware & publish installer" (currently v2.6.3). This script
rebuilds that exact tree from the tag's static files and firmware artifacts,
checks every file against the live URL, then adds a freshly built docs/
directory. It refuses to continue if any published installer or firmware
byte differs. It does not run the firmware publish workflow.

Catch-up: if the live site is still an OLDER release than the latest successful tag
publish (for example the tag's own Pages deploy was a no-op because the docs had
already been deployed on the same commit), the live comparison is replaced by a
stricter one against the tag's GitHub Release: every *.factory.bin and *.ota.bin must
be byte-identical to the release asset (SHA256SUMS.txt), every manifest must carry
the tag version and the sha256 of its OTA image, and the live version must be a
plain older release (never dev, never newer). Then the whole tag site (installer,
firmware, manifests) is deployed together with the docs.
"""
from __future__ import annotations

import argparse
import hashlib
import io
import json
import subprocess
import sys
import tarfile
import urllib.request
import zipfile
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO = "skydoy/ESPHome_Altherma"
LIVE = "https://skydoy.github.io/ESPHome_Altherma"
BOARDS = ("esp32", "esp32-s3", "atoms3", "esp8266", "m5stack")
WORKFLOW = "publish.yml"


def gh_json(args: list[str]):
    raw = subprocess.check_output(["gh", "api", *args], text=True)
    return json.loads(raw)


def latest_release_run() -> tuple[int, str]:
    """Latest successful tag publish. Manual runs are ignored (they ship dev firmware)."""
    raw = subprocess.check_output(
        [
            "gh", "run", "list",
            "--repo", REPO,
            "--workflow", WORKFLOW,
            "--limit", "30",
            "--json", "databaseId,headBranch,event,conclusion",
        ],
        text=True,
    )
    runs = json.loads(raw)
    for run in runs:
        branch = run.get("headBranch") or ""
        if run.get("conclusion") == "success" and run.get("event") == "push" and branch.startswith("v"):
            return int(run["databaseId"]), branch
    raise SystemExit("no successful tag publish found; refusing to guess the live site")


def sha256_bytes(chunks) -> str:
    digest = hashlib.sha256()
    for chunk in chunks:
        digest.update(chunk)
    return digest.hexdigest()


def sha256_file(path: Path) -> str:
    def chunks():
        with path.open("rb") as handle:
            while True:
                block = handle.read(1024 * 1024)
                if not block:
                    break
                yield block
    return sha256_bytes(chunks())


def fetch(url: str) -> tuple[int, bytes]:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "ESPHome-Altherma-docs-publish",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
        },
    )
    with urllib.request.urlopen(request, timeout=180) as response:
        return response.status, response.read()


def sha256_url(url: str) -> str:
    _status, body = fetch(url)
    return hashlib.sha256(body).hexdigest()


def fetch_text(url: str) -> str:
    _status, body = fetch(url)
    return body.decode("utf-8", errors="replace")


def extract_static(tag: str, dest: Path) -> None:
    subprocess.check_call(
        ["git", "fetch", "origin", "tag", tag, "--force"],
        cwd=ROOT,
    )
    archive = subprocess.check_output(["git", "archive", tag, "static"], cwd=ROOT)
    with tarfile.open(fileobj=io.BytesIO(archive)) as tar:
        for member in tar.getmembers():
            if not member.isfile():
                continue
            name = member.name
            if not name.startswith("static/"):
                raise SystemExit(f"unexpected archive member {name}")
            rel = name[len("static/"):]
            target = dest / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            extracted = tar.extractfile(member)
            if extracted is None:
                raise SystemExit(f"could not read {name}")
            target.write_bytes(extracted.read())


def download_firmware(run_id: int, dest: Path, only: str | None) -> int:
    listing = subprocess.check_output(
        [
            "gh", "api", "--paginate",
            f"repos/{REPO}/actions/runs/{run_id}/artifacts",
            "--jq", ".artifacts[] | {id,name}",
        ],
        text=True,
    )
    artifacts = [json.loads(line) for line in listing.splitlines() if line.strip()]
    wanted = [item for item in artifacts if item["name"].startswith("fw-")]
    if only:
        board, model = only.split("/", 1)
        wanted = [item for item in wanted if item["name"] == f"fw-{board}-{model}"]
        if len(wanted) != 1:
            raise SystemExit(f"smoke artifact fw-{board}-{model} not found")
    if not wanted:
        raise SystemExit(f"release run {run_id} has no firmware artifacts")
    tmp = dest.parent / "fw-zips"
    tmp.mkdir(parents=True, exist_ok=True)
    for item in wanted:
        zip_path = tmp / f"{item['name']}.zip"
        print(f"download {item['name']}", flush=True)
        with zip_path.open("wb") as handle:
            subprocess.check_call(
                ["gh", "api", f"repos/{REPO}/actions/artifacts/{item['id']}/zip"],
                stdout=handle,
            )
        with zipfile.ZipFile(zip_path) as archive:
            for info in archive.infolist():
                if info.is_dir():
                    continue
                # Artifact paths are firmware/<board>/<model>/file
                if not info.filename.startswith("firmware/") or ".." in info.filename.split("/"):
                    raise SystemExit(f"unexpected firmware path {info.filename}")
                target = dest / info.filename
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(archive.read(info))
    return len(wanted)


def expected_firmware_count(tag: str) -> int:
    show = subprocess.check_output(["git", "show", f"{tag}:installer/models.yaml"], cwd=ROOT, text=True)
    # Avoid a PyYAML dependency in this script: confirmed lines are explicit.
    confirmed = 0
    for line in show.splitlines():
        stripped = line.strip()
        if stripped.startswith("#") or "confirmed: true" not in stripped:
            continue
        confirmed += 1
    if confirmed < 1:
        raise SystemExit(f"{tag} models.yaml has no confirmed models")
    return len(BOARDS) * (confirmed + 1)


def iter_files(root: Path):
    for path in sorted(root.rglob("*")):
        if path.is_file():
            yield path


def version_tuple(version: str) -> tuple[int, ...] | None:
    parts = version.strip().lstrip("v").split(".")
    if not parts or not all(part.isdigit() for part in parts):
        return None
    return tuple(int(part) for part in parts)


def live_version() -> str:
    return json.loads(fetch_text(f"{LIVE}/firmware/esp32/generic/manifest.json"))["version"]


def check_against_release(site: Path, tag: str) -> dict[str, str]:
    """Live site is an older release: prove the assembled firmware IS the tag's release."""
    release = gh_json([f"repos/{REPO}/releases/tags/{tag}"])
    if release.get("draft") or release.get("prerelease"):
        raise SystemExit(f"release {tag} is a draft or prerelease; not deploying")
    sums_url = next((a["browser_download_url"] for a in release.get("assets", [])
                     if a["name"] == "SHA256SUMS.txt"), None)
    if not sums_url:
        raise SystemExit(f"release {tag} has no SHA256SUMS.txt")
    sums = {}
    for line in fetch_text(sums_url).splitlines():
        if line.strip():
            digest, name = line.split(None, 1)
            sums[name.strip().lstrip("*")] = digest
    checked = 0
    mismatches: list[str] = []
    for path in sorted(site.glob("firmware/*/*/*.bin")):
        board, model = path.parent.parent.name, path.parent.name
        kind = path.name.split(".", 1)[1]  # factory.bin / ota.bin
        asset = f"esphome-altherma-{board}-{model}-{tag}.{kind}"
        local = sha256_file(path)
        if sums.get(asset) != local:
            mismatches.append(f"{path.relative_to(site)}: {local} != release {asset} {sums.get(asset)}")
        checked += 1
    for manifest in sorted(site.glob("firmware/*/*/manifest.json")):
        data = json.loads(manifest.read_text(encoding="utf-8"))
        if data.get("version") != tag[1:]:
            mismatches.append(f"{manifest.relative_to(site)}: version {data.get('version')} != {tag[1:]}")
        for build in data.get("builds", []):
            ota = build.get("ota") or {}
            bin_path = manifest.parent / ota.get("path", "")
            if not bin_path.is_file() or sha256_file(bin_path) != ota.get("sha256"):
                mismatches.append(f"{manifest.relative_to(site)}: OTA sha256 does not match {ota.get('path')}")
    if checked == 0 or checked != 2 * len(list(site.glob("firmware/*/*/manifest.json"))):
        mismatches.append(f"expected factory + ota per firmware, found {checked} images")
    if mismatches:
        print("\n".join(mismatches[:30]))
        raise SystemExit(f"{len(mismatches)} firmware files differ from release {tag}; not deploying")
    hashes = {path.relative_to(site).as_posix(): sha256_file(path) for path in iter_files(site)}
    print(f"catch-up: {checked} images byte-identical to release {tag}; deploying the whole {tag} site")
    return hashes


def check_against_live(site: Path) -> dict[str, str]:
    files = [path.relative_to(site).as_posix() for path in iter_files(site)]
    if not files:
        raise SystemExit("assembled site is empty")
    print(f"compare {len(files)} published files to {LIVE}", flush=True)
    mismatches: list[str] = []
    hashes: dict[str, str] = {}

    def one(rel: str) -> tuple[str, str, str | None]:
        local = sha256_file(site / rel)
        try:
            remote = sha256_url(f"{LIVE}/{rel}")
        except Exception as exc:  # noqa: BLE001 - report the path, keep going
            return rel, local, f"download failed: {exc}"
        if remote != local:
            return rel, local, remote
        return rel, local, None

    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = [pool.submit(one, rel) for rel in files]
        done = 0
        for future in as_completed(futures):
            rel, local, remote = future.result()
            done += 1
            if remote is None:
                hashes[rel] = local
            else:
                mismatches.append(f"{rel}: live {remote} assembled {local}")
            if done % 25 == 0:
                print(f"  {done}/{len(files)}", flush=True)
    if mismatches:
        print("\n".join(mismatches[:30]))
        raise SystemExit(f"{len(mismatches)} live files differ from the release artifacts; not deploying")
    manifests = list(site.glob("firmware/*/*/manifest.json"))
    if not manifests:
        raise SystemExit("assembled site has no firmware manifest")
    versions = {json.loads(path.read_text(encoding="utf-8"))["version"] for path in manifests}
    if len(versions) != 1 or next(iter(versions)).startswith("dev"):
        raise SystemExit(f"refusing to keep these firmware versions: {sorted(versions)}")
    print(f"live installer and firmware match the release artifacts ({len(hashes)} files, version {next(iter(versions))})")
    return hashes


def overlay_docs(site: Path, docs: Path, hashes: dict[str, str]) -> None:
    before = {rel: sha256_file(site / rel) for rel in hashes}
    target = site / "docs"
    if target.exists():
        raise SystemExit("release tree already contains docs/; refusing to replace an unknown docs tree")
    # copy2 keeps bytes; the docs build is the only addition
    import shutil
    shutil.copytree(docs, target)
    after = {rel: sha256_file(site / rel) for rel in before}
    if after != before:
        changed = [rel for rel in before if after.get(rel) != before[rel]]
        raise SystemExit(f"overlay changed published files: {changed[:10]}")
    for rel in iter_files(site):
        posix = rel.relative_to(site).as_posix()
        if posix.startswith("docs/"):
            continue
        if posix not in before:
            raise SystemExit(f"unexpected new published file {posix}")


def write_hashes(path: Path, hashes: dict[str, str]) -> None:
    lines = [f"{digest}  {rel}" for rel, digest in sorted(hashes.items())]
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def read_hashes(path: Path) -> dict[str, str]:
    hashes = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        digest, rel = line.split("  ", 1)
        hashes[rel] = digest
    return hashes


def verify_live(hash_file: Path) -> None:
    hashes = read_hashes(hash_file)
    mismatches = []

    def one(item: tuple[str, str]) -> str | None:
        rel, digest = item
        try:
            remote = sha256_url(f"{LIVE}/{rel}")
        except Exception as exc:  # noqa: BLE001
            return f"{rel}: {exc}"
        if remote != digest:
            return f"{rel}: live {remote} expected {digest}"
        return None

    with ThreadPoolExecutor(max_workers=6) as pool:
        for result in pool.map(one, hashes.items()):
            if result:
                mismatches.append(result)
    pages = {
        "docs/pt/": "A tua Daikin",
        "docs/en/": "Your Daikin",
        "docs/pt/wiring/": "Ligar a placa ao X10A",
        "docs/en/wiring/": "Wiring the board to X10A",
        "docs/pt/install/": "Instalar em 3 passos",
        "docs/en/install/": "Install in 3 steps",
    }
    for rel, needle in pages.items():
        try:
            body = fetch_text(f"{LIVE}/{rel}")
        except Exception as exc:  # noqa: BLE001
            mismatches.append(f"{rel}: {exc}")
            continue
        if needle not in body:
            mismatches.append(f"{rel}: missing {needle!r}")
    version = json.loads(fetch_text(f"{LIVE}/firmware/esp32/generic/manifest.json"))["version"]
    if version.startswith("dev"):
        mismatches.append(f"live manifest version is dev firmware: {version}")
    if mismatches:
        print("\n".join(mismatches[:40]))
        raise SystemExit(f"live verification failed ({len(mismatches)})")
    print(f"live site ok: {len(hashes)} preserved files, docs pages present, firmware {version}")


def assemble(args: argparse.Namespace) -> None:
    dest = Path(args.dest).resolve()
    docs = Path(args.docs).resolve()
    if not (docs / "en" / "index.html").is_file() or not (docs / "pt" / "index.html").is_file():
        raise SystemExit(f"{docs} is not a built docs site")
    if dest.exists():
        raise SystemExit(f"{dest} already exists; refusing to reuse an output directory")
    dest.mkdir(parents=True)
    run_id, tag = latest_release_run()
    if args.run_id:
        run_id = args.run_id
    if args.tag:
        tag = args.tag
    print(f"release run {run_id} tag {tag}")
    extract_static(tag, dest)
    count = download_firmware(run_id, dest, args.only)
    if args.only:
        board, model = args.only.split("/", 1)
        manifest_path = dest / "firmware" / board / model / "manifest.json"
    else:
        expected = expected_firmware_count(tag)
        if count != expected:
            raise SystemExit(f"expected {expected} firmware artifacts, found {count}")
        manifest_path = dest / "firmware" / "esp32" / "generic" / "manifest.json"
    version = json.loads(manifest_path.read_text(encoding="utf-8"))["version"]
    if version != tag[1:]:
        raise SystemExit(f"manifest version {version} does not match tag {tag}")
    live = live_version()
    live_t, tag_t = version_tuple(live), version_tuple(tag)
    if live == tag[1:]:
        hashes = check_against_live(dest)
    elif live_t is not None and tag_t is not None and live_t < tag_t and not args.only:
        print(f"live site is {live}, latest tag build is {tag}: catch-up deploy of {tag}")
        hashes = check_against_release(dest, tag)
    else:
        raise SystemExit(f"live firmware {live} is neither {tag[1:]} nor an older release; not deploying")
    if args.only:
        print("smoke check passed; incomplete tree was not turned into a deployable site")
        return
    overlay_docs(dest, docs, hashes)
    write_hashes(Path(args.hash_out), hashes)
    print(f"site ready at {dest} ({len(hashes)} preserved files, docs added)")


def main() -> None:
    parser = argparse.ArgumentParser(description="Assemble a docs-only GitHub Pages update")
    sub = parser.add_subparsers(dest="cmd", required=True)
    build = sub.add_parser("assemble")
    build.add_argument("--docs", required=True)
    build.add_argument("--dest", required=True)
    build.add_argument("--hash-out", required=True)
    build.add_argument("--only", help="smoke: one board/model, for example esp8266/generic")
    build.add_argument("--run-id", type=int)
    build.add_argument("--tag")
    check = sub.add_parser("verify")
    check.add_argument("--hash-file", required=True)
    args = parser.parse_args()
    if args.cmd == "assemble":
        assemble(args)
    else:
        verify_live(Path(args.hash_file))


if __name__ == "__main__":
    main()
