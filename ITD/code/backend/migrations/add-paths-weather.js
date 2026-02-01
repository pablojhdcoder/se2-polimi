/**
 * Migration: add weather columns to paths table (snapshot at origin when path is created).
 * Run once if DB already exists: node migrations/add-paths-weather.js
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
    const columns = [
      ['temperature', 'INTEGER'],
      ['wind_speed', 'INTEGER'],
      ['wind_degree', 'INTEGER'],
      ['wind_gust', 'DOUBLE PRECISION'],
      ['visibility', 'INTEGER'],
      ['rain', 'DOUBLE PRECISION'],
      ['clouds', 'INTEGER'],
    ];
    for (const [name, type] of columns) {
      await client.query(
        `ALTER TABLE paths ADD COLUMN IF NOT EXISTS ${name} ${type};`
      );
    }
    console.log('Migration applied: paths weather columns added.');
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
