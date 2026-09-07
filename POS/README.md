# Hot n' Hazy — POS

Counter till for the cart in Bokaro Steel City. Four screens deep, no build
step, no dependencies, no network needed once the folder is on the machine.

## Running it

```bash
node serve.mjs          # http://localhost:8173
node serve.mjs 9000     # different port
```

ES modules will not load over `file://`, which is the only reason a server is
involved. Any static server works — `serve.mjs` is bundled so the machine needs
nothing but Node.

## Installing it as an app

### On a phone or tablet — any phone, Android or iPhone

The till is a installable web app (PWA), so it needs no store and no build:

1. Put the folder on a machine on the same Wi-Fi and run `node serve.mjs`.
   Note that machine's address (`ipconfig getifaddr en0` on a Mac).
2. On the phone, open `http://<that-address>:8173` in the browser.
3. **Android/Chrome:** menu → *Install app* (or the *Add to Home screen*
   prompt). **iPhone/Safari:** Share → *Add to Home Screen*.

It then opens fullscreen from the home screen with its own icon, and the
service worker keeps the whole till cached — **once installed it runs with no
signal at all**, which matters on a cart. Orders, the menu and the day's log
live in that phone's own storage.

Because the shell is cached, an installed till keeps serving its cached copy
even after you edit the source. **After changing any file, bump `CACHE` in
`sw.js`** (`hnh-pos-v1` → `v2`); the next load then picks everything up and
drops the old cache. Prices changed in the admin window are unaffected — those
live in storage, not in the cached files.

For a phone to be the *only* machine, host the folder once on any static host
(GitHub Pages, Netlify, a Vercel static deploy) and install from that URL —
after the first load nothing goes over the network.

### On the Mac at the counter — .dmg

```bash
./tools/build-dmg.sh        # → dist/Hot-n-Hazy-POS.dmg
```

Built entirely with tools macOS ships with (`osacompile`, `iconutil`, `sips`,
`hdiutil`) — nothing to install, no network. Open the image, drag the app to
Applications, launch it: it starts the bundled server and opens the till in its
own chrome-less window. It stays in the Dock while running, and quitting it
stops the server. Node.js must be on the Mac; the app says so plainly if it is
not.

Unsigned, so the first launch needs a right-click → **Open** (or *System
Settings → Privacy & Security → Open Anyway*).

**A `.dmg` is a macOS disk image — it cannot run on a phone.** Phones use the
PWA install above, or the `.apk` below.

### On an Android phone — .apk

```bash
./tools/build-apk.sh              # → dist/Hazy-POS-debug.apk
./tools/build-apk.sh release      # unsigned release build
```

The project lives in `android/`. The APK is a WebView wrapper around the very
same files the browser serves: the script copies them into
`android/app/src/main/assets` and Gradle builds, so the app can never drift
from the web build. Install it with `adb install -r dist/Hazy-POS-debug.apk`,
or copy the file to the phone and tap it.

What the wrapper adds over the PWA:

- **Printing works.** A WebView ignores `window.print()` outright, so receipts
  would silently never print. `MainActivity` exposes a bridge and repoints
  `window.print` at Android's print dialog, which is where a Bluetooth or USB
  thermal printer gets picked.
- **No permissions at all** — not even `INTERNET`. The till is served from
  bundled assets by `WebViewAssetLoader`, over a real `https://` origin so ES
  modules, `localStorage` and the service worker behave exactly as in a
  browser. (A `file://` URL would break all three.)
- Back button needs two presses to leave, so a stray tap cannot bin a
  half-built order. The screen is kept awake.
- The shop's prices survive a phone restore, via `backup_rules.xml`.

**This needs a toolchain the repo cannot carry:** a JDK 17+ and the Android
SDK. `build-apk.sh` checks for both up front and prints the exact `brew`
commands if either is missing, rather than failing halfway through Gradle. The
short version:

```bash
brew install --cask temurin@17 android-studio
# then open the android/ folder in Android Studio once, to fetch the SDK
```

A debug APK is signed with Android's debug key — fine for the shop's own
phones. Play Store upload needs a release build signed with your own keystore.

### On an iPhone

iOS has no sideloading, so there is no `.ipa` to hand around: an App Store
build needs a paid Apple developer account and review. Use the *Add to Home
Screen* install above — on iOS it is the same app, fullscreen, offline, with
its own icon. The one difference is printing, which goes through Safari's share
sheet rather than a native dialog.

## The flow

1. **Who's this?** — one card per person on the counter.
2. **PIN** — 4 digits, submits itself on the fourth. Factory PINs: Aryan
   `1111`, Gyani `2222`, Ashwani `3333`. Change them in the admin window on day
   one.
