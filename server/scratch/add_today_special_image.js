import pool from '../src/config/db.js';

async function main() {
  console.log('Altering today_specials table to add image columns...');
  const client = await pool.connect();
  try {
    await client.query(`
      ALTER TABLE today_specials 
      ADD COLUMN IF NOT EXISTS image_url TEXT,
      ADD COLUMN IF NOT EXISTS cloudinary_public_id VARCHAR(255)
    `);
    console.log('Columns image_url and cloudinary_public_id added successfully.');
  } catch (err) {
    console.error('Failed to alter table:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
