#!/usr/bin/env bash
# Fail when any commit in BASE_SHA..HEAD_SHA has a git author other than
# skydoy <25871317+skydoy@users.noreply.github.com>.
# The range is exactly base..head: commits reachable from head and not from
# base. History that is only on the base branch is not checked.
# Committer identity and Co-authored-by trailers are ignored.
set -euo pipefail

required_name="skydoy"
required_email="25871317+skydoy@users.noreply.github.com"
required="${required_name} <${required_email}>"

base="${BASE_SHA:-}"
head="${HEAD_SHA:-}"

die() {
  echo "ERROR: $*"
  exit 2
}

if [[ -z "$base" || -z "$head" ]]; then
  die "BASE_SHA and HEAD_SHA are required."
fi

if [[ ! "$base" =~ ^[0-9a-fA-F]{40}$ ]]; then
  die "BASE_SHA is not a full 40-character commit id."
fi
if [[ ! "$head" =~ ^[0-9a-fA-F]{40}$ ]]; then
  die "HEAD_SHA is not a full 40-character commit id."
fi

if ! git cat-file -e "${base}^{commit}" 2>/dev/null; then
  die "Base commit ${base} is not in this repository."
fi
if ! git cat-file -e "${head}^{commit}" 2>/dev/null; then
  die "Head commit ${head} is not in this repository."
fi

logf=$(mktemp)
trap 'rm -f "$logf"' EXIT

# Raw author fields (%an/%ae). --no-use-mailmap keeps .mailmap from rewriting them.
if ! git -c log.mailmap=false log --no-use-mailmap -z \
  --format='format:%H%x00%an%x00%ae' "${base}..${head}" >"$logf"; then
  die "Could not list commits in ${base}..${head}."
fi

one_line() {
  local value="$1"
  value=${value//$'\r'/}
  value=${value//$'\n'/\\n}
  printf '%s' "$value"
}

checked=0
bad=0
bad_report=$(mktemp)
trap 'rm -f "$logf" "$bad_report"' EXIT

while IFS= read -r -d '' sha || [[ -n "${sha:-}" ]]; do
  IFS= read -r -d '' name || true
  IFS= read -r -d '' email || true
  if [[ -z "$sha" ]]; then
    continue
  fi
  checked=$((checked + 1))
  if [[ "$name" != "$required_name" || "$email" != "$required_email" ]]; then
    bad=$((bad + 1))
    printf '%s\t%s\t%s\n' "$sha" "$(one_line "$name")" "$(one_line "$email")" >>"$bad_report"
  fi
done <"$logf"

echo "Required author: ${required}"
echo "Range: ${base}..${head}"

if [[ "$bad" -ne 0 ]]; then
  echo "Commit author check failed: ${bad} commit(s) in ${base}..${head} are not authored by ${required}."
  echo "Offending commits:"
  while IFS=$'\t' read -r sha name email; do
    [[ -z "$sha" ]] && continue
    echo "  ${sha}  ${name} <${email}>"
    # Keep the Actions annotation on one line.
    note="Commit ${sha} author is ${name} <${email}>; required author is ${required}"
    note=${note//%/%25}
    note=${note//$'\n'/%0A}
    note=${note//$'\r'/%0D}
    echo "::error title=Unexpected commit author::${note}"
  done <"$bad_report"
  exit 1
fi

echo "Commit author check passed: ${checked} commit(s) in ${base}..${head} authored by ${required}."
