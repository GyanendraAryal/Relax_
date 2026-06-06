/**
 * Migration: fix-about-numeric-defaults.js
 * ──────────────────────────────────────────
 * Patches any corrupt `about` row in the site_settings table so that
 * foundingYear, birthdaysCount, and eventsCount are always stored as
 * valid integers instead of null / empty-string / undefined.
 *
 * Run once:
 *   node scripts/fix-about-numeric-defaults.js
 */

import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const DEFAULTS = {
  foundingYear:   2020,
  birthdaysCount: 1250,
  eventsCount:    450,
};

function coerceNumericFields(about = {}) {
  const patched = { ...about };
  let changed = false;

  for (const [field, defaultVal] of Object.entries(DEFAULTS)) {
    const parsed = parseInt(patched[field], 10);
    const coerced = Number.isFinite(parsed) ? parsed : defaultVal;

    if (patched[field] !== coerced) {
      console.log(
        `  • ${field}: ${JSON.stringify(patched[field])} → ${coerced}  (was ${Number.isFinite(parsed) ? 'non-integer string' : 'null/empty/missing'})`
      );
      patched[field] = coerced;
      changed = true;
    }
  }

  return { patched, changed };
}

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // 1. Fetch current 'about' row
    const { rows } = await pool.query(
      `SELECT key, value FROM site_settings WHERE key = 'about'`
    );

    if (rows.length === 0) {
      // Row doesn't exist yet — insert a clean seed row with correct types
      console.log("ℹ️  No 'about' row found. Inserting default seed row…");
      await pool.query(
        `INSERT INTO site_settings (key, value)
         VALUES ('about', $1)
         ON CONFLICT (key) DO NOTHING`,
        [JSON.stringify(DEFAULTS)]
      );
      console.log('✅ Default about row inserted:', DEFAULTS);
      return;
    }

    const currentAbout = rows[0].value ?? {};
    console.log('🔍 Current about value from DB:', JSON.stringify(currentAbout, null, 2));

    const { patched, changed } = coerceNumericFields(currentAbout);

    if (!changed) {
      console.log('✅ No changes needed — all numeric fields are already valid integers.');
      return;
    }

    // 2. Write the patched value back
    await pool.query(
      `UPDATE site_settings
       SET value = $1, updated_at = NOW()
       WHERE key = 'about'`,
      [JSON.stringify(patched)]
    );

    console.log('\n✅ Migration complete. Patched about value:', JSON.stringify(patched, null, 2));
  } finally {
    await pool.end();
  }
}

run().catch((err) => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
