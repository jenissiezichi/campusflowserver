import express from 'express';
import passport from 'passport';
import {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    getMe,
    loadGoogleConcentScreen,
    verifyGoogleSigninUser,
    getAllStudents,
    completeProfile,
    verifyOtp
} from '../controllers/auth.controllers.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { authRateLimiter, passwordResetRateLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

// Higher rate limit 
router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);

// Strict otp management for password reset.
router.post('/forgot-password', passwordResetRateLimiter, forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', passwordResetRateLimiter, resetPassword);

router.get('/logout', logout);
router.get('/auth/google', loadGoogleConcentScreen);
router.get('/auth/google/callback', verifyGoogleSigninUser);
router.get('/me', passport.authenticate('jwt', { session: false }), getMe);
router.post('/complete-profile', authMiddleware, completeProfile);
// router.get('/students', passport.authenticate('jwt', { session: false }), getAllStudents);
router.get('/students', getAllStudents);

// refreshes the server
router.get('/health', (req, res)=>res.status(200).json({status: 'ok'}));


export default router;

