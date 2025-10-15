# TRADEY Backend API

Backend REST API for the TRADEY clothing exchange platform built with Node.js, Express, TypeScript, and Firebase Admin SDK.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env and add your Firebase credentials

# Add Firebase service account key to firebase-service-account.json

# Run development server
npm run dev
```

Server: http://localhost:5000

## API Endpoints

See `/docs/API.md` for complete documentation.

### Core Endpoints
- `GET /api/health` - Health check
- `GET /api/posts` - Get posts (public)
- `POST /api/posts` - Create post (protected)
- `GET /api/users/:id` - Get user profile
- `POST /api/users/:id/follow` - Follow user (protected)
- `GET /api/chats` - Get chats (protected)
- `POST /api/chats/:chatId/messages` - Send message (protected)

## Authentication

Protected routes require Firebase JWT token:
```bash
Authorization: Bearer <firebase-jwt-token>
```

## Project Structure

```
backend/src/
├── config/         # Firebase Admin, CORS
├── controllers/    # Request handlers
├── middleware/     # Auth, error handling, rate limiting
├── routes/        # API routes
├── services/      # Firestore, Storage services
└── server.ts      # Entry point
```

## Firestore Indexes

Some queries require composite indexes. When you see an index error, click the provided URL to create it automatically.

Required indexes:
- Posts: `isAvailable` (ASC) + `createdAt` (DESC)
- Chats: `participants` (ARRAY_CONTAINS) + `updatedAt` (DESC)

## Environment Variables

```env
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_ADMIN_KEY_PATH=./firebase-service-account.json
CORS_ORIGIN=http://localhost:5173
```

## Testing

```bash
# Health check
curl http://localhost:5000/api/health

# Get posts
curl http://localhost:5000/api/posts

# Protected route (requires token)
curl -X POST http://localhost:5000/api/chats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Docker

```bash
docker-compose up backend
```

## Security Features

- JWT authentication
- Rate limiting (100 req/15min)
- Input validation (Zod)
- CORS protection
- Owner-only operations

## License

MIT
