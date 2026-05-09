import { NextResponse } from "next/server";
import postgres from "postgres";

type LeadPayload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  message?: unknown;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

let client: ReturnType<typeof postgres> | null = null;

function getDatabase() {
  const connectionString =
    process.env.SUPABASE_DB_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL;

  if (!connectionString) return null;

  client ??= postgres(connectionString, {
    max: 1,
    ssl: "require",
  });

  return client;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as LeadPayload;
  const name = clean(payload.name);
  const email = clean(payload.email);
  const company = clean(payload.company);
  const message = clean(payload.message);

  if (!name || !email || !message) {
    return NextResponse.json(
      { message: "Please fill in name, email, and message." },
      { status: 400 }
    );
  }

  const sql = getDatabase();

  if (!sql) {
    return NextResponse.json(
      { message: "Database is not connected yet." },
      { status: 503 }
    );
  }

  await sql`
    INSERT INTO leads (name, email, company, message)
    VALUES (${name}, ${email}, ${company || null}, ${message})
  `;

  return NextResponse.json({ message: "Thanks, we will be in touch soon." });
}
