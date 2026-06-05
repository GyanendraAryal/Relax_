import { Router } from 'express';
import * as menuController from '../controllers/menu.controller.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { categorySchema, menuItemSchema } from '../validations/menu.schema.js';
import { idParamSchema } from '../validations/common.schema.js';
import { authenticate, attachUser } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.get('/public', menuController.getPublicMenu);

router.use(authenticate, attachUser);

router.get('/categories', menuController.listCategories);
router.post('/categories', validateBody(categorySchema), menuController.createCategory);
router.put(
  '/categories/:id',
  validateParams(idParamSchema),
  validateBody(categorySchema.partial()),
  menuController.updateCategory
);
router.delete('/categories/:id', validateParams(idParamSchema), menuController.deleteCategory);

router.get('/items', menuController.listItems);
router.get('/items/:id', validateParams(idParamSchema), menuController.getItem);
router.post('/items', upload.single('image'), validateBody(menuItemSchema), menuController.createItem);
router.put(
  '/items/:id',
  validateParams(idParamSchema),
  upload.single('image'),
  validateBody(menuItemSchema.partial()),
  menuController.updateItem
);
router.delete('/items/:id', validateParams(idParamSchema), menuController.deleteItem);

export default router;
