import { Router } from 'express';
import authRoutes from './auth.routes.js';
import menuRoutes from './menu.routes.js';
import galleryRoutes from './gallery.routes.js';
import offerRoutes from './offer.routes.js';
import todaySpecialRoutes from './todaySpecial.routes.js';
import bookingRoutes from './booking.routes.js';
import settingsRoutes from './settings.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import pool from '../config/db.js';

const router = Router();

router.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ success: true, data: { status: 'ok', database: 'connected' } });
  } catch {
    res.status(503).json({
      success: false,
      error: { code: 'SERVICE_UNAVAILABLE', message: 'Database unavailable' },
    });
  }
});

router.use('/auth', authRoutes);
router.use('/menu', menuRoutes);
router.use('/gallery', galleryRoutes);
router.use('/offers', offerRoutes);
router.use('/today-specials', todaySpecialRoutes);
router.use('/bookings', bookingRoutes);
router.use('/settings', settingsRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
