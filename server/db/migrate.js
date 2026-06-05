import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const sql = fs.readFileSync(
    path.join(__dirname, 'migrations', '001_init.sql'),
    'utf8'
  );
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log('Migration 001_init applied successfully.');
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
