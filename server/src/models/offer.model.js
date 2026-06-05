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
  const { rows } = await pool.query(
    `UPDATE offers SET
       title = COALESCE($2, title),
       slug = COALESCE($3, slug),
       description = COALESCE($4, description),
       discount_percent = COALESCE($5, discount_percent),
       discount_amount = COALESCE($6, discount_amount),
       image_url = COALESCE($7, image_url),
       cloudinary_public_id = COALESCE($8, cloudinary_public_id),
       valid_from = COALESCE($9, valid_from),
       valid_until = COALESCE($10, valid_until),
       is_active = COALESCE($11, is_active),
       terms = COALESCE($12, terms)
     WHERE id = $1 RETURNING *`,
    [
      id,
      data.title,
      data.slug,
      data.description,
      data.discount_percent,
      data.discount_amount,
      data.image_url,
      data.cloudinary_public_id,
      data.valid_from,
      data.valid_until,
      data.is_active,
      data.terms,
    ]
  );
  return rows[0] || null;
}

export async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM offers WHERE id = $1', [id]);
  return rowCount > 0;
}
