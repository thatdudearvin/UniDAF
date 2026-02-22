import { User, UserRole } from '@prisma/client';
import prisma from '../../config/database';

export interface UserData {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface StudentData extends UserData {
  studentId: string;
  enrollmentDate: Date;
}

export interface StaffData extends UserData {
  employeeId: string;
  department: string;
  hireDate: Date;
  position: string;
}

export class UserFactory {
  static async createUser(userData: UserData): Promise<User> {
    switch (userData.role) {
      case UserRole.STUDENT:
        return this.createStudent(userData as StudentData);
      case UserRole.TEACHING_STAFF:
        return this.createTeachingStaff(userData as StaffData);
      case UserRole.NON_TEACHING_STAFF:
        return this.createNonTeachingStaff(userData as StaffData);
      case UserRole.ADMIN:
        return this.createAdmin(userData);
      default:
        throw new Error('Invalid user type');
    }
  }

  private static async createStudent(data: StudentData): Promise<User> {
    return await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: UserRole.STUDENT,
        student: {
          create: {
            studentId: data.studentId,
            enrollmentDate: data.enrollmentDate,
          },
        },
      },
      include: {
        student: true,
      },
    });
  }

  private static async createTeachingStaff(data: StaffData): Promise<User> {
    return await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: UserRole.TEACHING_STAFF,
        teachingStaff: {
          create: {
            employeeId: data.employeeId,
            department: data.department,
            hireDate: data.hireDate,
            position: data.position,
          },
        },
      },
      include: {
        teachingStaff: true,
      },
    });
  }

  private static async createNonTeachingStaff(data: StaffData): Promise<User> {
    return await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: UserRole.NON_TEACHING_STAFF,
        nonTeachingStaff: {
          create: {
            employeeId: data.employeeId,
            department: data.department,
            hireDate: data.hireDate,
            position: data.position,
          },
        },
      },
      include: {
        nonTeachingStaff: true,
      },
    });
  }

  private static async createAdmin(data: UserData): Promise<User> {
    return await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: UserRole.ADMIN,
      },
    });
  }
}