import { Router } from 'express';
import authRoutes from './auth.routes';
import gradeRoutes from './grade.routes';
import enrollmentRoutes from './enrollment.routes';
import attendanceRoutes from './attendance.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/grades', gradeRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/attendance', attendanceRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;