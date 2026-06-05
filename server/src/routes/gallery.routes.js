import { Router } from 'express';
import * as galleryController from '../controllers/gallery.controller.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { gallerySchema } from '../validations/gallery.schema.js';
import { idParamSchema } from '../validations/common.schema.js';
import { authenticate, attachUser } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.get('/public', galleryController.listPublic);

router.use(authenticate, attachUser);
router.get('/', galleryController.listAdmin);
router.post('/', upload.single('image'), validateBody(gallerySchema), galleryController.create);
router.put(
  '/:id',
  validateParams(idParamSchema),
  upload.single('image'),
  validateBody(gallerySchema.partial()),
  galleryController.update
);
router.delete('/:id', validateParams(idParamSchema), galleryController.remove);

export default router;
