import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import prisma from '../config/database';
import { generateQRCode, generateUniqueCode } from '../utils/qrcode';
import { config } from '../config/app';
import { AttendanceStatus, NotificationType } from '@prisma/client';
import { NotificationService } from '../observers/NotificationObserver';


export class AttendanceController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = NotificationService.getInstance();
  }

  async generateQRCode(req: AuthRequest, res: Response) {
    try {
      const { classSessionId } = req.body;

      const classSession = await prisma.classSession.findUnique({
        where: { id: classSessionId },
      });

      if (!classSession) {
        throw new AppError('Class session not found', 404);
      }

      const code = generateUniqueCode();
      const validFrom = new Date();
      const validUntil = new Date(validFrom.getTime() + config.qrCode.expiryMinutes * 60000);

      const qrCodeRecord = await prisma.qRCode.create({
        data: {
          classSessionId,
          generatedBy: req.user!.userId,
          code,
          validFrom,
          validUntil,
          isActive: true,
        },
      });

      const qrCodeImage = await generateQRCode(code);

      res.json({
        qrCode: qrCodeRecord,
        qrCodeImage,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async markAttendance(req: AuthRequest, res: Response) {
    try {
      const { qrCode, enrollmentId, classSessionId, locationData } = req.body;

      // Verify QR code
      const qrCodeRecord = await prisma.qRCode.findUnique({
        where: { code: qrCode },
      });

      if (!qrCodeRecord || !qrCodeRecord.isActive) {
        throw new AppError('Invalid QR code', 400);
      }

      const now = new Date();
      if (now < qrCodeRecord.validFrom || now > qrCodeRecord.validUntil) {
        throw new AppError('QR code expired', 400);
      }

      // Check if already marked
      const existingRecord = await prisma.attendanceRecord.findUnique({
        where: {
          enrollmentId_classSessionId: {
            enrollmentId,
            classSessionId,
          },
        },
      });

      if (existingRecord) {
        throw new AppError('Attendance already marked', 400);
      }

      // Create attendance record
      const attendance = await prisma.attendanceRecord.create({
        data: {
          enrollmentId,
          classSessionId,
          date: new Date(),
          status: AttendanceStatus.PRESENT,
          qrCodeUsed: qrCode,
          markedAt: new Date(),
          markedBy: req.user!.userId,
          locationData,
        },
        include: {
          enrollment: {
            include: {
              student: {
                include: {
                  user: true,
                },
              },
              class: {
                include: {
                  subject: true,
                },
              },
            },
          },
        },
      });

      // Send notification
      await this.notificationService.sendNotification({
        userId: attendance.enrollment.student.user.id,
        type: NotificationType.ATTENDANCE_MARKED,
        title: 'Attendance Marked',
        message: `Your attendance for ${attendance.enrollment.class.subject.name} has been recorded`,
      });

      res.status(201).json(attendance);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getStudentAttendance(req: AuthRequest, res: Response) {
    try {
      const { studentId } = req.params;

      const student = await prisma.student.findUnique({
        where: { userId: studentId },
      });

      if (!student) {
        throw new AppError('Student not found', 404);
      }

      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: student.id },
        include: {
          attendanceRecords: {
            include: {
              classSession: true,
            },
            orderBy: {
              date: 'desc',
            },
          },
          class: {
            include: {
              subject: true,
            },
          },
        },
      });

      res.json(enrollments);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getClassAttendance(req: AuthRequest, res: Response) {
    try {
      const { classId } = req.params;

      const enrollments = await prisma.enrollment.findMany({
        where: { classId },
        include: {
          student: {
            include: {
              user: true,
            },
          },
          attendanceRecords: {
            orderBy: {
              date: 'desc',
            },
          },
        },
      });

      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}