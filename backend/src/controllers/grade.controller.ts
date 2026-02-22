import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import { NotificationService } from '../observers/NotificationObserver';
import { NotificationType, UserRole } from '@prisma/client';

export class GradeController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = NotificationService.getInstance();
  }

  async createGrade(req: AuthRequest, res: Response) {
    try {
      const { enrollmentId, assessmentType, assessmentName, score, maxScore, weight } = req.body;

      const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!enrollment) {
        throw new AppError('Enrollment not found', 404);
      }

      const grade = await prisma.grade.create({
        data: {
          enrollmentId,
          teacherId: req.user!.userId,
          assessmentType,
          assessmentName,
          score,
          maxScore,
          weight,
          gradedAt: new Date(),
        },
      });

      res.status(201).json(grade);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async publishGrade(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const grade = await prisma.grade.findUnique({
        where: { id },
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

      if (!grade) {
        throw new AppError('Grade not found', 404);
      }

      const updatedGrade = await prisma.grade.update({
        where: { id },
        data: {
          isPublished: true,
          publishedAt: new Date(),
        },
      });

      // Send notification
      await this.notificationService.sendNotification({
        userId: grade.enrollment.student.user.id,
        type: NotificationType.GRADE_PUBLISHED,
        title: 'New Grade Published',
        message: `Your grade for ${grade.assessmentName} in ${grade.enrollment.class.subject.name} has been published`,
      });

      res.json(updatedGrade);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getStudentGrades(req: AuthRequest, res: Response) {
    try {
      const { studentId } = req.params;

      // Authorization check
      if (req.user!.role === UserRole.STUDENT && req.user!.userId !== studentId) {
        throw new AppError('Forbidden', 403);
      }

      const student = await prisma.student.findUnique({
        where: { userId: studentId },
      });

      if (!student) {
        throw new AppError('Student not found', 404);
      }

      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: student.id },
        include: {
          class: {
            include: {
              subject: true,
              teacher: {
                include: {
                  user: true,
                },
              },
            },
          },
          grades: {
            where: { isPublished: true },
            orderBy: { gradedAt: 'desc' },
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

  async getClassGrades(req: AuthRequest, res: Response) {
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
          grades: {
            orderBy: { gradedAt: 'desc' },
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
}