import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import { corsOptions } from './config/cors';

// Load environment variables
dotenv.config();

// Import Firebase Admin to initialize it
import './config/firebaseAdmin';

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Middleware Setup
 */

// CORS
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting for API routes
app.use('/api', apiLimiter);

/**
 * Routes
 */

// API routes (all routes are prefixed with /api)
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'TRADEY Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      posts: '/api/posts',
      users: '/api/users',
      chats: '/api/chats',
    },
    docs: 'See /docs/API.md for full documentation',
  });
});

/**
 * Error Handling
 */

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

/**
 * Start Server
 */

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 TRADEY Backend API is running`);
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⚡ CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  console.log('='.repeat(50));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

export default app;
