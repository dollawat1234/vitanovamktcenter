# Production Spec

This document is the working baseline for future development on the marketing site.

## Production Location

- GitHub repository: https://github.com/dollawat1234/vitanovamktcenter
- Default branch: `main`
- Local workspace: `/Users/dollawat_mac/Documents/Codex/2026-05-09/marketing-github-vercel-vercel-plugin-vercel`
- Intended hosting: Vercel
- Intended database: Vercel Postgres / Neon-compatible Postgres

## Current Product Scope

The production surface is Vitanova Marketing Center, an internal marketing tool for bilingual brand guidance, claim-safe wording, and reusable AI prompts.

Current surfaces:

- Production entry at `/`, redirected by Next.js to `/vmc/index.html`
- Static app source at `index.html`, `data/`, and `src/`
- Served production copy at `public/vmc/`
- Brand Library with 5 brands, bilingual TH/EN content, 5 tabs, copy controls, and JSON export

## Technical Stack

- Static HTML/CSS/vanilla ES modules for the tool UI
- Next.js App Router currently acts as the Vercel shell and redirects `/` to `/vmc/index.html`
- Vercel deployment target
- No production database is required for V1

## Environment Variables

No environment variables are required for V1 of Vitanova Marketing Center.

## Data Contract

Brand data lives in `data/brands.js`.

Each brand contains:

- `name`
- `colors`
- `th`
- `en`

## Design Direction

The interface should feel like an internal premium marketing operating system: calm, fast to scan, copy-friendly, bilingual, and safe for regulated health/beauty content.

Current visual direction:

- Warm cream workspace
- Dark left navigation
- Mint primary accent
- Purple secondary accent
- Compact cards and tabs for repeated daily use

Future design work should preserve this baseline unless the product direction changes.

## Development Rules For Future Work

- Keep the tool as the first screen, not a marketing placeholder.
- Add features in small, production-shaped slices.
- Keep source files and `public/vmc/` production copy in sync while the project remains deployed through Next.js.
- Avoid committing secrets or local environment files.
- Keep copy specific to Vitanova brands instead of generic filler.

## Next Production Steps

1. Deploy the updated `main` branch on Vercel.
2. Open `https://vitanovamktcenter.vercel.app`.
3. Verify the redirect to `/vmc/index.html`.
4. QA brand switching, TH/EN toggle, copy buttons, claim tags, palette copy, and JSON export.
