#!/usr/bin/env bash
# extension/ 내용물을 Chrome 웹스토어 업로드용 zip으로 패키징합니다.
# 버전은 extension/manifest.json의 "version" 값을 사용합니다.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/extension"
DIST="$ROOT/dist"

VERSION="$(sed -n 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$SRC/manifest.json" | head -n 1)"
if [ -z "$VERSION" ]; then
  echo "manifest.json에서 version을 찾을 수 없습니다." >&2
  exit 1
fi

OUT="$DIST/github-pull-request-helper-v$VERSION.zip"
mkdir -p "$DIST"
rm -f "$OUT"

# manifest.json이 zip 최상위에 오도록 extension/ 안에서 압축
(cd "$SRC" && zip -rq "$OUT" . -x "*.DS_Store")

echo "Created: ${OUT#$ROOT/}"
