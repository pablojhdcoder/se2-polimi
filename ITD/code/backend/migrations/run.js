const path = require('path');
const fs = require('fs');

// Cargar .env desde la raíz del backend (donde está package.json)
const backendRoot = path.resolve(__dirname, '..');
require('dotenv').config({ path: path.join(backendRoot, '.env') });

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'bbp_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function run() {
  const schemaPath = path.join(backendRoot, 'src', 'config', 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error('No se encuentra schema.sql en:', schemaPath);
    process.exit(1);
  }
  const sql = fs.readFileSync(schemaPath, 'utf8');

  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log('Schema aplicado correctamente.');
  } catch (err) {
    console.error('Error aplicando schema:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
