#!/usr/bin/env python3
"""Write the model lists generated from installer/models.yaml (the single source).

  python installer/gen_models.py            rewrite the GENERATED blocks
  python installer/gen_models.py --check    fail if a block is out of date (Validate)
  python installer/gen_models.py --matrix   print the release build list (JSON): generic + confirmed
"""
import json, os, re, sys
import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GENERIC = "generic"


def load():
    with open(os.path.join(ROOT, "installer", "models.yaml"), encoding="utf-8") as f:
        models = yaml.safe_load(f)["models"]
    keys = [m["key"] for m in models]
    assert len(keys) == len(set(keys)), "duplicate key in models.yaml"
    for m in models:
        assert os.path.isfile(os.path.join(ROOT, "confs", m["key"] + ".yaml")), "confs/%s.yaml missing" % m["key"]
        assert not m.get("ids") or m.get("confirmed"), "%s: IDs only for confirmed models" % m["key"]
    confs = {f[:-5] for f in os.listdir(os.path.join(ROOT, "confs")) if f.endswith(".yaml")} - {GENERIC}
    assert confs == set(keys), "confs/ and models.yaml differ: %s" % sorted(confs ^ set(keys))
    return models


def blocks(models):
    ids = [(i[0], i[1], m["key"]) for m in models for i in (m.get("ids") or [])]
    conf = [m["key"] for m in models if m.get("confirmed")]
    js = lambda v: json.dumps(v, ensure_ascii=False)
    return {
        ("installer/packages/identify.yaml", "known-ids"):
            ["        {%s, %s, %s}," % (js(a), js(b), js(k)) for a, b, k in ids],
        ("installer/packages/report.js", "models"):
            ["  var MODELS = %s;" % js([m["key"] for m in models]),
             "  var CONFIRMED = %s;" % js(conf)],
        ("static/index.html", "models"):
            ["  const KNOWN_IDS = ["] + ["    { sw: %s, micon: %s, model: %s }," % (js(a), js(b), js(k)) for a, b, k in ids] + ["  ];",
             "  const MODELS = ["] + ["    { key: %s, family: %s, name: %s, d: %s, ok: %s, s: %s }," % (
                js(m["key"]), js(m["family"]), js(m["name"]), js((m.get("kw") or "") and m["kw"] + " kW"),
                js(bool(m.get("confirmed"))), js(m.get("status", "❔"))) for m in models] + ["  ];"],
    }


def main():
    models = load()
    if "--matrix" in sys.argv:
        print(json.dumps([GENERIC] + [m["key"] for m in models if m.get("confirmed")]))
        return
    bad = 0
    for (path, name), lines in blocks(models).items():
        p = os.path.join(ROOT, path)
        s = open(p, encoding="utf-8").read()
        rx = re.compile(r"(^[^\n]*BEGIN GENERATED %s[^\n]*\n)(.*?)(^[^\n]*END GENERATED %s)" % (name, name), re.S | re.M)
        assert rx.search(s), "%s: no GENERATED %s block" % (path, name)
        new = rx.sub(lambda mo: mo.group(1) + "".join(l + "\n" for l in lines) + mo.group(3), s)
        if new != s:
            if "--check" in sys.argv:
                print("::error::%s is out of date, run python installer/gen_models.py" % path); bad = 1
            else:
                open(p, "w", encoding="utf-8").write(new); print("updated", path)
    sys.exit(bad)


if __name__ == "__main__":
    main()
