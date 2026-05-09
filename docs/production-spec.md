# Production Spec

This document is the working baseline for future development on the marketing site.

## Production Location

- GitHub repository: https://github.com/dollawat1234/vitanovamktcenter
- Default branch: `main`
- Local workspace: `/Users/dollawat_mac/Documents/Codex/2026-05-09/marketing-github-vercel-vercel-plugin-vercel`
- Intended hosting: Vercel
- Intended database: Supabase Postgres

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
- `postgres` for server-side Supabase Postgres access

## Environment Variables

Required database variables are listed in `.env.example`.

- `SUPABASE_PROJECT_REF=hazqbyphdupfwejsenro`
- `SUPABASE_URL=https://hazqbyphdupfwejsenro.supabase.co`
- `SUPABASE_DB_HOST=db.hazqbyphdupfwejsenro.supabase.co`
- `SUPABASE_DB_URL`

The API also accepts `DATABASE_URL` or `POSTGRES_URL` as fallback connection-string names.

Do not commit real secret values.

## Supabase Production Project

- Project name: `VitanovaMKTcenter`
- Project ref / ID: `hazqbyphdupfwejsenro`
- Project URL: `https://hazqbyphdupfwejsenro.supabase.co`
- Region: `ap-northeast-2`
- Database host: `db.hazqbyphdupfwejsenro.supabase.co`
- Postgres version: `17.6.1.121`

## Database Contract

Vitanova Marketing Center uses a deliberate split between local static data and Supabase data.

| Module | Data source | Reason |
| --- | --- | --- |
| 01 Brand Library | `brands.js` local | Static brand rules do not change often and should be reviewed through code changes. |
| 02 Product Library | Supabase `products` | Products change often and need CRUD. |
| 03 Image Library | Supabase `images` + Storage buckets | Real image files need upload and management. |
| 04 Prompt Generator | Supabase `prompts` | Prompt history should be saved and reused. |
| 05 Daily Work | Supabase `work_logs` | Daily work logs need query by date and brand. |

Brand data remains local unless the user explicitly changes the architecture.

## Storage Contract

Supabase Storage has two primary buckets:

- `brand-assets`: logos, hero images, visual references at brand level.
- `product-assets`: product photos, packaging images, lifestyle references.

The `images` table is the metadata registry for Storage. It stores the `bucket`, `path`, `owner_type`, `owner_id`, and `image_type`.

Allowed `owner_type` values:

- `brand`
- `product`

Allowed `image_type` values:

- `logo`
- `hero`
- `main`
- `packaging`
- `ref`

## Database Tables

The `leads` table stores lead submissions.

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

Additional Supabase tables:

- `products`: product library records keyed by `brand_id`.
- `images`: image metadata registry for files in `brand-assets` and `product-assets`.
- `prompts`: prompt generation history and reusable outputs.
- `work_logs`: daily work logs queryable by `work_date`, `brand_id`, and related product.

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
- Use Vercel for hosting and Supabase for the production Postgres database.
- Keep copy specific to the campaign/business instead of generic filler.

## Next Production Steps

1. Import the GitHub repository into Vercel.
2. Add `SUPABASE_DB_URL` to Vercel environment variables.
3. Run `db/schema.sql` against the production Supabase database when schema changes.
4. Confirm `/api/leads` can insert a test lead.
5. Deploy from the `main` branch.
6. Submit a test lead and verify it appears in the database.
