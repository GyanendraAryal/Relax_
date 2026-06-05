import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller.js';
import { validateBody, validateParams, validateQuery } from '../middlewares/validate.js';
import {
  birthdayRequestSchema,
  eventRequestSchema,
  bookingStatusSchema,
} from '../validations/booking.schema.js';
import { idParamSchema, paginationSchema } from '../validations/common.schema.js';
import { authenticate, attachUser } from '../middlewares/auth.js';
import { bookingLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post(
  '/birthday/public',
  bookingLimiter,
  validateBody(birthdayRequestSchema),
  bookingController.createBirthday
);

router.post(
  '/event/public',
  bookingLimiter,
  validateBody(eventRequestSchema),
  bookingController.createEvent
);

router.use(authenticate, attachUser);

router.get('/birthday', validateQuery(paginationSchema), bookingController.listBirthdays);
router.patch(
  '/birthday/:id',
  validateParams(idParamSchema),
  validateBody(bookingStatusSchema),
  bookingController.updateBirthday
);

router.get('/event', validateQuery(paginationSchema), bookingController.listEvents);
router.patch(
  '/event/:id',
  validateParams(idParamSchema),
  validateBody(bookingStatusSchema),
  bookingController.updateEvent
);

export default router;
