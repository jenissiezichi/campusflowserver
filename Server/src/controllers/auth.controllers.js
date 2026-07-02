import bcrypt from 'bcrypt';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { validate } from 'deep-email-validator'
import User from '../models/userModel.js';
import { transporter } from '../configs/mailer.js';
import { requestPasswordReset, resetPasswordWithOTP } from '../services/auth.service.js';
import { sendEmail } from '../services/email.service.js';
import Student from '../models/studentModel.js';

// Helper function for token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, fullname: user.fullname, role: user.role, universityId: user.university, matricNumber: user.matric_number },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const register = async (req, res, next) => {
  const { fullname, email, role, university, password } = req.body;
  console.log(req.body)

  if (!fullname || !email || !role || !university || !password) {
    return res.status(400).json({ message: 'Fields not completely filled.' });
  }

  // const result = await validate({ email });

  // console.log(result);
  // console.log(email)

  // if (!result.valid) {
  //   return res.json({
  //     message: `Email is NOT valid`
  //   })
  // }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
}

  try {
    let user = await User.findByEmail(email);
    if (user) {
      return res.status(400).json({ message: 'User with email already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = await User.create(fullname.toLowerCase(), email.toLowerCase(), role, university, passwordHash);
    const token = generateToken(newUser);

    // send a welcome email to the newly registered user
    sendEmail(email, "welcome", fullname).catch(err => console.error("Welcome email failed:", err));
    res.status(201).json({
      message: 'User registered successfully',
      token: `Bearer ${token}`,
      user: { id: newUser.id, fullname: newUser.fullname, email: newUser.email, role: newUser.role, university: newUser.university, matric_number: newUser.matric_number }
    });
  } catch (err) {
    console.error('Registration error:', err);
    next(err);
  }
};

export const login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info?.message || 'Authentication failed' });
    }
    const token = generateToken(user);

    return res.status(200).json({
      message: 'Logged in successfully',
      token: `Bearer ${token}`,
      user: { id: user.id, email: user.email, role: user.role, university: user.university, matric_number: user.matric_number },
    });
  })(req, res, next);
};

export const logout = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully. Please delete the token from client storage.' });
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email field is required.' });
  }

  try {
    await requestPasswordReset(email);
    return res.status(200).json({
      message: 'If that email address exists in our system, an OTP code has been sent.'
    });
  } catch (err) {
    console.error('Forgot password controller error:', err);
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Fields not completely filled.' });
  }
  try {
    await resetPasswordWithOTP(email, otp, newPassword);

    return res.status(200).json({
      message: 'Password reset successful. You can now log in with your new password.'
    });
  } catch (err) {
    console.error('Reset password controller error:', err);
    return res.status(400).json({ error: err.message || 'Failed to reset password.' });
  }
};

export const loadGoogleConcentScreen = (req, res, next) => {
  passport.authenticate('google', { scope: ['email', 'profile'], session: false })(req, res, next)
}

export const verifyGoogleSigninUser = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    if (err) {
      return res.status(500).json({
        message: 'Internal server error during authentication',
        error: err.message
      });
    }
    if (!user) {
      return res.status(401).json({
        message: info?.message || 'Google authentication failed'
      });
    }

    let isNewUser = false;
    let authorisedUser = await User.findByEmail(user.email);
    if (!authorisedUser) {
      authorisedUser = await User.create(user.fullname, user.email);
      isNewUser = true;
    }
    // send a welcome email to the newly registered user
    if (isNewUser) await sendEmail(user.email, "welcome", user.fullname);

    try {
      const token = generateToken(authorisedUser);
      const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
      // UPDATED
return res.redirect(
    `${frontendURL}/#/google-success?token=${encodeURIComponent(token)}&isNewUser=${isNewUser}`
);
    } catch (tokenError) {
      return res.status(500).json({
        message: 'Failed to generate access token',
        error: tokenError.message
      });
    }
  })(req, res, next);
};

export const getMe = (req, res) => {
  if (req.user) {
    const { id, fullname, email, matric_number, department, university } = req.user;
    res.status(200).json({ user: { id, fullname, email, matric_number, department,university } });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

export const getAllStudents = async (req, res) => {
  const students = await Student.getAllStudentsFromDB();
  res.json({
    message: "All students route hit",
    students
  })
}



export const completeProfile = async (req, res, next) => {
  const { role, university } = req.body;
  const userId = req.user.id;

  if (!role || !university) {
    return res.status(400).json({ message: 'Role and university are required.' });
  }

  try {
    await pool.query(
      'UPDATE users SET role = $1, university = $2 WHERE id = $3 RETURNING id, fullname, email, role, university',
      [role, university, userId]
    );
    return res.status(200).json({ message: 'Profile completed successfully.' });
  } catch (err) {
    next(err);
  }
};

