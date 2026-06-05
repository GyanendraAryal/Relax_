import pool from '../config/db.js';

// Birthday
export async function findBirthdayRequests({ status, limit = 20, offset = 0 } = {}) {
  let sql = 'SELECT * FROM birthday_requests WHERE 1=1';
  const params = [];
  let i = 1;
  if (status) {
    sql += ` AND status = $${i++}`;
    params.push(status);
  }
  sql += ` ORDER BY created_at DESC LIMIT $${i++} OFFSET $${i}`;
  params.push(limit, offset);
  const { rows } = await pool.query(sql, params);
  return rows;
}

export async function countBirthdayRequests(status) {
  let sql = 'SELECT COUNT(*)::int AS total FROM birthday_requests';
  const params = [];
  if (status) {
    sql += ' WHERE status = $1';
    params.push(status);
  }
  const { rows } = await pool.query(sql, params);
  return rows[0].total;
}

export async function findBirthdayById(id) {
  const { rows } = await pool.query('SELECT * FROM birthday_requests WHERE id = $1', [id]);
  return rows[0] || null;
}

export async function createBirthday(data) {
  const { rows } = await pool.query(
    `INSERT INTO birthday_requests (customer_name, email, phone, event_date, guest_count, package_type, message)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [
      data.customer_name,
      data.email,
      data.phone,
      data.event_date,
      data.guest_count,
      data.package_type ?? null,
      data.message ?? null,
    ]
  );
  return rows[0];
}

export async function updateBirthday(id, data) {
  const { rows } = await pool.query(
    `UPDATE birthday_requests SET
       status = COALESCE($2, status),
       admin_notes = COALESCE($3, admin_notes)
     WHERE id = $1 RETURNING *`,
    [id, data.status, data.admin_notes]
  );
  return rows[0] || null;
}

// Events
export async function findEventRequests({ status, limit = 20, offset = 0 } = {}) {
  let sql = 'SELECT * FROM event_requests WHERE 1=1';
  const params = [];
  let i = 1;
  if (status) {
    sql += ` AND status = $${i++}`;
    params.push(status);
  }
  sql += ` ORDER BY created_at DESC LIMIT $${i++} OFFSET $${i}`;
  params.push(limit, offset);
  const { rows } = await pool.query(sql, params);
  return rows;
}

export async function countEventRequests(status) {
  let sql = 'SELECT COUNT(*)::int AS total FROM event_requests';
  const params = [];
  if (status) {
    sql += ' WHERE status = $1';
    params.push(status);
  }
  const { rows } = await pool.query(sql, params);
  return rows[0].total;
}

export async function findEventById(id) {
  const { rows } = await pool.query('SELECT * FROM event_requests WHERE id = $1', [id]);
  return rows[0] || null;
}

export async function createEvent(data) {
  const { rows } = await pool.query(
    `INSERT INTO event_requests (
       customer_name, email, phone, event_type, event_date,
       start_time, end_time, guest_count, budget_range, message
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [
      data.customer_name,
      data.email,
      data.phone,
      data.event_type,
      data.event_date,
      data.start_time ?? null,
      data.end_time ?? null,
      data.guest_count,
      data.budget_range ?? null,
      data.message ?? null,
    ]
  );
  return rows[0];
}

export async function updateEvent(id, data) {
  const { rows } = await pool.query(
    `UPDATE event_requests SET
       status = COALESCE($2, status),
       admin_notes = COALESCE($3, admin_notes)
     WHERE id = $1 RETURNING *`,
    [id, data.status, data.admin_notes]
  );
  return rows[0] || null;
}
