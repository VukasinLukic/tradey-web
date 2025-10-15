# TRADEY Backend

Express + TypeScript + Firebase Admin SDK

## ⚠️ IMPORTANT: Security Setup Required

**Before running the backend, you MUST:**

1. **Rotate Firebase API Keys** (already done in frontend/.env)
2. **Download Firebase Service Account Key:**
   - Go to [Firebase Console](https://console.firebase.google.com) → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save the downloaded file as `firebase-service-account.json` in this directory
   - **NEVER commit this file!** It's already in .gitignore

3. **Environment is already configured** in `backend/.env` (created with your Firebase project ID)

## Setup

1. Install dependencies:
```bash
npm install
```

2. **Add Firebase Service Account Key** (see IMPORTANT section above)

3. Run development server:
```bash
npm run dev
```

Server will start on http://localhost:5000

## API Endpoints

See `../docs/API.md` for complete API documentation.

### Health Check
- `GET /api/health`

### Posts
- `GET /api/posts` - List posts
- `GET /api/posts/:id` - Get post
- `POST /api/posts` - Create post (auth)
- `PUT /api/posts/:id` - Update post (auth)
- `DELETE /api/posts/:id` - Delete post (auth)
- `POST /api/posts/:id/like` - Like/unlike post (auth)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile (auth)
- `POST /api/users/:id/follow` - Follow/unfollow (auth)

### Chat
- `GET /api/chats` - List chats (auth)
- `GET /api/chats/:chatId/messages` - Get messages (auth)
- `POST /api/chats/:chatId/messages` - Send message (auth)
- `POST /api/chats` - Create chat (auth)

## Build

```bash
npm run build
npm start
```

## Docker

```bash
docker build -t tradey-backend .
docker run -p 5000:5000 --env-file .env tradey-backend
```

