# Hot n' Hazy

Marketing site for **Hot n' Hazy** — the momo food truck at City Centre, Sector 4,
Bokaro Steel City. Built with Vite, React 19 and TypeScript.

## Getting started

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Dev server runs at http://localhost:5173.

## Scripts

| Command          | What it does                                    |
| ---------------- | ----------------------------------------------- |
| `pnpm dev`       | Dev server with hot reload                      |
| `pnpm build`     | Typecheck, then build to `dist/`                |
| `pnpm preview`   | Serve the production build locally              |
| `pnpm typecheck` | TypeScript, no emit                             |
| `pnpm check-env` | Verify `.env` has every key from `.env.example` |

## Editing the content

**`src/content.ts` is the single source of truth for every real-world fact** —
address, hours, price band, ratings, menu items, links and the Google reviews.
Change it there and it updates everywhere on the page. Nothing factual is
hardcoded in a component.

Things worth keeping current:

- `business.hours` — currently `5:30 PM – 10:00 PM`, from the owner's own
  description. Note the Google listing still shows `5:00 PM – 9:30 PM`; whichever
  is right, fix it in both places.
- `ratings` — Google 4.7 (32), Zomato 4.5 (96), Justdial 4.8 (29), read
  29 Aug 2026. These drift; refresh them now and then.
- `reviews` — quoted verbatim from Google, spelling and all. If you add more,
  keep them verbatim and keep them real.
- `menu` — item names are real, but **there are no per-item prices yet**. Each
  `MenuItem` has an optional `price` field ready for the real card; until it's
  filled the section shows the sourced `₹100 – ₹200` band instead.

## Layout

```
public/            favicon + robots.txt
src/
  components/      Nav, Hero, FoodTruck, Menu, Care, Testimonials, FindUs, Footer
                   plus the SVG art: Logo, Momo, Steam, Skyline
  lib/
    useSmoothScroll.ts   Lenis smooth scrolling + anchor/hash handling
  styles/
    global.css     design tokens (the red/orange/white/black palette) + base
    hero.css       the parallax hero
    sections.css   buttons, nav and everything below the hero
  content.ts       all real-world facts
tools/             local scripts, not shipped to the browser
```

`@/` is an alias for `src/`.

## How the motion works

- **Lenis** drives page scroll so the parallax glides instead of stepping.
- **Motion** (`motion/react`) handles the hero's scroll-linked layers, the
  reveal-on-scroll wrapper (`components/Reveal.tsx`), the menu tab pill and the
  mobile sheet.
- Layers move at different rates in `Hero.tsx` — back layers drift down slowly,
  foreground momos rush up. The pointer also leans the truck a few degrees.
- Everything collapses to a static, readable page under
  `prefers-reduced-motion: reduce`.

## Deploying

Push to GitHub and import the repo on [Vercel](https://vercel.com/new).
`vercel.json` already sets the build command, output directory and the SPA
rewrite. Add the `VITE_` variables from `.env.example` in the project's
environment-variable settings.
