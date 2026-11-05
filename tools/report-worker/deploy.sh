#!/usr/bin/env bash
# Deploy the altherma-reports Worker with the Cloudflare API (no wrangler needed).
# Needs: CLOUDFLARE_API_TOKEN (Workers Scripts + KV edit), CF_ACCOUNT_ID, GITHUB_TOKEN_REPORTS
# (fine-grained, Issues read/write on skydoy/esphome-altherma). Tokens are never printed.
set -euo pipefail
cd "$(dirname "$0")"
NAME=altherma-reports
API=https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID
H=(-H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")
# KV namespace (created once)
KV=$(curl -s "${H[@]}" "$API/storage/kv/namespaces?per_page=100" | python3 -c "import json,sys;print(next((n['id'] for n in json.load(sys.stdin)['result'] if n['title']=='ALTHERMA_REPORTS'),''))")
if [ -z "$KV" ]; then
  KV=$(curl -s "${H[@]}" -H 'content-type: application/json' -d '{"title":"ALTHERMA_REPORTS"}' "$API/storage/kv/namespaces" | python3 -c "import json,sys;print(json.load(sys.stdin)['result']['id'])")
fi
TMPM=$(mktemp); trap 'rm -f "$TMPM"' EXIT
python3 -c "import json,os;print(json.dumps({'main_module':'worker.js','compatibility_date':'2026-10-01','bindings':[{'type':'kv_namespace','name':'REPORTS','namespace_id':'$KV'},{'type':'secret_text','name':'GITHUB_TOKEN','text':os.environ['GITHUB_TOKEN_REPORTS']}]}))" > "$TMPM"
curl -s "${H[@]}" -X PUT "$API/workers/scripts/$NAME" -F "metadata=@$TMPM;type=application/json" \
  -F "worker.js=@worker.js;type=application/javascript+module" | python3 -c "import json,sys;d=json.load(sys.stdin);print('deploy',d['success'],d['errors'])"
curl -s "${H[@]}" -H 'content-type: application/json' -X POST -d '{"enabled":true}' "$API/workers/scripts/$NAME/subdomain" | python3 -c "import json,sys;d=json.load(sys.stdin);print('workers.dev',d['success'],d['errors'])"
