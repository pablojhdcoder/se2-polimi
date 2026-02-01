/**
 * Migration: drop route_date from paths table (column was never used by the app).
 * Run once if DB already has route_date: node migrations/drop-paths-route-date.js
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'bbp_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function run() {
  const client = await pool.connect();
  try {
    await client.query(`
      ALTER TABLE paths
      DROP COLUMN IF EXISTS route_date;
    `);
    console.log('Migration applied: paths.route_date dropped.');
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
