# Marketing Site

Marketing website prepared for GitHub, Vercel, and a Postgres database.

## Stack

- Next.js App Router
- Vercel hosting
- Vercel Postgres / Neon-compatible Postgres
- Lead capture API at `/api/leads`

## Database

Create a Vercel-managed Postgres database, pull the generated environment variables, then run the SQL in `db/schema.sql`.

Required environment variables are listed in `.env.example`.

## Deployment

1. Push this repository to GitHub.
2. Import the repository into Vercel.
3. Add the Postgres integration in Vercel.
4. Run `db/schema.sql` against the database.
5. Deploy.
