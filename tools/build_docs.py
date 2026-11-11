#!/usr/bin/env python3
"""Build the bilingual docs site. Does not publish, tag, or touch firmware.

    python tools/build_docs.py
    python tools/build_docs.py --dest site/docs

Reads the guides in docs/, stages MkDocs sources in site-src/, builds with
``mkdocs build --strict``, then places English under en/ and Portuguese under
pt/ so the future paths are /docs/en/ and /docs/pt/.
"""
from __future__ import annotations

import argparse
import json
import posixpath
import re
import shutil
import subprocess
import sys
import unicodedata
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://skydoy.github.io/ESPHome_Altherma/docs"
PATH_PREFIX = "/ESPHome_Altherma/docs"

EN_PAGES = [
    "index.md",
    "overview.md",
    "install.md",
    "wiring.md",
    "models.md",
    "compatibility.md",
    "web-page.md",
    "security.md",
    "advanced.md",
]
PT_PAGES = {
    "index.pt.md": "index.pt.md",
    "visao-geral.md": "overview.pt.md",
    "instalar.md": "install.pt.md",
    "ligacoes.md": "wiring.pt.md",
    "modelos.md": "models.pt.md",
    "compatibilidade.md": "compatibility.pt.md",
    "pagina-web.md": "web-page.pt.md",
    "seguranca.md": "security.pt.md",
    "avancado.md": "advanced.pt.md",
}
PT_TO_CANON = {
    "instalar.md": "install.md",
    "ligacoes.md": "wiring.md",
    "modelos.md": "models.md",
    "compatibilidade.md": "compatibility.md",
    "pagina-web.md": "web-page.md",
    "visao-geral.md": "overview.md",
    "seguranca.md": "security.md",
    "avancado.md": "advanced.md",
    "index.pt.md": "index.md",
}
# Exact markdown link targets. Longer keys first.
REPLACEMENTS = [
    ("../static/wiring-x10a.svg", "img/wiring-x10a.svg"),
    ("../homeassistant/blueprints/esphome_altherma_update_available.yaml",
     "https://github.com/skydoy/ESPHome_Altherma/blob/main/homeassistant/blueprints/esphome_altherma_update_available.yaml"),
    ("../homeassistant/blueprints/emonncms_heatpump_sender.yaml",
     "https://github.com/skydoy/ESPHome_Altherma/blob/main/homeassistant/blueprints/emonncms_heatpump_sender.yaml"),
    ("../homeassistant/emoncms/README.md",
     "https://github.com/skydoy/ESPHome_Altherma/blob/main/homeassistant/emoncms/README.md"),
    ("../installer/secrets.yaml",
     "https://github.com/skydoy/ESPHome_Altherma/blob/main/installer/secrets.yaml"),
    ("../installer/models.yaml",
     "https://github.com/skydoy/ESPHome_Altherma/blob/main/installer/models.yaml"),
    ("../installer/", "https://github.com/skydoy/ESPHome_Altherma/tree/main/installer"),
    ("../confs/", "https://github.com/skydoy/ESPHome_Altherma/tree/main/confs"),
    ("../THIRD_PARTY_NOTICES.md",
     "https://github.com/skydoy/ESPHome_Altherma/blob/main/THIRD_PARTY_NOTICES.md"),
    ("../SECURITY.md", "https://github.com/skydoy/ESPHome_Altherma/blob/main/SECURITY.md"),
    ("../LICENSE", "https://github.com/skydoy/ESPHome_Altherma/blob/main/LICENSE"),
    ("../README.pt.md", "index.md"),
    ("../README.md", "index.md"),
]
BANNER = re.compile(
    r"\n(?:🇵🇹|🇬🇧) \[(?:Ler em português|Read in English)\]\([^)]+\) · \[[^\]]+\]\([^)]+\)\n"
)
LINK = re.compile(r"\]\(([^)]+)\)")
ATTR = re.compile(
    r'(?P<pre>\b(?:href|src)\s*=\s*)(?P<q>["\'])(?P<url>.*?)(?P=q)',
    re.I,
)
CONFIG = re.compile(
    r'(<script id="__config" type="application/json">)(.*?)(</script>)',
    re.S,
)
KEEP_PREFIXES = ("assets/", "search/", "img/", "stylesheets/", "javascripts/")
KEEP_FILES = {
    "icon.png",
    "favicon.svg",
    "favicon.ico",
    "sitemap.xml",
    "sitemap.xml.gz",
}
BAD_HOSTS = ("esphome_hunter", "esphome_ac", "jjohnsen", "raomin")


