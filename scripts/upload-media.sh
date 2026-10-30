#!/usr/bin/env bash
# Upload films and posters in media/ to the R2 bucket behind https://media.motionboard.app.
# Usage: scripts/upload-media.sh [file ...]   (no arguments uploads everything in media/)
set -euo pipefail
cd "$(dirname "$0")/../media"
BUCKET=motionboard-media

files=("$@")
[ ${#files[@]} -eq 0 ] && files=(*)

failed=0
for f in "${files[@]}"; do
  f=$(basename "$f")
  case "$f" in
    *.mp4) type=video/mp4 ;;
    *.jpg) type=image/jpeg ;;
    *) echo "skip $f"; continue ;;
  esac
  ok=0
  for _ in 1 2 3 4; do
    if out=$(cf r2 objects put "$f" --bucket-name "$BUCKET" --file "$f" --content-type "$type" 2>&1) && ! grep -q 'fetch failed\|"success": false' <<<"$out"; then
      ok=1
      break
    fi
    sleep 2
  done
  if [ $ok = 1 ]; then echo "ok   $f"; else echo "FAIL $f"; failed=$((failed + 1)); fi
done
[ $failed = 0 ] || { echo "$failed failed"; exit 1; }
