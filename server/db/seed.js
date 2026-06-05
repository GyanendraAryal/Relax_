import bcrypt from 'bcryptjs';
import pool from '../src/config/db.js';

const DEFAULT_ADMIN = {
  email: 'admin@relaxstation.np',
  password: 'Admin@12345',
  fullName: 'Relax Station Admin',
};

async function seed() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT id FROM users WHERE email = $1', [
      DEFAULT_ADMIN.email,
    ]);
    if (rows.length > 0) {
      console.log('Admin user already exists, skipping seed.');
      return;
    }

    const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 12);
    await client.query(
      `INSERT INTO users (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, 'superadmin')`,
      [DEFAULT_ADMIN.email, passwordHash, DEFAULT_ADMIN.fullName]
    );

    const { rows: catRows } = await client.query(
      `INSERT INTO menu_categories (name, slug, description, sort_order)
       VALUES ('Starters', 'starters', 'Begin your meal', 1),
              ('Main Course', 'main-course', 'Hearty mains', 2),
              ('Desserts', 'desserts', 'Sweet endings', 3)
       RETURNING id, slug`
    );

    const mainCat = catRows.find((c) => c.slug === 'main-course');
    if (mainCat) {
      await client.query(
        `INSERT INTO menu_items (category_id, name, slug, description, price, is_vegetarian, is_featured, sort_order)
         VALUES ($1, 'Chicken Momo', 'chicken-momo', 'Steamed dumplings with spicy sauce', 350.00, false, true, 1),
                ($1, 'Veg Thali', 'veg-thali', 'Traditional Nepali vegetarian platter', 450.00, true, true, 2)`,
        [mainCat.id]
      );
    }

    console.log('Seed completed.');
    console.log(`Admin login: ${DEFAULT_ADMIN.email} / ${DEFAULT_ADMIN.password}`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