def prepare() -> None:
    src = ROOT / "site-src"
    if src.exists():
        shutil.rmtree(src)
    src.mkdir()
    (src / "img").mkdir()
    (src / "stylesheets").mkdir()
    shutil.copytree(ROOT / "docs" / "img", src / "img", dirs_exist_ok=True)
    shutil.copy(ROOT / "static" / "wiring-x10a.svg", src / "img" / "wiring-x10a.svg")
    shutil.copy(ROOT / "static" / "favicon.svg", src / "img" / "favicon.svg")
    shutil.copy(ROOT / "docs" / "icon.png", src / "icon.png")
    shutil.copy(ROOT / "docs" / "stylesheets" / "extra.css", src / "stylesheets" / "extra.css")
    for name in EN_PAGES:
        text = (ROOT / "docs" / name).read_text(encoding="utf-8")
        (src / name).write_text(rewrite_markdown(text, pt=False), encoding="utf-8")
    for source, dest in PT_PAGES.items():
        text = (ROOT / "docs" / source).read_text(encoding="utf-8")
        (src / dest).write_text(rewrite_markdown(text, pt=True), encoding="utf-8")


def rewrite_markdown(text: str, pt: bool) -> str:
    text = BANNER.sub("\n", text, count=1)
    parts = re.split(r"(```.*?```)", text, flags=re.S)

    def repl(match: re.Match[str]) -> str:
        return "](" + map_link(match.group(1), pt) + ")"

    out = []
    for i, part in enumerate(parts):
        out.append(LINK.sub(repl, part) if i % 2 == 0 else part)
    return "".join(out)


def map_link(dest: str, pt: bool) -> str:
    raw = dest.strip()
    title = ""
    body = raw
    if " " in raw and not raw.startswith("http"):
        # Optional markdown title: url "title"
        m = re.match(r"(\S+)(\s+.+)$", raw)
        if m:
            body, title = m.group(1), m.group(2)
    frag = ""
    url = body
    if "#" in url:
        url, frag = url.split("#", 1)
        frag = "#" + frag
    for old, new in REPLACEMENTS:
        if url == old:
            url = new
            break
    if pt and url in PT_TO_CANON:
        url = PT_TO_CANON[url]
    if frag:
        frag = site_anchor(frag)
    return url + frag + title


def site_anchor(frag: str) -> str:
    """Match MkDocs' slug (accents removed, slash collapsed) rather than GitHub's."""
    body = frag[1:]
    body = unicodedata.normalize("NFKD", body)
    body = "".join(ch for ch in body if not unicodedata.combining(ch))
    while "--" in body:
        body = body.replace("--", "-")
    return "#" + body


def build(dest: Path) -> None:
    subprocess.check_call(
        [sys.executable, "-m", "mkdocs", "build", "--strict", "-d", str(dest)],
        cwd=ROOT,
    )


def relocate(site: Path) -> None:
    pages = []
    for path in site.rglob("*.html"):
        rel = path.relative_to(site).as_posix()
        pages.append((rel, path.read_text(encoding="utf-8")))
    written = set()
    for rel, html in pages:
        new_rel = moved_html(rel)
        new_dir = posixpath.dirname(new_rel)
        old_dir = posixpath.dirname(rel)
        html = rewrite_html(html, old_dir, new_dir)
        target = site / new_rel
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(html, encoding="utf-8")
        written.add(new_rel)
    for rel, _html in pages:
        new_rel = moved_html(rel)
        if rel != new_rel:
            old = site / rel
            if old.exists() and old.is_file():
                old.unlink()
    # Drop emptied English directories (pt/, assets/, search/, img/ stay).
    for path in sorted(site.rglob("*"), reverse=True):
        if path.is_dir() and not any(path.iterdir()):
            path.rmdir()
    (site / "index.html").write_text(ROOT_REDIRECT, encoding="utf-8")
    rewrite_search_index(site)
    rewrite_sitemap(site)


def moved_html(rel: str) -> str:
    if rel.startswith("pt/"):
        return rel
    if rel == "index.html":
        return "en/index.html"
    return "en/" + rel


ROOT_REDIRECT = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ESPHome Altherma</title>
  <link rel="canonical" href="en/">
  <link rel="icon" href="img/favicon.svg" type="image/svg+xml">
  <meta http-equiv="refresh" content="0; url=en/">
  <script>location.replace("en/")</script>
</head>
<body>
  <p><a href="en/">English</a> · <a href="pt/">Português</a></p>
