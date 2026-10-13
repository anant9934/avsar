import { neon } from "@neondatabase/serverless";
import { readMigrationFiles } from "drizzle-orm/migrator";

async function main() {
  const connectionString = process.env.DATABASE_DIRECT_URL;
  if (!connectionString) throw new Error("DATABASE_DIRECT_URL is required");
  const target = new URL(connectionString);
  if (
    target.protocol !== "postgresql:" &&
    target.protocol !== "postgres:"
  )
    throw new Error("A PostgreSQL connection URL is required");
  if (target.hostname.includes("-pooler"))
    throw new Error("Migrations require a direct, non-pooled Neon URL");

  const sql = neon(connectionString);
  const migrations = readMigrationFiles({ migrationsFolder: "./drizzle" });
  const [identity, existingTables] = await Promise.all([
    sql.query("select current_database() as database, current_user as role"),
    sql.query(
      "select table_name from information_schema.tables where table_schema = 'public' order by table_name",
    ),
  ]);
  if (!identity.length) throw new Error("Could not identify the database");

  await sql.transaction([
    sql.query("CREATE SCHEMA IF NOT EXISTS drizzle"),
    sql.query(
      "CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (id SERIAL PRIMARY KEY, hash text NOT NULL, created_at bigint)",
    ),
  ]);
  const applied = await sql.query(
    "select hash, created_at::text as created_at from drizzle.__drizzle_migrations order by created_at",
  );
  if (existingTables.length && !applied.length)
    throw new Error("Public tables exist without a migration journal; refusing to guess their state");

  const known = new Map(migrations.map((migration) => [migration.folderMillis, migration.hash]));
  for (const row of applied) {
    if (known.get(Number(row.created_at)) !== row.hash)
      throw new Error("Database migration journal differs from checked-in migrations");
  }
  const appliedTimes = new Set(applied.map((row) => Number(row.created_at)));
  console.log(
    `Target ${identity[0].database} as ${identity[0].role}; ${applied.length} migrations already applied.`,
  );
  for (const migration of migrations) {
    if (appliedTimes.has(migration.folderMillis)) continue;
    const statements = migration.sql.flatMap((entry) =>
      entry
        .split(/;\s*(?=(?:CREATE|ALTER|DROP)\b)/i)
        .map((statement) => statement.trim().replace(/;$/, ""))
        .filter(Boolean),
    );
    await sql.transaction([
      ...statements.map((statement) => sql.query(statement)),
      sql.query(
        "insert into drizzle.__drizzle_migrations (hash, created_at) values ($1, $2)",
        [migration.hash, migration.folderMillis],
      ),
    ]);
    console.log(`Applied migration ${migration.folderMillis} (${statements.length} statements).`);
  }
  console.log("Neon migration journal is current.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Migration failed");
  process.exitCode = 1;
});
