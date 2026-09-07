#!/bin/bash
# Builds the Android APK.
#
#   ./tools/build-apk.sh            debug APK, ready to sideload
#   ./tools/build-apk.sh release    unsigned release APK
#
# The APK is a WebView wrapper around the very same files the browser serves:
# this script copies them into android/app/src/main/assets, then Gradle builds.
# Nothing is duplicated by hand, so the app can never drift from the web build.
#
# Unlike build-dmg.sh, this one needs a real toolchain — a JDK and the Android
# SDK. It checks for both and tells you exactly what to install if they are
# missing, rather than failing halfway through a Gradle run.
set -euo pipefail

cd "$(dirname "$0")/.."
VARIANT="${1:-debug}"
GRADLE_VERSION="8.9"     # matches the AGP version in android/build.gradle

# ---------------------------------------------------------------- toolchain --
missing=0

# macOS ships stubs at /usr/bin/javac and /usr/bin/java that exist with no JVM
# behind them, so `command -v javac` is a false positive. Run it instead.
have_jdk() {
  /usr/libexec/java_home -v 17 >/dev/null 2>&1 && return 0
  javac -version >/dev/null 2>&1 && return 0
  return 1
}

if ! have_jdk; then
  cat >&2 <<'NEEDJDK'
✗ No JDK 17 found.

    brew install --cask temurin@17

  (or any JDK 17+; Android Gradle Plugin 8.x will not run on an older one.)
NEEDJDK
  missing=1
fi

SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$HOME/Library/Android/sdk}}"
if [ ! -d "$SDK/platforms" ]; then
  cat >&2 <<NEEDSDK
✗ No Android SDK at $SDK

  Easiest — install Android Studio, open the android/ folder, and it fetches
  the SDK for you:

    brew install --cask android-studio

  Command line only:

    brew install --cask android-commandlinetools
    export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
    sdkmanager --install "platform-tools" "platforms;android-35" "build-tools;35.0.0"
    sdkmanager --licenses

NEEDSDK
  missing=1
fi

if ! command -v gradle >/dev/null 2>&1 && [ ! -x android/gradlew ]; then
  echo "✗ No Gradle and no android/gradlew wrapper." >&2
  echo >&2
  echo "    brew install gradle" >&2
  echo >&2
  echo "  (only needed once — the wrapper is generated on the first run and" >&2
  echo "   pins Gradle $GRADLE_VERSION from then on.)" >&2
  missing=1
fi

if [ "$missing" -ne 0 ]; then
  echo "Install what is listed above, then run this script again." >&2
  echo "Nothing else is needed — the project itself is complete." >&2
  exit 1
fi

export ANDROID_HOME="$SDK"

# ------------------------------------------------------------------- assets --
echo "→ syncing the till into the APK assets"
ASSETS="android/app/src/main/assets"
rm -rf "$ASSETS"
mkdir -p "$ASSETS"
# Exactly what serve.mjs serves. No serve.mjs itself — inside the APK,
# WebViewAssetLoader does that job.
cp index.html manifest.webmanifest sw.js favicon.svg "$ASSETS/"
cp -R src icons "$ASSETS/"

# ------------------------------------------------------------------- gradle --
cd android
if [ ! -x ./gradlew ]; then
  echo "→ generating the Gradle wrapper (pins $GRADLE_VERSION)"
  gradle wrapper --gradle-version "$GRADLE_VERSION" --distribution-type bin
fi

case "$VARIANT" in
  debug)   TASK=assembleDebug;   OUT=app/build/outputs/apk/debug/app-debug.apk ;;
  release) TASK=assembleRelease; OUT=app/build/outputs/apk/release/app-release-unsigned.apk ;;
  *) echo "unknown variant '$VARIANT' — use debug or release" >&2; exit 1 ;;
esac

echo "→ ./gradlew $TASK"
./gradlew "$TASK"

cd ..
DEST="dist/Hazy-POS-$VARIANT.apk"
mkdir -p dist
cp "android/$OUT" "$DEST"

echo
echo "built $DEST ($(du -h "$DEST" | cut -f1))"
if [ "$VARIANT" = "debug" ]; then
  cat <<'INSTALL'

Put it on the counter phone either way:
  · cable      adb install -r dist/Hazy-POS-debug.apk
  · no cable   copy the .apk to the phone and tap it
               (Settings will ask you to allow installing from this source)

A debug APK is signed with Android's debug key — fine for the shop's own
phones, but Play Store upload needs a release build signed with your own
keystore.
INSTALL
fi
