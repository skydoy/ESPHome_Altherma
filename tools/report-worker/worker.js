// altherma-reports: receives the one-time automatic compatibility report from skydoy/ESPHome_Altherma
// boards and opens a GitHub issue (label "compatibility-report"). The GitHub token lives only here,
// as the Worker secret GITHUB_TOKEN; boards never hold it.
// Privacy: nothing about the sender is stored or posted. The client IP is only used, as a salted
// SHA-256, for a 1-hour rate-limit counter in KV. device_hash is computed on the board (salted hash).
const REPO = "skydoy/ESPHome_Altherma";
const LABEL = "compatibility-report";
const MAX_BYTES = 16384;
const RATE_PER_HOUR = 5;
const DEDUPE_TTL = 60 * 60 * 24 * 365;

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });

async function sha256(s) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const str = (v, max, re) => typeof v === "string" && v.length <= max && (!re || re.test(v));
const clean = (s) => String(s).replace(/[|\r\n`<>]/g, " ").slice(0, 120);

function validate(b) {
  if (!b || typeof b !== "object" || Array.isArray(b)) return "body must be an object";
  if (!str(b.software_id, 16, /^[0-9A-Za-z]{1,16}$/)) return "software_id";
  if (!str(b.micon_id, 16, /^[0-9A-Za-z]{1,16}$/)) return "micon_id";
  if (!str(b.device_hash, 64, /^[0-9a-f]{16,64}$/)) return "device_hash";
  for (const k of ["suggested_model", "model_check", "board", "firmware_version"])
    if (b[k] !== undefined && !str(b[k], 120)) return k;
  if (b.readings !== undefined) {
    if (!b.readings || typeof b.readings !== "object" || Array.isArray(b.readings)) return "readings";
    const e = Object.entries(b.readings);
    if (e.length > 300) return "readings: too many";
    for (const [k, v] of e) if (k.length > 80 || !["string", "number", "boolean"].includes(typeof v) || String(v).length > 80) return "readings: " + k.slice(0, 40);
  }
  return null;
}

async function gh(env, path, init = {}) {
  return fetch("https://api.github.com/repos/" + REPO + path, {
    ...init,
    headers: {
      authorization: "Bearer " + env.GITHUB_TOKEN,
      accept: "application/vnd.github+json",
      "user-agent": "altherma-reports-worker",
      "content-type": "application/json",
    },
  });
}

async function ensureLabel(env) {
  const r = await gh(env, "/labels/" + LABEL);
  if (r.status === 404)
    await gh(env, "/labels", { method: "POST", body: JSON.stringify({ name: LABEL, color: "0e8a16", description: "Automatic or manual heat pump compatibility report" }) });
}

export default {
  async fetch(req, env) {
    if (req.method === "GET") return json({ ok: true, service: "altherma-reports" });
    if (req.method !== "POST") return json({ error: "method" }, 405);
    const raw = await req.text();
    if (raw.length > MAX_BYTES) return json({ error: "too large" }, 413);
    let b;
    try { b = JSON.parse(raw); } catch { return json({ error: "invalid json" }, 400); }
    const bad = validate(b);
    if (bad) return json({ error: "invalid field: " + bad }, 400);

    const ip = req.headers.get("cf-connecting-ip") || "0";
    const rk = "rl:" + (await sha256("altherma-rl:" + ip)).slice(0, 32);
    const n = parseInt((await env.REPORTS.get(rk)) || "0", 10);
    if (n >= RATE_PER_HOUR) return json({ error: "rate limited" }, 429);
    await env.REPORTS.put(rk, String(n + 1), { expirationTtl: 3600 });

    const dk = "dd:" + (await sha256([b.device_hash, b.software_id, b.micon_id].join("|")));
    const prev = await env.REPORTS.get(dk);
    if (prev) return json({ status: "duplicate", issue: prev }, 200);

    await ensureLabel(env);
    const model = b.suggested_model || "unknown";
    const rows = Object.entries(b.readings || {}).sort(([a], [c]) => a.localeCompare(c))
      .map(([k, v]) => `| ${clean(k)} | ${clean(v)} |`).join("\n");
    const body = [
      "Automatic one-time report sent by the board on first boot.",
      "",
      "| Field | Value |", "|---|---|",
      `| Software ID | \`${b.software_id}\` |`,
      `| Micon ID | \`${b.micon_id}\` |`,
      `| Suggested model | ${clean(model)} |`,
      `| Model check | ${clean(b.model_check || "")} |`,
      `| Board | ${clean(b.board || "")} |`,
      `| Firmware version | ${clean(b.firmware_version || "")} |`,
      `| Device (anonymous hash) | \`${b.device_hash.slice(0, 16)}\` |`,
      "", "<details><summary>Sensor readings (" + Object.keys(b.readings || {}).length + ")</summary>", "",
      "| Sensor | Value |", "|---|---|", rows || "| – | – |", "", "</details>",
    ].join("\n");
    const r = await gh(env, "/issues", {
      method: "POST",
      body: JSON.stringify({ title: `Auto report: ${clean(model)} (${b.software_id}/${b.micon_id})`, body, labels: [LABEL] }),
    });
    if (!r.ok) return json({ error: "github " + r.status }, 502);
    const issue = (await r.json()).html_url;
    await env.REPORTS.put(dk, issue, { expirationTtl: DEDUPE_TTL });
    return json({ status: "created", issue }, 201);
  },
};
