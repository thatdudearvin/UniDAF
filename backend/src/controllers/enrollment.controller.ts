import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import { AcademicFacade } from '../facades/AcademicFacade';
import prisma from '../config/database';

export class EnrollmentController {
  private academicFacade: AcademicFacade;

  constructor() {
    this.academicFacade = new AcademicFacade();
  }

  async createEnrollment(req: AuthRequest, res: Response) {
    try {
      const { studentId, classId } = req.body;

      const enrollment = await this.academicFacade.processEnrollment({
        studentId,
        classId,
      });

      res.status(201).json(enrollment);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getStudentEnrollments(req: AuthRequest, res: Response) {
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

  async getAvailableClasses(_req: AuthRequest, res: Response) {
    try {
      const classes = await prisma.class.findMany({
        where: {
          currentEnrollment: {
            lt: prisma.class.fields.maxStudents,
          },
        },
        include: {
          subject: true,
          teacher: {
            include: {
              user: true,
            },
          },
        },
      });

      res.json(classes);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}