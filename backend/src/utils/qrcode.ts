import QRCode from 'qrcode';
import { randomBytes } from 'crypto';

export const generateQRCode = async (data: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(data);
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
};

export const generateUniqueCode = (): string => {
  return randomBytes(32).toString('hex');
};