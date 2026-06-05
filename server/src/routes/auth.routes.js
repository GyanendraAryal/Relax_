import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validate.js';
import { loginSchema } from '../validations/auth.schema.js';
import { authenticate, attachUser } from '../middlewares/auth.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post('/login', authLimiter, validateBody(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticate, attachUser, authController.me);

export default router;
