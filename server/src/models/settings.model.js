import pool from '../config/db.js';

export async function findAll() {
  const { rows } = await pool.query('SELECT key, value, updated_at FROM site_settings ORDER BY key');
  return rows;
}

export async function findByKey(key) {
  const { rows } = await pool.query('SELECT key, value, updated_at FROM site_settings WHERE key = $1', [
    key,
  ]);
  return rows[0] || null;
}

export async function upsert(key, value) {
  const { rows } = await pool.query(
    `INSERT INTO site_settings (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
     RETURNING key, value, updated_at`,
    [key, value]
  );
  return rows[0];
}

export async function getPublicSettings() {
  const rows = await findAll();
  return rows.reduce((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}
