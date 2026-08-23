#!/usr/bin/env bash
# Renders index.html to the CV PDF using headless Chrome's print pipeline.
# Produces real vector text (ATS-parsable), unlike a canvas/image export.
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
OUT="$DIR/Hatef Mohammad Ali - Digital Marketing Specialist.pdf"
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
PROFILE="$(mktemp -d)"
"$CHROME" --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer \
  --run-all-compositor-stages-before-draw --virtual-time-budget=12000 \
  --user-data-dir="$PROFILE" \
  --print-to-pdf="$(cygpath -w "$OUT" 2>/dev/null || echo "$OUT")" \
  "file:///$(echo "$DIR" | sed 's|^/\([a-z]\)|\1:|')/index.html"
rm -rf "$PROFILE"
echo "Wrote: $OUT"
