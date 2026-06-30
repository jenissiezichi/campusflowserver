import crypto from 'crypto';

export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const getOTPExpiry = (minutes) => {
  const now = new Date();
  return new Date(now.getTime() + minutes * 60 * 1000);
};

export const isOTPExpired = (expiryTime) => {
  const now = new Date();
  const expiry = new Date(expiryTime);
  return now.getTime() > expiry.getTime();
};