3. **New order** — four sections stacked vertically, each a horizontal track you
   swipe sideways. Momos and Burgers & Fries are split into the same panels the
   menu board uses (Steam Momo → Veg / Paneer / Cheese Corn / Chicken).
   Tapping an item opens the popup: a quantity per size (half and full each
   have their own counter, so both can go on in one visit) → add-ons → Done.
   Cheese (+₹15) is offered only on Hazy Hero and Hazy Hunter.
   The green **Proceed** button appears bottom-right once anything is in the
   cart; the chip beside it opens the cart for edits.
4. **Customer** — name plus the order number this order will carry
   (`#hazy0001` upward). Back left, Proceed right.
5. **Take Away / Dine In** — either goes straight to payment.
6. **Payment** — summary on the left, *Pay at counter* and *UPI* on the right.
   UPI shows an empty QR box; drop the real QR in when the gateway is picked.
7. **Print** — see below. Then *New order* for the next customer.

The hamburger is on every screen after the PIN: **All orders**, **Admin
window** (or **Switch to user view** when you are already in it), **Switch
user**, **Logout**.

## Receipts

One print job per order:

- **1 customer copy** — every line across every section, with the grand total.
- **1 kitchen slip per section** — the momo pan, the chiller and the griddle
  each get only their own lines and their own subtotal.

Every slip carries name, order number, Take Away / Dine In, cashier, payment
method, time, and each line's size, quantity, rate and amount. Laid out for an
80 mm thermal roll (`@page size: 80mm auto`), one slip per page; prints fine on
A4 too. *Print again* on the confirmation screen re-sends the same job.

## All orders

Everything sold in the current **12-hour window**, newest first, with order
count and takings. The log clears itself once the window expires — on boot or
when the screen is opened — so a machine left on overnight starts the next
shift clean. Order numbering does **not** reset, so receipt numbers stay
unique.

- **Download CSV** — one row per line item, ready for a spreadsheet.
- **Mail details** — opens the mail client with the shift report prefilled. Set
  the recipient under *Reports* in the admin window.
- **Clear log** — wipes it now and starts a fresh window.

## Admin window

Live-editable, saved as you leave each box:

- item names, half and full prices, and the cheese add-on price;
- add an item (name, which panel it joins, prices) or delete one;
- add, rename, re-PIN or remove a user — the last one cannot be removed;
- the report email;
- *Reset menu to defaults* restores the shipped menu without touching the
  orders log.

## Layout

```
index.html          markup shell + the hidden print root
manifest.webmanifest  PWA metadata — name, icons, standalone display
sw.js               service worker: caches the shell so it runs offline
serve.mjs           zero-dependency static server
icons/              app icon (icon.svg is the source; PNGs are generated)
tools/make-icons.sh regenerates every icon from icons/*.svg
tools/build-dmg.sh  builds the macOS .app and .dmg
tools/build-apk.sh  builds the Android .apk
tools/launcher.applescript  the Mac app's launcher
android/            Android project — WebView wrapper around the same files
src/js/data.js      factory menu, transcribed from the cart's menu boards
src/js/store.js     all state + localStorage; no DOM
src/js/app.js       router and app shell
src/js/ui.js        el() / money() helpers
src/js/receipt.js   customer copy + kitchen slips
src/js/screens/     one file per screen
src/js/components/  item popup, cart sheet, hamburger drawer
src/css/base.css    tokens, reset, shared chrome
src/css/screens.css one block per screen
src/css/print.css   the print sheet (media="print")
```

State lives in two localStorage keys: `hnh.pos.shop.v3` (menu, users, order
counter, orders log) and `hnh.pos.session.v3` (who is signed in, the cart in
progress — so an accidental refresh mid-order loses nothing).

## Prices

Transcribed from the Momos, Chillers and Bites boards on the cart. Chillers are
a flat ₹59; momo fulls are twice the half. Correct anything that moves in the
admin window — the file is only what a fresh machine starts with.

## Responsive

One layout, three shapes. Nothing scrolls sideways at any width:

- **desktop / counter screen** — style name on the left, its variants across;
  payment is summary-left, methods-right.
- **tablet** — the same, with variants wrapping.
- **phone** — the style name moves above its variants (2×2), payment stacks,
  and cart rows put the item name on its own line above the controls.

## Not wired up yet

- **UPI** — the QR box is deliberately empty pending a payment gateway.
- **Printer** — goes through the browser's print dialog. Set the thermal
  printer as default and turn off margins/headers for a clean roll.
