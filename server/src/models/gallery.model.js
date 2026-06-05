import pool from '../config/db.js';

export async function findAll({ activeOnly = false } = {}) {
  let sql = 'SELECT * FROM gallery_images';
  if (activeOnly) sql += ' WHERE is_active = TRUE';
  sql += ' ORDER BY sort_order ASC, created_at DESC';
  const { rows } = await pool.query(sql);
  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM gallery_images WHERE id = $1', [id]);
  return rows[0] || null;
}

export async function create(data) {
  const { rows } = await pool.query(
    `INSERT INTO gallery_images (title, caption, image_url, cloudinary_public_id, category, sort_order, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [
      data.title ?? null,
      data.caption ?? null,
      data.image_url,
      data.cloudinary_public_id ?? null,
      data.category ?? 'general',
      data.sort_order ?? 0,
      data.is_active ?? true,
    ]
  );
  return rows[0];
}

export async function update(id, data) {
  const { rows } = await pool.query(
    `UPDATE gallery_images SET
       title = COALESCE($2, title),
       caption = COALESCE($3, caption),
       image_url = COALESCE($4, image_url),
       cloudinary_public_id = COALESCE($5, cloudinary_public_id),
       category = COALESCE($6, category),
       sort_order = COALESCE($7, sort_order),
       is_active = COALESCE($8, is_active)
     WHERE id = $1 RETURNING *`,
    [
      id,
      data.title,
      data.caption,
      data.image_url,
      data.cloudinary_public_id,
      data.category,
      data.sort_order,
      data.is_active,
    ]
  );
  return rows[0] || null;
}

export async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM gallery_images WHERE id = $1', [id]);
  return rowCount > 0;
}
