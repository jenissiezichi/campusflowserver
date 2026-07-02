import nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';

configDotenv();

const isDev = process.env.NODE_ENV === 'development';

export const transporter = nodemailer.createTransport({
  host: '://brevo.com',
  port: 587,
  secure: false,
  auth: {
    // user: process.env.GMAIL_USER,
    user: "b08066001@smtp-brevo.com",
    pass: "UZ0JcjmF9fVI1zRk"
    // pass: process.env.GMAIL_APP_PASS
  },
  tls: {
    rejectUnauthorized: false 
  }
});
