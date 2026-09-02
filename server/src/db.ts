// Thin Postgres access layer. Every query in the app goes through this file
// so there's exactly one place that knows whether a database is configured.
//
// Nothing here requires a database to exist for the server to boot — routes
// that need one call requireDb() and return a clear 503 with setup
// instructions instead of crashing, so the rest of the API (AI, payments
// order-creation) keeps working even before schema.sql has been run.

import pg from 'pg';

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool(): pg.Pool {
  if (!process.env.DATABASE_URL) {
    throw new DbNotConfiguredError();
  }
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Supabase's pooled connection string requires SSL; a local Postgres
      // instance during development typically doesn't — allow both.
      ssl: process.env.DATABASE_URL?.includes('supabase') ? { rejectUnauthorized: false } : undefined,
    });
  }
  return pool;
}

export class DbNotConfiguredError extends Error {
  constructor() {
    super(
      'DATABASE_URL is not set. Create a free Postgres project (e.g. supabase.com), run schema.sql against it, ' +
        'and set DATABASE_URL in server/.env — see server/README for the exact steps.'
    );
    this.name = 'DbNotConfiguredError';
  }
}

export async function query<T extends pg.QueryResultRow = any>(
  text: string,
  params: unknown[] = []
): Promise<pg.QueryResult<T>> {
  return getPool().query<T>(text, params);
}
