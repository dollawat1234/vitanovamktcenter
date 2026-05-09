# Marketing Site

Marketing website prepared for GitHub, Vercel, and the Supabase Postgres database used by VitanovaMKTcenter.

## Stack

- Next.js App Router
- Vercel hosting
- Supabase Postgres
- Lead capture API at `/api/leads`

## Production Spec

Use `docs/production-spec.md` as the source of truth for production location, stack, database contract, and future development rules.

## Database

Supabase production database:

- Project name: `VitanovaMKTcenter`
- Project ref: `hazqbyphdupfwejsenro`
- Project URL: `https://hazqbyphdupfwejsenro.supabase.co`
- Region: `ap-northeast-2`
- Database host: `db.hazqbyphdupfwejsenro.supabase.co`

The `leads` table schema lives in `db/schema.sql`.

Required environment variables are listed in `.env.example`. Add `SUPABASE_DB_URL` in Vercel as a server-side environment variable.

## Deployment

1. Push this repository to GitHub.
2. Import the repository into Vercel.
3. Add `SUPABASE_DB_URL` to Vercel environment variables.
4. Run `db/schema.sql` against the Supabase database when the schema changes.
5. Deploy.
