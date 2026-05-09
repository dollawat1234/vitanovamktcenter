# Production Spec

This document is the working baseline for future development on the marketing site.

## Production Location

- GitHub repository: https://github.com/dollawat1234/vitanovamktcenter
- Default branch: `main`
- Local workspace: `/Users/dollawat_mac/Documents/Codex/2026-05-09/marketing-github-vercel-vercel-plugin-vercel`
- Intended hosting: Vercel
- Intended database: Vercel Postgres / Neon-compatible Postgres

## Current Product Scope

The site is a conversion-focused marketing website with a lead capture flow.

Current surfaces:

- Landing page at `/`
- Lead capture form on the landing page
- Lead submission API at `/api/leads`
- Postgres table schema in `db/schema.sql`

## Technical Stack

- Next.js App Router
- React
- TypeScript
- Global CSS in `app/globals.css`
- Vercel deployment target
- `@vercel/postgres` for server-side database access

## Environment Variables

Required database variables are listed in `.env.example`.

- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

Do not commit real secret values.

## Database Contract

The `leads` table is the first production database table.

Required columns:

- `id`
- `name`
- `email`
- `message`
- `created_at`

Optional columns:

- `company`

Schema source of truth:

- `db/schema.sql`

## Lead Capture Behavior

The lead form collects:

- Name
- Email
- Company
- Message

The API route validates that name, email, and message are present. If the database is not connected, it returns a clear service unavailable response instead of pretending the lead was saved.

## Design Direction

The interface should feel polished, clear, and conversion-oriented. Keep the page practical and readable, with strong first-screen positioning and obvious calls to action.

Current visual direction:

- Editorial marketing page
- Warm neutral base
- Teal accent
- Gold primary action
- Full-bleed hero image
- Compact sections for credibility and lead capture

Future design work should preserve this baseline unless the product direction changes.

## Development Rules For Future Work

- Keep the landing page as the first screen, not a marketing placeholder.
- Add features in small, production-shaped slices.
- Keep database changes reflected in `db/schema.sql`.
- Keep new required environment variables documented in `.env.example`.
- Avoid committing secrets or local environment files.
- Prefer Vercel-native services for hosting and database integration.
- Keep copy specific to the campaign/business instead of generic filler.

## Next Production Steps

1. Import the GitHub repository into Vercel.
2. Create/connect a Vercel Postgres database.
3. Add the generated environment variables to Vercel.
4. Run `db/schema.sql` against the production database.
5. Deploy from the `main` branch.
6. Submit a test lead and verify it appears in the database.
