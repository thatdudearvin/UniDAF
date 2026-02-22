import { body, ValidationChain } from 'express-validator';

export const loginValidation: ValidationChain[] = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const gradeValidation: ValidationChain[] = [
  body('enrollmentId').isUUID().withMessage('Valid enrollment ID is required'),
  body('assessmentType').notEmpty().withMessage('Assessment type is required'),
  body('assessmentName').notEmpty().withMessage('Assessment name is required'),
  body('score').isFloat({ min: 0 }).withMessage('Score must be a positive number'),
  body('maxScore').isFloat({ min: 0 }).withMessage('Max score must be a positive number'),
  body('weight')
    .isFloat({ min: 0, max: 1 })
    .withMessage('Weight must be between 0 and 1'),
];

export const enrollmentValidation: ValidationChain[] = [
  body('studentId').isUUID().withMessage('Valid student ID is required'),
  body('classId').isUUID().withMessage('Valid class ID is required'),
];

export const attendanceValidation: ValidationChain[] = [
  body('qrCode').notEmpty().withMessage('QR code is required'),
  body('enrollmentId').isUUID().withMessage('Valid enrollment ID is required'),
  body('classSessionId').isUUID().withMessage('Valid class session ID is required'),
];
