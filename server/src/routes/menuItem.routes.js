import { Router } from 'express';
import * as menuController from '../controllers/menu.controller.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { menuItemSchema } from '../validations/menu.schema.js';
import { idParamSchema } from '../validations/common.schema.js';
import { authenticate, attachUser } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

// Protect all menu items management routes
router.use(authenticate, attachUser);

router.get('/', menuController.listItemsPaginated);
router.get('/:id', validateParams(idParamSchema), menuController.getItem);
router.post('/', upload.single('image'), validateBody(menuItemSchema), menuController.createItem);
router.put(
  '/:id',
  validateParams(idParamSchema),
  upload.single('image'),
  validateBody(menuItemSchema.partial()),
  menuController.updateItem
);
router.delete('/:id', validateParams(idParamSchema), menuController.deleteItem);

export default router;
