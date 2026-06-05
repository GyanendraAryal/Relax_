import pool from '../config/db.js';

export async function findByDate(date, { activeOnly = true } = {}) {
  let sql = `
    SELECT ts.*, mi.name AS item_name, mi.description AS item_description,
           mi.price AS regular_price, COALESCE(ts.image_url, mi.image_url) AS item_image,
           mc.name AS category_name
    FROM today_specials ts
    JOIN menu_items mi ON mi.id = ts.menu_item_id
    JOIN menu_categories mc ON mc.id = mi.category_id
    WHERE ts.special_date = $1`;
  if (activeOnly) sql += ' AND ts.is_active = TRUE AND mi.is_available = TRUE';
  sql += ' ORDER BY ts.created_at DESC';
  const { rows } = await pool.query(sql, [date]);
  return rows;
}

export async function findAll({ limit = 50, offset = 0 } = {}) {
  const { rows } = await pool.query(
    `SELECT ts.*, mi.name AS item_name, mi.price AS regular_price
     FROM today_specials ts
     JOIN menu_items mi ON mi.id = ts.menu_item_id
     ORDER BY ts.special_date DESC, ts.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query(
    `SELECT ts.*, mi.name AS item_name FROM today_specials ts
     JOIN menu_items mi ON mi.id = ts.menu_item_id WHERE ts.id = $1`,
    [id]
  );
  return rows[0] || null;
}

export async function create(data) {
  const { rows } = await pool.query(
    `INSERT INTO today_specials (menu_item_id, special_price, note, image_url, cloudinary_public_id, special_date, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      data.menu_item_id,
      data.special_price ?? null,
      data.note ?? null,
      data.image_url ?? null,
      data.cloudinary_public_id ?? null,
      data.special_date,
      data.is_active ?? true,
    ]
  );
  return rows[0];
}

export async function update(id, data) {
  const { rows } = await pool.query(
    `UPDATE today_specials SET
       menu_item_id = COALESCE($2, menu_item_id),
       special_price = COALESCE($3, special_price),
       note = COALESCE($4, note),
       image_url = COALESCE($5, image_url),
       cloudinary_public_id = COALESCE($6, cloudinary_public_id),
       special_date = COALESCE($7, special_date),
       is_active = COALESCE($8, is_active)
     WHERE id = $1 RETURNING *`,
    [id, data.menu_item_id, data.special_price, data.note, data.image_url, data.cloudinary_public_id, data.special_date, data.is_active]
  );
  return rows[0] || null;
}

export async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM today_specials WHERE id = $1', [id]);
  return rowCount > 0;
}
