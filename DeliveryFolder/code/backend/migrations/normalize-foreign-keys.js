require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function run() {
  const client = await pool.connect();
  try {
    console.log('Starting FK normalization migration...');
    
    // STEP 1: Add new columns to paths
    console.log('Adding posted_by_user_id to paths...');
    await client.query(`
      ALTER TABLE paths ADD COLUMN IF NOT EXISTS posted_by_user_id UUID;
    `);
    
    // STEP 2: Populate posted_by_user_id from posted_by_username
    console.log('Populating posted_by_user_id...');
    await client.query(`
      UPDATE paths
      SET posted_by_user_id = users.id
      FROM users
      WHERE paths.posted_by_username = users.username
      AND paths.posted_by_user_id IS NULL;
    `);
    
    // STEP 3: Make posted_by_user_id NOT NULL and add FK constraint
    console.log('Adding FK constraint for posted_by_user_id...');
    await client.query(`
      ALTER TABLE paths ALTER COLUMN posted_by_user_id SET NOT NULL;
    `);
    
    await client.query(`
      DO $$ BEGIN
        ALTER TABLE paths ADD CONSTRAINT fk_path_user_new
          FOREIGN KEY (posted_by_user_id) REFERENCES users(id) ON DELETE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;
    `);
    
    // STEP 4: Drop old FK and column
    console.log('Dropping old posted_by_username column...');
    await client.query(`
      ALTER TABLE paths DROP CONSTRAINT IF EXISTS fk_path_user;
    `);
    await client.query(`
      ALTER TABLE paths DROP COLUMN IF EXISTS posted_by_username;
    `);
    
    // STEP 5: Rename new constraint to original name
    console.log('Renaming FK constraint...');
    await client.query(`
      DO $$ BEGIN
        ALTER TABLE paths RENAME CONSTRAINT fk_path_user_new TO fk_path_user;
      EXCEPTION
        WHEN undefined_object THEN NULL;
      END $$;
    `);
    
    // STEP 6: Create new saved_paths table with UUIDs
    console.log('Creating new saved_paths_new table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS saved_paths_new (
        user_id UUID NOT NULL,
        path_id UUID NOT NULL,
        saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, path_id),
        CONSTRAINT fk_saved_user_new
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_saved_path_new
          FOREIGN KEY (path_id) REFERENCES paths(id) ON DELETE CASCADE
      );
    `);
    
    // STEP 7: Migrate data from old saved_paths to new one
    console.log('Migrating saved_paths data...');
    await client.query(`
      INSERT INTO saved_paths_new (user_id, path_id, saved_at)
      SELECT u.id, p.id, sp.saved_at
      FROM saved_paths sp
      JOIN users u ON sp.username = u.username
      JOIN paths p ON sp.path_name = p.path_name
      ON CONFLICT (user_id, path_id) DO NOTHING;
    `);
    
    // STEP 8: Drop old saved_paths and rename new one
    console.log('Replacing old saved_paths table...');
    await client.query(`DROP TABLE IF EXISTS saved_paths CASCADE;`);
    await client.query(`ALTER TABLE saved_paths_new RENAME TO saved_paths;`);
    await client.query(`ALTER TABLE saved_paths RENAME CONSTRAINT fk_saved_user_new TO fk_saved_user;`);
    await client.query(`ALTER TABLE saved_paths RENAME CONSTRAINT fk_saved_path_new TO fk_saved_path;`);
    
    console.log('✅ Migration completed: Foreign keys normalized to UUIDs.');
  } catch (err) {
    console.error('❌ Migration error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
