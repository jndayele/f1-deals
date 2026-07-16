const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pinoHttp = require('pino-http');
const logger = require('./utils/logger');

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const carPublicRoutes = require('./routes/car.public.routes');
const carAdminRoutes = require('./routes/car.admin.routes');
const reviewPublicRoutes = require('./routes/review.public.routes');
const reviewAdminRoutes = require('./routes/review.admin.routes');
const dashboardAdminRoutes = require('./routes/dashboard.admin.routes');
const enquiryPublicRoutes = require('./routes/enquiry.public.routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// Security headers
app.use(helmet());

// Restrict CORS to known frontend origins
const allowedOrigins = (process.env.FRONTEND_URL || '').split(',').map(o => o.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server requests (no origin) and listed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      const err = new Error('Not allowed by CORS');
      err.status = 403;
      err.code = 'FORBIDDEN';
      callback(err);
    }
  },
  credentials: true
}));

// Structured HTTP request logging
app.use(pinoHttp({ logger }));

app.use(express.json());

// Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/cars', carPublicRoutes);
app.use('/api/v1/admin/cars', carAdminRoutes);
app.use('/api/v1/reviews', reviewPublicRoutes);
app.use('/api/v1/admin/reviews', reviewAdminRoutes);
app.use('/api/v1/admin/dashboard', dashboardAdminRoutes);
app.use('/api/v1/enquiries', enquiryPublicRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
    },
  });
});

// Centralized error handler (must be last)
app.use(errorHandler);

module.exports = app;
