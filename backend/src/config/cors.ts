import { CorsOptions } from 'cors';

// Parse CORS_ORIGIN environment variable (can be comma-separated list)
const getAllowedOrigins = (): string[] => {
  const envOrigins = process.env.CORS_ORIGIN;
  const nodeEnv = process.env.NODE_ENV;

  // Development origins (only used in development mode)
  const devOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://localhost:5178',
    'http://localhost:5179',
    'http://localhost:3000',
  ];

  // In production, ONLY use explicitly configured origins
  if (nodeEnv === 'production') {
    if (!envOrigins) {
      console.error('⚠️  WARNING: CORS_ORIGIN not set in production! No origins will be allowed.');
      return [];
    }

    // Production mode: use ONLY explicitly configured origins
    const productionOrigins = envOrigins
      .split(',')
      .map(origin => origin.trim())
      .filter(origin => origin.length > 0);

    return productionOrigins;
  }

  // Development mode: allow dev origins + any configured origins
  if (envOrigins) {
    const configuredOrigins = envOrigins
      .split(',')
      .map(origin => origin.trim())
      .filter(origin => origin.length > 0);

    return [...new Set([...devOrigins, ...configuredOrigins])];
  }

  // Development with no explicit config
  return devOrigins;
};

export const corsOptions: CorsOptions = {
  origin: getAllowedOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-token']
};

// Log allowed origins on startup
const allowedOrigins = getAllowedOrigins();
console.log('🌍 CORS Configuration:');
console.log('   Environment:', process.env.NODE_ENV || 'development');
console.log('   Allowed origins:', allowedOrigins.length > 0 ? allowedOrigins : 'NONE (⚠️  WARNING)');
if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
  console.error('   ❌ CRITICAL: No CORS origins configured for production!');
}
