import { Router } from 'express';
import * as offerController from '../controllers/offer.controller.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { offerSchema } from '../validations/offer.schema.js';
import { idParamSchema } from '../validations/common.schema.js';
import { authenticate, attachUser } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.get('/public', offerController.listPublic);

router.use(authenticate, attachUser);
router.get('/', offerController.listAdmin);
router.get('/:id', validateParams(idParamSchema), offerController.getOne);
router.post('/', upload.single('image'), validateBody(offerSchema), offerController.create);
router.put(
  '/:id',
  validateParams(idParamSchema),
  upload.single('image'),
  validateBody(offerSchema.partial()),
  offerController.update
);
router.delete('/:id', validateParams(idParamSchema), offerController.remove);

export default router;
