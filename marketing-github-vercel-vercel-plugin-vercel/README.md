# Vitanova Marketing Center

Vitanova Marketing Center is a production static web application for managing bilingual brand positioning, visual direction, claim-safe wording, and reusable AI prompts for Thai health and beauty marketing work.

## File Structure

- `index.html` is the HTML shell and loads all CSS/JS modules.
- `data/brands.js` stores bilingual brand data for Natwell, VitUS, Ella, Airizu, and Klear.
- `src/modules/` contains the app controller and tab renderers.
- `src/utils/` contains language state, copy helpers, and JSON export.
- `src/styles/` contains separated CSS for base, sidebar, topbar, brand list, tabs, and reusable components.
- `assets/logos/` is reserved for future logo assets.

## Production Spec

Use `docs/production-spec.md` as the source of truth for production location, stack, database contract, and future development rules.

## How To Run

Open `index.html` directly in a browser, or run it with any static server such as `live-server`.

## V1 Features

- Brand Library with 5 brands
- Bilingual TH/EN content
- 5 tabs: Overview, Voice & Visual, Rules, Claim Safety, Brand Prompt
- Copy-anywhere controls for words, examples, prompts, and color hex values
- Export brand data as JSON
