import {rateLimit} from 'express-rate-limit';
import jwt from 'jsonwebtoken';

// Stricter limiter tailored strictly for OTP/Password Reset requests
export const passwordResetRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: 'Too many password reset attempts. Please try again in 15 minutes.',
  },
});

// Relaxed limiter for standard authentication interactions (Login & Register)
export const authRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 30, 
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: 'Too many login attempts. Please wait a few minutes and try again.',
  },
});

// High-capacity global limiter to protect system endpoints from flooding
export const globalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  limit: 120, 
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: 'Server is experiencing high traffic. Please slow down your requests.',
  },
});


