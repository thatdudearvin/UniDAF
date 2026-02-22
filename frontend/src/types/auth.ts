export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHING_STAFF = 'TEACHING_STAFF',
  NON_TEACHING_STAFF = 'NON_TEACHING_STAFF',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  student?: any;
  teachingStaff?: any;
  nonTeachingStaff?: any;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}