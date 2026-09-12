import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// NOTE: Never throw at import time. Vercel runs `next build` without
// DATABASE_URL set, and Next collects page data for /api/* routes during
// the build. Throwing here crashes the entire build with:
//   Error: DATABASE_URL is required
// Instead we lazily create the pool on first actual query and provide
// clear fallbacks in API routes when the DB is not configured.

const databaseUrl = process.env.DATABASE_URL;

type DrizzleDb = ReturnType<typeof drizzle>;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsDrizzleDb?: DrizzleDb;
};

export function isDatabaseConfigured(): boolean {
  return !!databaseUrl && databaseUrl.length > 0;
}

function createPool(): Pool {
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not configured. Set it in Vercel Project Settings → Environment Variables (and locally in .env) to enable PostgreSQL persistence."
    );
  }
  if (globalForDb.__arenaNextJsPostgresqlPool) {
    return globalForDb.__arenaNextJsPostgresqlPool;
  }
  const pool = new Pool({ connectionString: databaseUrl });
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlPool = pool;
  }
  return pool;
}

export function getPool(): Pool {
  return createPool();
}

export function getDb(): DrizzleDb {
  if (globalForDb.__arenaNextJsDrizzleDb) {
    return globalForDb.__arenaNextJsDrizzleDb;
  }
  const pool = createPool();
  const db = drizzle(pool);
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsDrizzleDb = db;
  }
  return db;
}

// Back-compat `pool` export. Null when unconfigured so importing never throws.
export const pool: Pool | null = isDatabaseConfigured()
  ? createPool()
  : null;

// Back-compat `db` export via lazy Proxy.
// Importing this file never throws; only an actual query throws when unconfigured.
export const db: DrizzleDb = new Proxy({} as DrizzleDb, {
  get(_target, prop) {
    const real = getDb();
    const value = (real as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? value.bind(real) : value;
  },
});
