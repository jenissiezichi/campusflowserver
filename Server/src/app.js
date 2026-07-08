import { configDotenv } from 'dotenv';
configDotenv();

import cors from 'cors';
import express from 'express';
import passport from 'passport';
import { passportLocalConfig, passportOauthGoogleConfig } from './configs/passport.js';
import { globalRateLimiter } from './middlewares/rateLimiter.middleware.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import generalRoutes from './routes/general.routes.js';
import mainAlerts from './routes/main.alerts.js';
import solanaRoutes from './routes/solana.routes.js';
import studentsRoutes from './routes/student.route.js';
import superAdminRoutes from './routes/superadmin.routes.js';
const app = express();
const isDev = process.env.NODE_ENV === 'development';

app.use(globalRateLimiter);

app.use(cors({
  origin: isDev ? '*' : process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);

// Log all incoming requests on the server side console
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

passportOauthGoogleConfig(passport);
passportLocalConfig(passport);
app.use(passport.initialize());

// Routes
app.use('/', authRoutes);
app.use('/student', studentsRoutes);
app.use('/admin', adminRoutes);
app.use('/superadmin', superAdminRoutes);
app.use('/universities', solanaRoutes);
app.use('/general', generalRoutes);
app.use('/api', mainAlerts);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err?.stack || err);

  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === 'development'
      ? err.message || err
      : 'Internal Server Error';

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    })
  });
});

export default app;
