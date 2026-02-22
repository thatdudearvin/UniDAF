import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import { attendanceValidation } from '../utils/validation';
import { validate } from '../middleware/validation.middleware';

const router = Router();
const attendanceController = new AttendanceController();

router.post(
  '/qr-code',
  authenticate,
  authorize(UserRole.TEACHING_STAFF, UserRole.ADMIN),
  attendanceController.generateQRCode.bind(attendanceController)
);

router.post(
  '/mark',
  authenticate,
  authorize(UserRole.STUDENT),
  attendanceValidation,
  validate,
  attendanceController.markAttendance.bind(attendanceController)
);

router.get(
  '/student/:studentId',
  authenticate,
  attendanceController.getStudentAttendance.bind(attendanceController)
);

router.get(
  '/class/:classId',
  authenticate,
  authorize(UserRole.TEACHING_STAFF, UserRole.ADMIN),
  attendanceController.getClassAttendance.bind(attendanceController)
);

export default router;
