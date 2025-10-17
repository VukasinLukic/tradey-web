import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import { corsOptions } from './config/cors';


// DOCKER BIND MOUNT TEST (komentar za dokumentaciju)
console.log("✅ DOCKER BIND MOUNT TEST - Server reloaded via bind mount!");
console.log("🔥 Bind mount LIVE proof - second change!");



// Load environment variables
dotenv.config();

// Import Firebase Admin to initialize it
import './config/firebaseAdmin';

// Create Express app
const app = express();

// Port fallback logic - try multiple ports
const PORTS = [
  parseInt(process.env.PORT || '5000'),
  5000,
  5001,
  5002,
  5003
];

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
 * Start Server with Port Fallback
 */

const tryPort = (portIndex: number = 0): void => {
  if (portIndex >= PORTS.length) {
    console.error('❌ All ports are in use! Please free up a port or kill existing processes.');
    process.exit(1);
    return;
  }

  const PORT = PORTS[portIndex];

  const server = app.listen(PORT)
    .on('listening', () => {
      console.log('='.repeat(50));
      console.log(`🚀 TRADEY Backend API is running`);
      console.log(`📍 Server: http://localhost:${PORT}`);
      console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⚡ CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
      if (portIndex > 0) {
        console.log(`⚠️  Using fallback port ${PORT} (default port was in use)`);
      }
      console.log('='.repeat(50));
    })
    .on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️  Port ${PORT} is in use, trying next port...`);
        server.close();
        tryPort(portIndex + 1);
      } else {
        console.error('❌ Server error:', err);
        process.exit(1);
      }
    });
};

tryPort();

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
