const { Pool } = require('pg');

let pool;

function getPool() {
  if (!pool) {
    const connectionString =
      process.env.DATABASE_URL ||
      process.env.NETLIFY_DATABASE_URL || // Netlify DB (Neon) sets this automatically
      process.env.NETLIFY_DATABASE_URL_UNPOOLED;

    if (!connectionString) {
      throw new Error(
        'No database connection string found. Set DATABASE_URL (or provision Netlify DB) in your site environment variables.'
      );
    }

    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

module.exports = { getPool };
