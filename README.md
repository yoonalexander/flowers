# Flowers

A small, handcrafted meadow experience built with React, TypeScript, and Vite. Guide a bunny through seven flowers, read their messages, then watch the discoveries become a bouquet and reveal a final question.

## Develop

```bash
npm ci
npm run dev      # local development server
npm run test     # unit tests
npm run lint     # ESLint
npm run build    # TypeScript check and production build
npm run preview  # preview the production build
```

Open `http://localhost:5173/flowers/` for development or `http://localhost:4173/flowers/` for the production preview. If Vite chooses another port, use the URL printed in the terminal.

## How it works

- Move the bunny with the arrow keys or WASD. Touch devices receive an on-screen directional pad.
- Move close to a flower, or focus it with the keyboard and press Enter or Space, to collect it and reveal its message.
- Discovery progress is kept in `sessionStorage` for the current browser tab. Unknown saved flower IDs are ignored.
- After the seventh message is closed, the meadow transitions into the completed bouquet and final proposal.
- Reduced-motion preferences remove looping movement, collection bursts, and reveal delays while preserving every state change.
- In development, use the visible reset control or press `Shift+Alt+R` to clear progress and return the bunny to its starting position.

## Editing the content

All copy, flowers, colours, bouquet positions, and meadow positions live in **`src/data/flowers.ts`**.

## Vercel deployment

Create the flowers deployment as a **Vite** project. Vercel should detect it automatically from `package.json`.

- Framework preset: `Vite`
- Root directory: repository root
- Install command: `npm ci` (or leave the detected npm default)
- Build command: `npm run build`
- Output directory: `dist`
- Node.js version: a current Vite-supported LTS release

`vite.config.ts` keeps `base: '/flowers/'`, so generated scripts, styles, and fonts load beneath `/flowers/assets/`. This repo's `vercel.json` maps those public asset paths to the physical Vite output before applying the SPA fallbacks.

The public route is owned by the separate `alexyoon.com` Vercel project. Configure that project to proxy both `/flowers` and `/flowers/:path*` to this project's stable Vercel origin, forwarding the remainder without the `/flowers` prefix:

```json
{
  "rewrites": [
    { "source": "/flowers", "destination": "https://FLOWERS_ORIGIN/" },
    {
      "source": "/flowers/:path*",
      "destination": "https://FLOWERS_ORIGIN/:path*"
    }
  ]
}
```

Replace `FLOWERS_ORIGIN` with this project's stable Vercel hostname. Avoid absolute asset paths such as `/image.png`; use imports or relative paths instead.
