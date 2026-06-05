import { Router } from 'express';
import * as todaySpecialController from '../controllers/todaySpecial.controller.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { todaySpecialSchema } from '../validations/todaySpecial.schema.js';
import { idParamSchema } from '../validations/common.schema.js';
import { authenticate, attachUser } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.get('/public/today', todaySpecialController.getToday);

router.use(authenticate, attachUser);
router.get('/', todaySpecialController.list);
router.post('/', upload.single('image'), validateBody(todaySpecialSchema), todaySpecialController.create);
router.put(
  '/:id',
  validateParams(idParamSchema),
  upload.single('image'),
  validateBody(todaySpecialSchema.partial()),
  todaySpecialController.update
);
router.delete('/:id', validateParams(idParamSchema), todaySpecialController.remove);

export default router;
