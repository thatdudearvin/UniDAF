import prisma from '../config/database';
import { EnrollmentStatus, NotificationType } from '@prisma/client';
import { NotificationService } from '../observers/NotificationObserver';
import { AppError } from '../middleware/error.middleware';

export interface EnrollmentData {
  studentId: string;
  classId: string;
}

export interface GradeCalculationResult {
  finalScore: number;
  letterGrade: string;
  gpa: number;
}

export class AcademicFacade {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = NotificationService.getInstance();
  }

  async processEnrollment(data: EnrollmentData): Promise<any> {
    // Check if class is full
    const classInfo = await prisma.class.findUnique({
      where: { id: data.classId },
    });

    if (!classInfo) {
      throw new AppError('Class not found', 404);
    }

    if (classInfo.currentEnrollment >= classInfo.maxStudents) {
      throw new AppError('Class is full', 400);
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_classId: {
          studentId: data.studentId,
          classId: data.classId,
        },
      },
    });

    if (existingEnrollment) {
      throw new AppError('Already enrolled in this class', 400);
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: data.studentId,
        classId: data.classId,
        status: EnrollmentStatus.ENROLLED,
      },
      include: {
        class: {
          include: {
            subject: true,
          },
        },
        student: {
          include: {
            user: true,
          },
        },
      },
    });

    // Update class enrollment count
    await prisma.class.update({
      where: { id: data.classId },
      data: {
        currentEnrollment: {
          increment: 1,
        },
      },
    });

    // Send notification
    await this.notificationService.sendNotification({
      userId: enrollment.student.user.id,
      type: NotificationType.ENROLLMENT_CONFIRMED,
      title: 'Enrollment Confirmed',
      message: `You have been enrolled in ${enrollment.class.subject.name}`,
    });

    return enrollment;
  }

  async calculateFinalGrade(enrollmentId: string): Promise<GradeCalculationResult> {
    const grades = await prisma.grade.findMany({
      where: {
        enrollmentId,
        isPublished: true,
      },
    });

    if (grades.length === 0) {
      throw new AppError('No published grades found', 404);
    }

    // Calculate weighted average
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const grade of grades) {
      const percentage = (Number(grade.score) / Number(grade.maxScore)) * 100;
      totalWeightedScore += percentage * Number(grade.weight);
      totalWeight += Number(grade.weight);
    }

    const finalScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

    // Calculate letter grade
    const letterGrade = this.calculateLetterGrade(finalScore);

    // Calculate GPA
    const gpa = this.calculateGPA(letterGrade);

    // Update enrollment
    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        finalScore,
        finalGrade: letterGrade,
      },
    });

    return {
      finalScore,
      letterGrade,
      gpa,
    };
  }

  async calculateStudentGPA(studentId: string): Promise<number> {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId,
        status: EnrollmentStatus.COMPLETED,
        finalGrade: {
          not: null,
        },
      },
      include: {
        class: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (enrollments.length === 0) {
      return 0;
    }

    let totalGradePoints = 0;
    let totalCredits = 0;

    for (const enrollment of enrollments) {
      const gpa = this.calculateGPA(enrollment.finalGrade!);
      const credits = enrollment.class.subject.credits;
      totalGradePoints += gpa * credits;
      totalCredits += credits;
    }

    const overallGPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

    // Update student GPA
    await prisma.student.update({
      where: { id: studentId },
      data: {
        currentGPA: overallGPA,
      },
    });

    return overallGPA;
  }

  private calculateLetterGrade(percentage: number): string {
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 63) return 'D';
    if (percentage >= 60) return 'D-';
    return 'F';
  }

  private calculateGPA(letterGrade: string): number {
    const gradeMap: { [key: string]: number } = {
      A: 4.0,
      'A-': 3.7,
      'B+': 3.3,
      B: 3.0,
      'B-': 2.7,
      'C+': 2.3,
      C: 2.0,
      'C-': 1.7,
      'D+': 1.3,
      D: 1.0,
      'D-': 0.7,
      F: 0.0,
    };

    return gradeMap[letterGrade] || 0.0;
  }
}