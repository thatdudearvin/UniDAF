import { Router, Request, Response } from 'express';
import { GradeController } from '../controllers/grade.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import { gradeValidation } from '../utils/validation';
import { validate } from '../middleware/validation.middleware';

const router = Router();
const gradeController = new GradeController();

router.post(
  '/',
  authenticate,
  authorize(UserRole.TEACHING_STAFF, UserRole.ADMIN),
  gradeValidation,
  validate,
  (req: Request, res: Response) => gradeController.createGrade(req, res)
);

router.patch(
  '/:id/publish',
  authenticate,
  authorize(UserRole.TEACHING_STAFF, UserRole.ADMIN),
  (req: Request, res: Response) => gradeController.publishGrade(req, res)
);

router.get('/student/:studentId', authenticate, (req: Request, res: Response) =>
  gradeController.getStudentGrades(req, res)
);

router.get(
  '/class/:classId',
  authenticate,
  authorize(UserRole.TEACHING_STAFF, UserRole.ADMIN),
  (req: Request, res: Response) => gradeController.getClassGrades(req, res)
);

export default router;
