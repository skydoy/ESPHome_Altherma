# altherma-reports (Cloudflare Worker)

Receives the one-time automatic compatibility report that installer firmwares send on first boot
(`installer/packages/identify.yaml`) and opens an issue in `skydoy/esphome-altherma` with the label
`compatibility-report`. URL: `https://altherma-reports.esphome-ac-report.workers.dev/`

- POST JSON `{software_id, micon_id, suggested_model, model_check, board, firmware_version, readings, device_hash}`, max 16 KB.
- Rate limit: 5 reports per hour per client (salted IP hash in KV, 1 h TTL; the IP is never stored or posted).
- Dedupe: `device_hash + software_id + micon_id` kept 1 year in KV; a repeat returns `{"status":"duplicate"}`.
- The GitHub token is a Worker secret only; boards never hold it. Repository Issues must be enabled.

Deploy (no wrangler): `CLOUDFLARE_API_TOKEN=… CF_ACCOUNT_ID=… GITHUB_TOKEN_REPORTS=… ./deploy.sh`
(creates the `ALTHERMA_REPORTS` KV namespace on first run and enables the workers.dev route).
