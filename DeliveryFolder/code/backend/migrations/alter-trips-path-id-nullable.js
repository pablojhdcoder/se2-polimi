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
    await client.query('ALTER TABLE trips ALTER COLUMN path_id DROP NOT NULL;');
    console.log('Migration applied: path_id in trips allows NULL.');
  } catch (err) {
    if (err.code === '42701') {
      console.log('Column path_id already allows NULL. Nothing to do.');
    } else {
      console.error('Migration error:', err.message);
      process.exit(1);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

run();
