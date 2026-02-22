import { Router, Request, Response } from 'express';
import { EnrollmentController } from '../controllers/enrollment.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import { enrollmentValidation } from '../utils/validation';
import { validate } from '../middleware/validation.middleware';

const router = Router();
const enrollmentController = new EnrollmentController();

router.post(
  '/',
  authenticate,
  authorize(UserRole.NON_TEACHING_STAFF, UserRole.ADMIN),
  enrollmentValidation,
  validate,
  (req: Request, res: Response) =>
    enrollmentController.createEnrollment(req, res)
);

router.get(
  '/student/:studentId',
  authenticate,
  (req: Request, res: Response) =>
    enrollmentController.getStudentEnrollments(req, res)
);

router.get(
  '/available-classes',
  authenticate,
  (req: Request, res: Response) =>
    enrollmentController.getAvailableClasses(req, res)
);

export default router;
