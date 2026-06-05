import pool from '../config/db.js';

const PUBLIC_FIELDS = 'id, email, full_name, role, is_active, last_login_at, created_at';

export async function findByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id, email, password_hash, full_name, role, is_active, last_login_at, created_at
     FROM users WHERE email = $1`,
    [email.toLowerCase()]
  );
  return rows[0] || null;
}

export async function findById(id) {
  const { rows } = await pool.query(
    `SELECT ${PUBLIC_FIELDS} FROM users WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

export async function updateLastLogin(id) {
  await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [id]);
}
