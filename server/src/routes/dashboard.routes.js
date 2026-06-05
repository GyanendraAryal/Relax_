import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';
import { authenticate, attachUser } from '../middlewares/auth.js';

const router = Router();

router.use(authenticate, attachUser);
router.get('/', dashboardController.getStats);

export default router;
