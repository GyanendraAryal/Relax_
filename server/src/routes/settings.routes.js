import { Router } from 'express';
import * as settingsController from '../controllers/settings.controller.js';
import { validateBody } from '../middlewares/validate.js';
import { settingsUpdateSchema } from '../validations/settings.schema.js';
import { authenticate, attachUser } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.get('/public', settingsController.getPublic);

router.use(authenticate, attachUser);
router.get('/', settingsController.getAll);
router.put('/', validateBody(settingsUpdateSchema), settingsController.update);
router.post('/hero-image', upload.single('image'), settingsController.uploadHeroImage);
router.delete('/hero-image', settingsController.deleteHeroImage);
router.post('/story-image', upload.single('image'), settingsController.uploadStoryImage);
router.delete('/story-image', settingsController.deleteStoryImage);

export default router;
