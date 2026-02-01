/**
 * Ejecuta el esquema base (schema.sql) y todas las migraciones en orden.
 * Uso: node migrations/run-all.js
 * Requiere: backend/.env con DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'bbp_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

const MIGRATIONS_ORDER = [
  { name: 'schema', type: 'sql', file: path.join(__dirname, '../src/config/schema.sql') },
  { name: 'add-paths-duration-minutes', type: 'js', file: path.join(__dirname, 'add-paths-duration-minutes.js') },
  { name: 'add-paths-is-published', type: 'js', file: path.join(__dirname, 'add-paths-is-published.js') },
  { name: 'add-paths-route-date', type: 'js', file: path.join(__dirname, 'add-paths-route-date.js') },
  { name: 'add-paths-weather', type: 'js', file: path.join(__dirname, 'add-paths-weather.js') },
  { name: 'alter-trips-path-id-nullable', type: 'js', file: path.join(__dirname, 'alter-trips-path-id-nullable.js') },
];

function runJsMigration(filePath) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [filePath], {
      stdio: 'inherit',
      env: process.env,
      cwd: path.join(__dirname, '..'),
    });
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`Exit ${code}`))));
  });
}

async function run() {
  let client;
  try {
    console.log('Ejecutando esquema base y migraciones...\n');

    for (const m of MIGRATIONS_ORDER) {
      if (m.type === 'sql') {
        client = await pool.connect();
        const sql = fs.readFileSync(m.file, 'utf8');
        await client.query(sql);
        client.release();
        client = null;
        console.log('  ✓ Schema base (schema.sql) aplicado.');
      } else {
        await runJsMigration(m.file);
      }
    }

    console.log('\nTodas las migraciones aplicadas correctamente.');
  } catch (err) {
    console.error('\nError:', err.message);
    process.exit(1);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

run();
