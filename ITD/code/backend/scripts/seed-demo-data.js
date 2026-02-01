/**
 * Seed script: inserta usuarios demo, rutas, valoraciones (con comentarios),
 * viajes y favoritos para probar la app manualmente.
 * Uso: node scripts/seed-demo-data.js [--force]
 * --force: borra antes los datos demo existentes (usuarios demo@*, rutas suyas, etc.).
 * Requiere: DB_* en backend/.env (o variables de entorno).
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userRepository = require('../src/repositories/userRepository');
const pathRepository = require('../src/repositories/pathRepository');
const ratingRepository = require('../src/repositories/ratingRepository');
const savedPathRepository = require('../src/repositories/savedPathRepository');
const { query } = require('../src/pool');

const DEMO_PASSWORD = 'Demo123!';
const DEMO_USERS = [
  { email: 'demo@example.com', fullName: 'Usuario Demo', username: 'demo@example.com' },
  { email: 'demo2@example.com', fullName: 'Demo Dos', username: 'demo2@example.com' },
  { email: 'demo3@example.com', fullName: 'Demo Tres', username: 'demo3@example.com' },
];

async function hashPassword(pwd) {
  return bcrypt.hash(pwd, 10);
}

async function ensureDemoUsers() {
  const inserted = [];
  for (const u of DEMO_USERS) {
    const existing = await userRepository.getUserByEmail(u.email);
    if (existing) {
      console.log('  Usuario ya existe:', u.email);
      inserted.push(existing);
      continue;
    }
    const id = crypto.randomUUID();
    const passwordHash = await hashPassword(DEMO_PASSWORD);
    await userRepository.createUser({
      id,
      username: u.username,
      passwordHash,
      fullName: u.fullName,
      email: u.email,
      phoneNumber: null,
      profilePicture: null,
    });
    inserted.push({ id, username: u.username, email: u.email, full_name: u.fullName });
    console.log('  Creado usuario:', u.email);
  }
  return inserted;
}

async function ensurePaths(users) {
  const postedBy = users[0].username;
  const pathNames = [
    'Centro - Parque Norte',
    'Estación - Universidad',
    'Río Verde - Plaza Sur',
    'Campus - Centro Comercial',
    'Lago Norte - Biblioteca',
  ];
  const coords = [
    { startX: 9.19, startY: 45.464, endX: 9.195, endY: 45.466 },
    { startX: 9.185, startY: 45.462, endX: 9.192, endY: 45.465 },
    { startX: 9.198, startY: 45.461, endX: 9.201, endY: 45.463 },
    { startX: 9.188, startY: 45.467, endX: 9.19, endY: 45.469 },
    { startX: 9.202, startY: 45.468, endX: 9.205, endY: 45.47 },
  ];
  const statuses = ['optimal', 'optimal', 'under_maintenance', 'optimal', 'requires_maintenance'];
  const paths = [];
  for (let i = 0; i < pathNames.length; i++) {
    const pathName = pathNames[i];
    const existing = await pathRepository.getPathByName(pathName);
    if (existing) {
      paths.push(existing);
      console.log('  Ruta ya existe:', pathName);
      continue;
    }
    const c = coords[i];
    const routeData = {
      type: 'LineString',
      coordinates: [[c.startX, c.startY], [c.endX, c.endY]],
    };
    const pathRow = await pathRepository.createPath({
      id: crypto.randomUUID(),
      pathName,
      startX: c.startX,
      startY: c.startY,
      endX: c.endX,
      endY: c.endY,
      length: 120 + i * 80,
      userRating: 0,
      status: statuses[i],
      postedByUsername: postedBy,
      routeData,
    });
    paths.push(pathRow);
    console.log('  Creada ruta:', pathName);
  }
  return paths;
}

async function ensureRatings(users, paths) {
  const comments = [
    'Muy buen trazado, suelo en buen estado.',
    'Un tramo tiene baches. Cuidado de noche.',
    'Ideal para ir al trabajo.',
    'Poco iluminado al final.',
    'Bien señalizado y seguro.',
    'Algo de tráfico en hora punta.',
    'Recomendable. Lo uso cada día.',
    'Necesita mantenimiento en la curva.',
  ];
  let count = 0;
  for (let i = 0; i < Math.min(8, users.length * paths.length); i++) {
    const user = users[i % users.length];
    const pathRow = paths[i % paths.length];
    const userId = user.id || user.user_id;
    const pathId = pathRow.id;
    const existing = await ratingRepository.getRatingByUserAndPath(userId, pathId);
    if (existing) continue;
    await ratingRepository.createRating({
      id: crypto.randomUUID(),
      userId,
      pathId,
      points: 2 + (i % 4),
      opinion: comments[i % comments.length],
      reportedStatus: i % 3 === 0 ? 'requires_maintenance' : 'optimal',
    });
    count++;
  }
  console.log('  Creadas', count, 'valoraciones');
  return count;
}

async function ensureSavedPaths(users, paths) {
  const pathNames = paths.slice(0, 4).map((p) => p.path_name);
  let count = 0;
  for (const user of users.slice(0, 2)) {
    const username = user.username;
    for (let i = 0; i < 2; i++) {
      const pathName = pathNames[(count % pathNames.length)];
      try {
        await savedPathRepository.savePath(username, pathName);
        count++;
      } catch (e) {
        if (e.code !== '23505') throw e; // unique violation = already saved
      }
    }
  }
  console.log('  Creados', count, 'favoritos (saved_paths)');
  return count;
}

async function deleteDemoData() {
  const demoEmails = DEMO_USERS.map((u) => u.email);
  const users = [];
  for (const email of demoEmails) {
    const u = await userRepository.getUserByEmail(email);
    if (u) users.push(u);
  }
  if (users.length === 0) {
    console.log('  No hay usuarios demo que borrar.');
    return;
  }
  const usernames = users.map((u) => u.username);
  const userIds = users.map((u) => u.id);

  await query('DELETE FROM saved_paths WHERE username = ANY($1)', [usernames]);
  await query('DELETE FROM ratings WHERE user_id = ANY($1)', [userIds]);
  await query('DELETE FROM trips WHERE user_id = ANY($1)', [userIds]);
  await query('DELETE FROM paths WHERE posted_by_username = ANY($1)', [usernames]);
  await query('DELETE FROM users WHERE id = ANY($1)', [userIds]);
  console.log('  Borrados datos demo (usuarios, rutas, valoraciones, viajes, favoritos).');
}

async function run() {
  const force = process.argv.includes('--force');
  console.log('Seed de datos demo. Force=', force);

  if (force) {
    console.log('Borrando datos demo existentes...');
    await deleteDemoData();
  }

  console.log('Creando usuarios demo...');
  const users = await ensureDemoUsers();
  if (users.length === 0) {
    console.log('No se crearon usuarios. ¿Ya existen? Usa --force para reemplazar.');
    process.exit(0);
    return;
  }

  console.log('Creando rutas...');
  const paths = await ensurePaths(users);

  console.log('Creando valoraciones (con comentarios)...');
  const numRatings = await ensureRatings(users, paths);

  console.log('Creando favoritos (saved_paths)...');
  const numSaved = await ensureSavedPaths(users, paths);

  console.log('\n--- Resumen ---');
  console.log('Usuarios demo:', users.length);
  console.log('Rutas:', paths.length);
  console.log('Valoraciones:', numRatings);
  console.log('Favoritos:', numSaved);
  console.log('Viajes: no se crean de ejemplo (solo los grabados por los usuarios).');
  console.log('\nCredenciales de prueba:');
  DEMO_USERS.forEach((u) => console.log('  ', u.email, '/', DEMO_PASSWORD));
  console.log('\nListo. Puedes iniciar sesión en la app con cualquiera de los usuarios anteriores.');
  process.exit(0);
}

run().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
