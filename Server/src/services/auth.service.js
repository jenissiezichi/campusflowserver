import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import { generateOTP, getOTPExpiry, isOTPExpired } from '../utils/otp.util.js';
import { transporter } from '../configs/mailer.js';
import { sendEmail } from './email.service.js';

export const requestPasswordReset = async (email) => {
  try {
    const user = await User.findByEmail(email);

    if (!user) {
      return { success: true };
    }

    // Generate + save OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiry(10); // 10 mins

    await User.updateResetOTP(email, otp, expiresAt.toISOString());

    await sendEmail(email, "resetPassword", otp);
  } catch (error) {
    console.error('Request password reset service error:', error);
    throw error;
  }
};

export const resetPasswordWithOTP = async (email, otp, newPassword) => {
  const user = await User.findResetDataByEmail(email);

  if (!user) {
    throw new Error('Invalid request');
  }

  if (!user.reset_otp || user.reset_otp !== otp) {
    throw new Error('Invalid OTP');
  }

  if (isOTPExpired(user.reset_otp_expires)) {
    throw new Error('OTP expired');
  }


  if (!newPassword || newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);

  await User.updatePasswordAndClearOTP(user.id, hash);

  return { success: true };
};
export const verifyResetOTP = async (email, otp) => {
  const user = await User.findResetDataByEmail(email);
  if (!user || !user.reset_otp || user.reset_otp !== otp) {
    throw new Error('Invalid OTP');
  }
  if(isOTPExpired(user.reset_otp_expires)) {
    throw new Error('OTP expired');
  }
}
