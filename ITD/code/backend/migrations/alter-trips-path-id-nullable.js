/**
 * Migración: permite path_id NULL en la tabla trips (para viajes automáticos sin ruta asociada).
 * Ejecutar una vez si ya tienes la base de datos creada: node migrations/alter-trips-path-id-nullable.js
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
    await client.query('ALTER TABLE trips ALTER COLUMN path_id DROP NOT NULL;');
    console.log('Migración aplicada: path_id en trips permite NULL.');
  } catch (err) {
    if (err.code === '42701') {
      console.log('La columna path_id ya permite NULL. Nada que hacer.');
    } else {
      console.error('Error en migración:', err.message);
      process.exit(1);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

run();
