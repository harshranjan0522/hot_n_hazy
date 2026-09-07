#!/bin/bash
# Regenerates every app icon from the two SVGs in icons/.
#
#   icons/icon.svg             full-bleed mark — web manifest, Mac app, legacy
#                              Android launcher
#   icons/icon-foreground.svg  transparent, inset inside the adaptive-icon safe
#                              zone — Android adaptive foreground
#
# Uses only what macOS ships with: qlmanage renders the SVGs, sips resizes. The
# PNGs it writes are committed, so a normal checkout needs nothing.
set -euo pipefail

cd "$(dirname "$0")/.."
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

render() { # svg -> a 1024px PNG path on stdout
  # Separate declarations: bash expands every argument to `local` before it
  # assigns any of them, so $svg would still be unbound on one line.
  local svg="$1"
  local out="$TMP/$(basename "$svg").png"
  qlmanage -t -s 1024 -o "$TMP" "$svg" >/dev/null 2>&1
  [ -f "$out" ] || { echo "qlmanage produced nothing for $svg" >&2; exit 1; }
  echo "$out"
}

echo "→ web + Mac icons"
BIG="$(render icons/icon.svg)"
# 1024 for the Mac app, 512/192 for the web manifest, 180 for iOS home screen.
for size in 1024 512 192 180; do
  sips -z "$size" "$size" "$BIG" --out "icons/icon-${size}.png" >/dev/null
done

echo "→ Android launcher icons"
FG="$(render icons/icon-foreground.svg)"
RES="android/app/src/main/res"
# mdpi/hdpi/xhdpi/xxhdpi/xxxhdpi. The legacy icon is the full-bleed mark; the
# adaptive foreground is the inset one, at 108dp equivalents.
set -- "mdpi 48 108" "hdpi 72 162" "xhdpi 96 216" "xxhdpi 144 324" "xxxhdpi 192 432"
for entry in "$@"; do
  set -- $entry
  density="$1" legacy="$2" fg="$3"
  mkdir -p "$RES/mipmap-$density"
  sips -z "$legacy" "$legacy" "$BIG" --out "$RES/mipmap-$density/ic_launcher.png" >/dev/null
  sips -z "$legacy" "$legacy" "$BIG" --out "$RES/mipmap-$density/ic_launcher_round.png" >/dev/null
  sips -z "$fg" "$fg" "$FG" --out "$RES/mipmap-$density/ic_launcher_foreground.png" >/dev/null
done

echo
echo "wrote:"
ls icons/*.png | sed 's/^/  /'
echo "  $RES/mipmap-*/ (ic_launcher, ic_launcher_round, ic_launcher_foreground)"
