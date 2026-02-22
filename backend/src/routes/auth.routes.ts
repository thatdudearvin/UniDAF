import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { loginValidation } from '../utils/validation';
import { validate } from '../middleware/validation.middleware';

const router = Router();
const authController = new AuthController();

router.post('/login', loginValidation, validate, authController.login);
router.get('/profile', authenticate, authController.getProfile);
router.post('/change-password', authenticate, authController.changePassword);

export default router;
