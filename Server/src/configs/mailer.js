import nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';

configDotenv();

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// SMTP_USER=prayskeyo@gmail.com
// SMTP_PASS=UZ0JcjmF9fVI1zRk