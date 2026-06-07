import pool from '../config/db.js';

export async function findAll({ activeOnly = false } = {}) {
  let sql = 'SELECT * FROM offers';
  const params = [];
  if (activeOnly) {
    sql += ` WHERE is_active = TRUE
      AND (valid_from IS NULL OR valid_from <= CURRENT_DATE)
      AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)`;
  }
  sql += ' ORDER BY created_at DESC';
  const { rows } = await pool.query(sql, params);
  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM offers WHERE id = $1', [id]);
  return rows[0] || null;
}

export async function findBySlug(slug) {
  const { rows } = await pool.query('SELECT * FROM offers WHERE slug = $1', [slug]);
  return rows[0] || null;
}

export async function create(data) {
  const { rows } = await pool.query(
    `INSERT INTO offers (
       title, slug, description, discount_percent, discount_amount,
       image_url, cloudinary_public_id, valid_from, valid_until, is_active, terms
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [
      data.title,
      data.slug,
      data.description ?? null,
      data.discount_percent ?? null,
      data.discount_amount ?? null,
      data.image_url ?? null,
      data.cloudinary_public_id ?? null,
      data.valid_from ?? null,
      data.valid_until ?? null,
      data.is_active ?? true,
      data.terms ?? null,
    ]
  );
  return rows[0];
}

export async function update(id, data) {
  // Build SET clause dynamically — only update columns that are explicitly
  // present in `data`. This allows callers to clear a value by passing null,
  // unlike COALESCE which would silently keep the old value when null is passed.
  const fields = [
    'title', 'slug', 'description', 'discount_percent', 'discount_amount',
    'image_url', 'cloudinary_public_id', 'valid_from', 'valid_until',
    'is_active', 'terms',
  ];

  const setClauses = [];
  const params = [id]; // $1 is always the id

  fields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      params.push(data[field] ?? null);
      setClauses.push(`${field} = $${params.length}`);
    }
  });

  if (setClauses.length === 0) {
    // Nothing to update — just return the existing row
    return findById(id);
  }

  const sql = `UPDATE offers SET ${setClauses.join(', ')} WHERE id = $1 RETURNING *`;
  const { rows } = await pool.query(sql, params);
  return rows[0] || null;
}

export async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM offers WHERE id = $1', [id]);
  return rowCount > 0;
}
