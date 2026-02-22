// @ts-nocheck
import { UserRole, StudentStatus, EnrollmentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from './prisma';



async function main() {
  console.log('Starting database seed...');

  // Create Admin User
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@university.edu' },
    update: {},
    create: {
      email: 'admin@university.edu',
      passwordHash: adminPasswordHash,
      firstName: 'System',
      lastName: 'Administrator',
      role: UserRole.ADMIN,
      nonTeachingStaff: {
        create: {
          employeeId: 'ADMIN001',
          department: 'Administration',
          hireDate: new Date('2020-01-01'),
          position: 'System Administrator',
        },
      },
    },
  });
  console.log('Created admin user');

  // Create Teacher User
  const teacherPasswordHash = await bcrypt.hash('Teacher@123', 10);
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@university.edu' },
    update: {},
    create: {
      email: 'teacher@university.edu',
      passwordHash: teacherPasswordHash,
      firstName: 'John',
      lastName: 'Smith',
      role: UserRole.TEACHING_STAFF,
      teachingStaff: {
        create: {
          employeeId: 'TEACH001',
          department: 'Computer Science',
          hireDate: new Date('2021-08-01'),
          position: 'Associate Professor',
        },
      },
    },
  });
  console.log('Created teacher user');

  // Create Student User
  const studentPasswordHash = await bcrypt.hash('Student@123', 10);
  const student = await prisma.user.upsert({
    where: { email: 'student@university.edu' },
    update: {},
    create: {
      email: 'student@university.edu',
      passwordHash: studentPasswordHash,
      firstName: 'Sophia',
      lastName: 'Angelio',
      role: UserRole.STUDENT,
      student: {
        create: {
          studentId: 'STU2024001',
          enrollmentDate: new Date('2024-09-01'),
          status: StudentStatus.ACTIVE,
          currentGPA: 3.75,
        },
      },
    },
  });
  console.log('Created student user');

  // Create Subjects
  const subject1 = await prisma.subject.upsert({
    where: { code: 'CS101' },
    update: {},
    create: {
      code: 'CS101',
      name: 'Introduction to Programming',
      credits: 3,
      description: 'Fundamentals of programming using modern languages',
      isActive: true,
    },
  });

  const subject2 = await prisma.subject.upsert({
    where: { code: 'CS201' },
    update: {},
    create: {
      code: 'CS201',
      name: 'Data Structures and Algorithms',
      credits: 4,
      description: 'Advanced data structures and algorithm design',
      isActive: true,
    },
  });

  const subject3 = await prisma.subject.upsert({
    where: { code: 'CS301' },
    update: {},
    create: {
      code: 'CS301',
      name: 'Database Systems',
      credits: 3,
      description: 'Relational database design and SQL',
      isActive: true,
    },
  });
  console.log('Created subjects');

  // Get teacher staff record
  const teacherStaff = await prisma.teachingStaff.findUnique({
    where: { userId: teacher.id },
  });

  if (!teacherStaff) {
    throw new Error('Teacher staff record not found');
  }

  // Create Classes
  const class1 = await prisma.class.upsert({
    where: { classCode: 'CS101-A-2024' },
    update: {},
    create: {
      subjectId: subject1.id,
      teacherId: teacherStaff.id,
      classCode: 'CS101-A-2024',
      semester: 'Fall',
      academicYear: '2024',
      maxStudents: 30,
      currentEnrollment: 1,
      room: 'Room 101',
      schedule: 'Mon/Wed 10:00-11:30',
    },
  });

  const class2 = await prisma.class.upsert({
    where: { classCode: 'CS201-A-2024' },
    update: {},
    create: {
      subjectId: subject2.id,
      teacherId: teacherStaff.id,
      classCode: 'CS201-A-2024',
      semester: 'Fall',
      academicYear: '2024',
      maxStudents: 25,
      currentEnrollment: 1,
      room: 'Room 201',
      schedule: 'Tue/Thu 14:00-15:30',
    },
  });

  const class3 = await prisma.class.upsert({
    where: { classCode: 'CS301-A-2024' },
    update: {},
    create: {
      subjectId: subject3.id,
      teacherId: teacherStaff.id,
      classCode: 'CS301-A-2024',
      semester: 'Fall',
      academicYear: '2024',
      maxStudents: 20,
      currentEnrollment: 1,
      room: 'Room 301',
      schedule: 'Mon/Wed 14:00-15:30',
    },
  });
  console.log('Created classes');

  // Get student record
  const studentRecord = await prisma.student.findUnique({
    where: { userId: student.id },
  });

  if (!studentRecord) {
    throw new Error('Student record not found');
  }

  // Create Enrollments
  const enrollment1 = await prisma.enrollment.upsert({
    where: {
      studentId_classId: {
        studentId: studentRecord.id,
        classId: class1.id,
      },
    },
    update: {},
    create: {
      studentId: studentRecord.id,
      classId: class1.id,
      status: EnrollmentStatus.ENROLLED,
      enrollmentDate: new Date('2024-09-01'),
    },
  });

  const enrollment2 = await prisma.enrollment.upsert({
    where: {
      studentId_classId: {
        studentId: studentRecord.id,
        classId: class2.id,
      },
    },
    update: {},
    create: {
      studentId: studentRecord.id,
      classId: class2.id,
      status: EnrollmentStatus.ENROLLED,
      enrollmentDate: new Date('2024-09-01'),
    },
  });

  const enrollment3 = await prisma.enrollment.upsert({
    where: {
      studentId_classId: {
        studentId: studentRecord.id,
        classId: class3.id,
      },
    },
    update: {},
    create: {
      studentId: studentRecord.id,
      classId: class3.id,
      status: EnrollmentStatus.ENROLLED,
      enrollmentDate: new Date('2024-09-01'),
    },
  });
  console.log('Created enrollments');

  // Create Sample Grades
  await prisma.grade.create({
    data: {
      enrollmentId: enrollment1.id,
      teacherId: teacher.id,
      assessmentType: 'Quiz',
      assessmentName: 'Quiz 1',
      score: 18,
      maxScore: 20,
      weight: 0.1,
      letterGrade: 'A',
      gradedAt: new Date(),
      publishedAt: new Date(),
      isPublished: true,
    },
  });

  await prisma.grade.create({
    data: {
      enrollmentId: enrollment1.id,
      teacherId: teacher.id,
      assessmentType: 'Midterm',
      assessmentName: 'Midterm Exam',
      score: 85,
      maxScore: 100,
      weight: 0.3,
      letterGrade: 'B+',
      gradedAt: new Date(),
      publishedAt: new Date(),
      isPublished: true,
    },
  });
  console.log('Created sample grades');

  // Create Class Sessions
  const today = new Date();
  const classSession = await prisma.classSession.create({
    data: {
      classId: class1.id,
      sessionDate: today,
      startTime: new Date(today.setHours(10, 0, 0, 0)),
      endTime: new Date(today.setHours(11, 30, 0, 0)),
      room: 'Room 101',
      topic: 'Introduction to Variables and Data Types',
      isCancelled: false,
    },
  });
  console.log('Created class sessions');

  console.log('Database seeding completed successfully!');
  console.log('\nDefault Credentials:');
  console.log('Admin: admin@university.edu / Admin@123');
  console.log('Teacher: teacher@university.edu / Teacher@123');
  console.log('Student: student@university.edu / Student@123');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });