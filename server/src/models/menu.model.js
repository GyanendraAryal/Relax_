import pool from '../config/db.js';

// Categories
export async function findAllCategories({ activeOnly = false } = {}) {
  let sql = 'SELECT * FROM menu_categories';
  const params = [];
  if (activeOnly) {
    sql += ' WHERE is_active = TRUE';
  }
  sql += ' ORDER BY sort_order ASC, name ASC';
  const { rows } = await pool.query(sql, params);
  return rows;
}

export async function findCategoryById(id) {
  const { rows } = await pool.query('SELECT * FROM menu_categories WHERE id = $1', [id]);
  return rows[0] || null;
}

export async function findCategoryBySlug(slug) {
  const { rows } = await pool.query('SELECT * FROM menu_categories WHERE slug = $1', [slug]);
  return rows[0] || null;
}

export async function createCategory(data) {
  const { rows } = await pool.query(
    `INSERT INTO menu_categories (name, slug, description, sort_order, is_active)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [data.name, data.slug, data.description ?? null, data.sort_order ?? 0, data.is_active ?? true]
  );
  return rows[0];
}

export async function updateCategory(id, data) {
  const { rows } = await pool.query(
    `UPDATE menu_categories SET
       name = COALESCE($2, name),
       slug = COALESCE($3, slug),
       description = COALESCE($4, description),
       sort_order = COALESCE($5, sort_order),
       is_active = COALESCE($6, is_active)
     WHERE id = $1 RETURNING *`,
    [id, data.name, data.slug, data.description, data.sort_order, data.is_active]
  );
  return rows[0] || null;
}

export async function deleteCategory(id) {
  const { rowCount } = await pool.query('DELETE FROM menu_categories WHERE id = $1', [id]);
  return rowCount > 0;
}

// Items
export async function findAllItems({ categoryId, availableOnly = false, featuredOnly = false } = {}) {
  let sql = `
    SELECT mi.*, mc.name AS category_name, mc.slug AS category_slug
    FROM menu_items mi
    JOIN menu_categories mc ON mc.id = mi.category_id
    WHERE 1=1`;
  const params = [];
  let i = 1;

  if (categoryId) {
    sql += ` AND mi.category_id = $${i++}`;
    params.push(categoryId);
  }
  if (availableOnly) {
    sql += ' AND mi.is_available = TRUE AND mc.is_active = TRUE';
  }
  if (featuredOnly) {
    sql += ' AND mi.is_featured = TRUE';
  }
  sql += ' ORDER BY mc.sort_order, mi.sort_order, mi.name';
  const { rows } = await pool.query(sql, params);
  return rows;
}

export async function findItemById(id) {
  const { rows } = await pool.query(
    `SELECT mi.*, mc.name AS category_name FROM menu_items mi
     JOIN menu_categories mc ON mc.id = mi.category_id WHERE mi.id = $1`,
    [id]
  );
  return rows[0] || null;
}

export async function findItemBySlug(slug) {
  const { rows } = await pool.query(
    `SELECT mi.*, mc.name AS category_name FROM menu_items mi
     JOIN menu_categories mc ON mc.id = mi.category_id WHERE mi.slug = $1`,
    [slug]
  );
  return rows[0] || null;
}

export async function createItem(data) {
  const { rows } = await pool.query(
    `INSERT INTO menu_items (
       category_id, name, slug, description, price, image_url, cloudinary_public_id,
       is_vegetarian, is_spicy, is_available, is_featured, sort_order
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [
      data.category_id,
      data.name,
      data.slug,
      data.description ?? null,
      data.price,
      data.image_url ?? null,
      data.cloudinary_public_id ?? null,
      data.is_vegetarian ?? false,
      data.is_spicy ?? false,
      data.is_available ?? true,
      data.is_featured ?? false,
      data.sort_order ?? 0,
    ]
  );
  return rows[0];
}

export async function updateItem(id, data) {
  const { rows } = await pool.query(
    `UPDATE menu_items SET
       category_id = COALESCE($2, category_id),
       name = COALESCE($3, name),
       slug = COALESCE($4, slug),
       description = COALESCE($5, description),
       price = COALESCE($6, price),
       image_url = COALESCE($7, image_url),
       cloudinary_public_id = COALESCE($8, cloudinary_public_id),
       is_vegetarian = COALESCE($9, is_vegetarian),
       is_spicy = COALESCE($10, is_spicy),
       is_available = COALESCE($11, is_available),
       is_featured = COALESCE($12, is_featured),
       sort_order = COALESCE($13, sort_order)
     WHERE id = $1 RETURNING *`,
    [
      id,
      data.category_id,
      data.name,
      data.slug,
      data.description,
      data.price,
      data.image_url,
      data.cloudinary_public_id,
      data.is_vegetarian,
      data.is_spicy,
      data.is_available,
      data.is_featured,
      data.sort_order,
    ]
  );
  return rows[0] || null;
}

export async function deleteItem(id) {
  const { rowCount } = await pool.query('DELETE FROM menu_items WHERE id = $1', [id]);
  return rowCount > 0;
}

export async function getMenuGrouped(activeOnly = true) {
  const categories = await findAllCategories({ activeOnly });
  const items = await findAllItems({ availableOnly: activeOnly });
  return categories.map((cat) => ({
    ...cat,
    items: items.filter((item) => item.category_id === cat.id),
  }));
}