</body>
</html>
"""


def rewrite_html(html: str, old_dir: str, new_dir: str) -> str:
    def repl_attr(match: re.Match[str]) -> str:
        url = rewrite_url(match.group("url"), old_dir, new_dir)
        return f'{match.group("pre")}{match.group("q")}{url}{match.group("q")}'

    html = ATTR.sub(repl_attr, html)
    return fix_config(html, old_dir, new_dir)


def fix_config(html: str, old_dir: str, new_dir: str) -> str:
    match = CONFIG.search(html)
    if not match:
        return html
    data = json.loads(match.group(2))
    data["base"] = "." if not new_dir else posixpath.relpath(".", new_dir)
    search = data.get("search")
    if isinstance(search, str) and not search.startswith(("http://", "https://")):
        data["search"] = rewrite_url(search, old_dir, new_dir)
    body = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    return html[: match.start(2)] + body + html[match.end(2) :]


def rewrite_url(url: str, old_dir: str, new_dir: str) -> str:
    if url.startswith(("#", "mailto:", "javascript:", "data:")) or url == "":
        return url
    path, query, frag = split_suffix(url)
    local = site_path(path, old_dir)
    if local is None:
        if path.startswith(ORIGIN):
            return shift_absolute(path) + query + frag
        return url
    classified = classify(local)
    relative = relativize(new_dir, classified)
    return relative + query + frag


def split_suffix(url: str) -> tuple[str, str, str]:
    path = url
    frag = ""
    query = ""
    if "#" in path:
        path, frag = path.split("#", 1)
        frag = "#" + frag
    if "?" in path:
        path, query = path.split("?", 1)
        query = "?" + query
    return path, query, frag


def site_path(path: str, old_dir: str) -> str | None:
    """Site-relative path ('' is the English home), or None if it is external."""
    if path.startswith(("http://", "https://", "mailto:", "javascript:", "data:")):
        if not path.startswith(ORIGIN):
            return None
        rest = path[len(ORIGIN) :]
        return rest[1:] if rest.startswith("/") else rest
    if path.startswith(PATH_PREFIX):
        rest = path[len(PATH_PREFIX) :]
        rest = rest[1:] if rest.startswith("/") else rest
        return rest
    if path.startswith("/"):
        return None
    directory = path.endswith("/")
    joined = posixpath.normpath(posixpath.join(old_dir, path or "."))
    if joined.startswith(".."):
        return None
    if joined == ".":
        return ""
    if directory:
        return joined + "/"
    return joined


def classify(site_path_value: str) -> str:
    raw = site_path_value
    if raw in ("", ".", "./"):
        return "en/"
    bare = raw[:-1] if raw.endswith("/") else raw
    if bare == "pt" or bare.startswith("pt/"):
        if raw.endswith("/") or not posixpath.splitext(bare)[1]:
            return bare if bare.endswith("/") else bare + "/"
        return raw
    if bare.startswith(KEEP_PREFIXES) or bare in KEEP_FILES:
        return raw
    ext = posixpath.splitext(bare)[1].lower()
    if ext and ext not in (".html", ".htm"):
        return raw
    if ext in (".html", ".htm"):
        if bare == "index.html":
            return "en/"
        if bare.endswith("/index.html"):
            return "en/" + bare[: -len("index.html")]
        return "en/" + bare
    if not raw.endswith("/"):
        raw += "/"
    return "en/" + raw


def relativize(from_dir: str, target: str) -> str:
    is_dir = target.endswith("/")
    dest = target.rstrip("/")
    if not dest:
        dest = "."
        is_dir = True
    source = from_dir or "."
    rel = posixpath.relpath(dest, source)
    if is_dir:
        if rel == ".":
            return "./"
        return rel + "/"
    return rel


def shift_absolute(url: str) -> str:
    if not url.startswith(ORIGIN):
        return url
    rest = url[len(ORIGIN) :]
    if rest.startswith("/pt") or rest.startswith("/en"):
        return url
    if rest in ("", "/"):
        return ORIGIN + "/en/"
    if not rest.startswith("/"):
        rest = "/" + rest
    return ORIGIN + "/en" + rest


def rewrite_search_index(site: Path) -> None:
    path = site / "search" / "search_index.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    docs = data.get("docs", [])
    for entry in docs:
        loc = entry.get("location", "")
        entry["location"] = shift_location(loc)
    path.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


def shift_location(loc: str) -> str:
    if "#" in loc:
        path, frag = loc.split("#", 1)
        frag = "#" + frag
    else:
        path, frag = loc, ""
    if path.startswith("pt/") or path == "pt" or path.startswith("en/"):
        return loc
    if path in ("", ".", "./"):
        return "en/" + frag
    return "en/" + path + frag


def rewrite_sitemap(site: Path) -> None:
    path = site / "sitemap.xml"
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")

    def repl(match: re.Match[str]) -> str:
        return shift_absolute(match.group(0))

    text = re.sub(re.escape(ORIGIN) + r"[^<\"\s]*", repl, text)
    path.write_text(text, encoding="utf-8")


def check(site: Path) -> None:
    errors: list[str] = []
    required = [
        "index.html",
        "en/index.html",
        "pt/index.html",
        "en/install/index.html",
        "pt/install/index.html",
        "en/wiring/index.html",
        "pt/wiring/index.html",
        "en/security/index.html",
        "pt/security/index.html",
        "search/search_index.json",
        "sitemap.xml",
    ]
    for rel in required:
        if not (site / rel).is_file():
            errors.append(f"missing {rel}")
    if (site / "install" / "index.html").exists():
        errors.append("English install page is still at /install/; expected /en/install/")
    for html in site.rglob("*.html"):
        text = html.read_text(encoding="utf-8")
        rel = html.relative_to(site).as_posix()
        for match in ATTR.finditer(text):
            url = match.group("url")
            errors.extend(check_url(site, html, rel, url))
        if "fonts.googleapis.com" in text or "unpkg.com" in text:
            errors.append(f"external runtime dependency in {rel}")
    index = json.loads((site / "search" / "search_index.json").read_text(encoding="utf-8"))
    for entry in index.get("docs", []):
        loc = entry.get("location", "")
        path = loc.split("#", 1)[0]
        frag = loc.split("#", 1)[1] if "#" in loc else ""
        target = page_file(site, path)
        if target is None or not target.is_file():
            errors.append(f"search location missing: {loc}")
        elif frag and f'id="{frag}"' not in target.read_text(encoding="utf-8", errors="ignore"):
            errors.append(f"search anchor missing: {loc}")
    # Language pills on the English home must point at Portuguese, relatively.
    home = (site / "en" / "index.html").read_text(encoding="utf-8")
    if 'hreflang="pt"' not in home or 'hreflang="en"' not in home:
        errors.append("English home is missing PT/EN pills")
    if 'href="../pt/"' not in home and 'href="../pt/index.html"' not in home:
        errors.append("English home PT pill is not a relative ../pt/ link")
    if errors:
        print("\n".join(errors))
        raise SystemExit(f"{len(errors)} docs link check error(s)")
    print(f"link check ok ({sum(1 for _ in site.rglob('*.html'))} html files)")


def page_file(site: Path, path: str) -> Path | None:
    if path in ("", ".", "./"):
        return site / "index.html"
    if path.endswith("/"):
        return site / path / "index.html"
    candidate = site / path
    if candidate.suffix:
        return candidate
    return site / path / "index.html"


def check_url(site: Path, html: Path, rel: str, url: str) -> list[str]:
    if url.startswith(("#", "mailto:", "javascript:", "data:")) or url == "":
        return []
    path, _query, frag = split_suffix(url)
    low = path.lower()
    if any(bad in low for bad in BAD_HOSTS):
        return [f"{rel}: link names another project: {url}"]
    if path.startswith(("http://", "https://")):
        if "github.com/" in path and "github.com/skydoy/ESPHome_Altherma" not in path and "github.com/skydoy" not in path:
            return [f"{rel}: GitHub link is not this repo: {url}"]
        if path.startswith(ORIGIN):
            return [f"{rel}: docs URL stayed absolute (breaks the offline zip): {url}"]
        return []
    if path.startswith("/"):
        return [f"{rel}: absolute path (breaks the offline zip): {url}"]
    target_path = path
    if target_path in ("", ".", "./"):
        target = html.parent / "index.html"
    elif target_path.endswith("/"):
        target = html.parent / target_path / "index.html"
    else:
        target = html.parent / target_path
    try:
        target = target.resolve()
        target.relative_to(site.resolve())
    except ValueError:
        return [f"{rel}: link escapes the site: {url}"]
    if not target.is_file():
        return [f"{rel}: missing {url}"]
    if frag:
        anchor = unquote(frag[1:])
        body = target.read_text(encoding="utf-8", errors="ignore")
        if f'id="{anchor}"' not in body and f"id='{anchor}'" not in body:
            return [f"{rel}: missing #{anchor} in {target.relative_to(site)}"]
    return []


def destination(raw: str) -> Path:
    dest = (ROOT / raw).resolve()
    root = ROOT.resolve()
    if dest != root and root not in dest.parents:
        raise SystemExit("docs destination must stay inside the repository")
    banned = [
        root / name
        for name in ("static", "installer", "boards", "confs", "components", "docs", "homeassistant")
    ]
    if dest in banned or any(item in dest.parents for item in banned):
        raise SystemExit(f"refusing to write the docs build into {dest}")
    if (dest / "firmware").exists():
        raise SystemExit(f"refusing to clean a directory that contains firmware: {dest}")
    return dest


def main() -> None:
    parser = argparse.ArgumentParser(description="Build the ESPHome Altherma docs site")
    parser.add_argument("--dest", default="site-docs", help="output directory (default: site-docs)")
    args = parser.parse_args()
    dest = destination(args.dest)
    prepare()
    build(dest)
    relocate(dest)
    check(dest)
    print(f"docs built at {dest}")


if __name__ == "__main__":
    main()
