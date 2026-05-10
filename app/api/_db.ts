import postgres from "postgres";

let client: ReturnType<typeof postgres> | null = null;

export function getDatabase() {
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
