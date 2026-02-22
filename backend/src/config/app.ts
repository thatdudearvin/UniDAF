import dotenv from 'dotenv';
import { Secret, SignOptions } from 'jsonwebtoken';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  jwt: {
    secret: process.env.JWT_SECRET as Secret,
    expiresIn: process.env.JWT_EXPIRES_IN as SignOptions['expiresIn'] || '7d',
  },

  qrCode: {
    expiryMinutes: parseInt(process.env.QR_CODE_EXPIRY_MINUTES || '15', 10),
    locationRadiusMeters: parseInt(
      process.env.QR_CODE_LOCATION_RADIUS_METERS || '100',
      10
    ),
  },
};
