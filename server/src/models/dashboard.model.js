import pool from '../config/db.js';

export async function getStats() {
  const { rows } = await pool.query(`
    SELECT
      (SELECT COUNT(*)::int FROM menu_items WHERE is_available = TRUE) AS menu_items,
      (SELECT COUNT(*)::int FROM offers WHERE is_active = TRUE) AS active_offers,
      (SELECT COUNT(*)::int FROM gallery_images WHERE is_active = TRUE) AS gallery_images,
      (SELECT COUNT(*)::int FROM birthday_requests WHERE status = 'pending') AS pending_birthdays,
      (SELECT COUNT(*)::int FROM event_requests WHERE status = 'pending') AS pending_events,
      (SELECT COUNT(*)::int FROM today_specials WHERE special_date = CURRENT_DATE AND is_active = TRUE) AS today_specials
  `);
  return rows[0];
}

export async function getRecentBookings(limit = 5) {
  const { rows } = await pool.query(
    `(SELECT id, 'birthday' AS type, customer_name, event_date, status, created_at
      FROM birthday_requests ORDER BY created_at DESC LIMIT $1)
     UNION ALL
     (SELECT id, 'event' AS type, customer_name, event_date, status, created_at
      FROM event_requests ORDER BY created_at DESC LIMIT $1)
     ORDER BY created_at DESC LIMIT $2`,
    [limit, limit * 2]
  );
  return rows.slice(0, limit);
}
