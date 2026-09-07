#!/bin/bash
# Builds "Hot n' Hazy POS.app" and wraps it in a .dmg for the Mac at the
# counter.
#
# Uses only tools macOS ships with — osacompile, iconutil, sips, hdiutil — so
# there is nothing to install and no network needed.
#
#   ./tools/build-dmg.sh          →  dist/Hot-n-Hazy-POS.dmg
#
# The app is a launcher: it starts the bundled server and opens the till in a
# chrome-less window. Node.js has to be on the Mac; the app says so plainly if
# it is not. This is a MAC disk image — it does not run on a phone. For phones,
# install the web app from the browser (see README).
set -euo pipefail

cd "$(dirname "$0")/.."

APP_NAME="Hot n' Hazy POS"
BUNDLE_ID="com.hotnhazy.pos"
VERSION="0.1.0"
DIST="dist"
APP="$DIST/$APP_NAME.app"
DMG="$DIST/Hot-n-Hazy-POS.dmg"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

rm -rf "$DIST"
mkdir -p "$DIST"

echo "→ compiling launcher"
# -s makes it stay open, so quitting the app also stops the server.
osacompile -o "$APP" -s tools/launcher.applescript

echo "→ bundling the till"
RES="$APP/Contents/Resources/app"
mkdir -p "$RES"
# Everything the app serves. Deliberately explicit: no dist/, no tools/, no
# .git, so the bundle cannot end up containing a copy of itself.
cp index.html manifest.webmanifest sw.js favicon.svg serve.mjs package.json README.md "$RES/"
cp -R src icons "$RES/"

echo "→ building the icon"
ICONSET="$STAGE/icon.iconset"
mkdir -p "$ICONSET"
for size in 16 32 128 256 512; do
  sips -z "$size" "$size" icons/icon-1024.png --out "$ICONSET/icon_${size}x${size}.png" >/dev/null
  double=$((size * 2))
  sips -z "$double" "$double" icons/icon-1024.png --out "$ICONSET/icon_${size}x${size}@2x.png" >/dev/null
done
# osacompile bundles look for applet.icns by name.
iconutil -c icns "$ICONSET" -o "$APP/Contents/Resources/applet.icns"

echo "→ writing Info.plist"
PLIST="$APP/Contents/Info.plist"
# plutil, not PlistBuddy: PlistBuddy re-parses its own command string and reads
# the apostrophe in "Hot n' Hazy POS" as an opening quote. plutil takes the
# value as a real argument, so ordinary shell quoting is enough.
set_plist() { plutil -replace "$1" -string "$2" "$PLIST"; }
set_plist CFBundleName "$APP_NAME"
set_plist CFBundleDisplayName "$APP_NAME"
set_plist CFBundleIdentifier "$BUNDLE_ID"
set_plist CFBundleShortVersionString "$VERSION"
set_plist CFBundleVersion "$VERSION"
set_plist NSHumanReadableCopyright "Hot n' Hazy, Bokaro Steel City"
# No LSUIElement here on purpose: the app stays open so that quitting it stops
# the server, and it needs a Dock icon to be quittable.

# An unsigned bundle whose contents changed after compiling keeps a stale
# signature, and Gatekeeper refuses to launch it. Re-sign ad-hoc.
echo "→ re-signing (ad-hoc)"
codesign --force --deep --sign - "$APP" 2>/dev/null || echo "  (codesign unavailable — the app will need a right-click → Open)"

echo "→ making the disk image"
VOL="$STAGE/volume"
mkdir -p "$VOL"
cp -R "$APP" "$VOL/"
ln -s /Applications "$VOL/Applications"
cat > "$VOL/Read me first.txt" <<'NOTE'
Hot n' Hazy POS
===============

Drag "Hot n' Hazy POS" into the Applications folder, then open it.

The app starts a small server on your Mac and opens the till in its own
window. Quitting the app stops the server. Node.js must be installed
(nodejs.org) — the app will tell you if it is missing.

Running it on a phone or tablet instead
---------------------------------------
This disk image is for macOS only. On a phone, open the till's address in
the browser and use "Add to Home Screen" — it installs as an app and keeps
working with no signal. See README.md inside the app bundle.
NOTE

hdiutil create \
  -volname "$APP_NAME" \
  -srcfolder "$VOL" \
  -ov -format UDZO \
  "$DMG" >/dev/null

echo
echo "built $DMG ($(du -h "$DMG" | cut -f1))"
echo "      $APP"
