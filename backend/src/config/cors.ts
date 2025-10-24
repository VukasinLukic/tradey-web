import { CorsOptions } from 'cors';

// Parse CORS_ORIGIN environment variable (can be comma-separated list)
const getAllowedOrigins = (): string[] => {
  const envOrigins = process.env.CORS_ORIGIN;

  // Default development origins (support multiple Vite ports)
  const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://localhost:5178',
    'http://localhost:5179',
    'http://localhost:3000',
  ];

  if (!envOrigins) {
    return defaultOrigins;
  }

  // Split by comma and trim whitespace, filter out empty strings
  const productionOrigins = envOrigins
    .split(',')
    .map(origin => origin.trim())
    .filter(origin => origin.length > 0);

  // Combine production and development origins (development origins for backward compatibility)
  return [...new Set([...productionOrigins, ...defaultOrigins])];
};

export const corsOptions: CorsOptions = {
  origin: getAllowedOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Log allowed origins on startup
console.log('🌍 CORS allowed origins:', getAllowedOrigins());
