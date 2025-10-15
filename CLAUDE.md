# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TRADEY is a second-hand clothing trading platform built as a monorepo with three main packages:
- **frontend/**: React 19 + Vite + Tailwind CSS 4
- **backend/**: Node.js + Express + Firebase Admin SDK
- **shared/**: Shared TypeScript types and Zod validation schemas

The architecture follows a strict client-server separation where the frontend only uses Firebase for authentication, while all data operations (Firestore, Storage) go through the backend API.

## Development Commands

### Frontend (from `frontend/` directory)
```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production (TypeScript check + Vite build)
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend (from `backend/` directory)
```bash
npm run dev          # Start development server with nodemon (http://localhost:5000)
npm run build        # Compile TypeScript to dist/
npm run start        # Run compiled production code
npm run lint         # Run ESLint
```

### Shared (from `shared/` directory)
```bash
npm run build        # Compile TypeScript types
```

### Docker
```bash
docker-compose up --build    # Build and start both services
docker-compose down          # Stop all services
```

**Important**: Backend runs on port 5000, frontend runs on port 5173 (dev) or 3000 (Docker).

## Architecture

### Authentication Flow
1. **Frontend**: Uses Firebase Client SDK for sign-up/sign-in (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`)
2. **Frontend**: Obtains JWT (ID Token) from Firebase Auth
3. **Frontend**: Includes JWT in `Authorization: Bearer <token>` header for all API requests
4. **Backend**: Uses `authMiddleware.ts` with Firebase Admin SDK to verify JWT tokens
5. **Backend**: Protects all sensitive routes with auth middleware

### Data Flow
- **All data mutations (posts, likes, follows, chat) MUST go through backend API**
- Frontend does NOT write directly to Firestore or Storage
- Backend validates all requests, manages Firestore collections, and handles Storage uploads
- Frontend fetches data via GET requests to backend

### Monorepo Structure
The `shared/` package provides:
- **types/**: User, Post, Chat TypeScript interfaces
- **constants/**: Firestore paths, validation schemas (Zod)

Both frontend and backend import from shared via `"shared": "file:../shared"` in package.json.

## Key Files and Locations

### Frontend
- `src/firebase/config.ts` - Firebase client configuration (Auth only)
- `src/services/api.ts` - Centralized API client with axios (adds JWT automatically)
- `src/store/` - Zustand state management (authStore, uiStore)
- `src/components/` - Organized by domain: auth/, chat/, post/, layout/, ui/
- `src/pages/` - Route components
- `src/hooks/` - Custom React hooks (useAuth, usePost, etc.)

### Backend
- `src/server.ts` - Express app entry point
- `src/config/firebaseAdmin.ts` - Firebase Admin SDK initialization
- `src/middleware/authMiddleware.ts` - JWT verification middleware
- `src/routes/` - Express routes (posts.routes.ts, users.routes.ts, chat.routes.ts)
- `src/controllers/` - Business logic for each route domain
- `src/services/` - Abstract layers for Firestore and Storage operations

### Configuration Files
- `frontend/.env` - Firebase client SDK keys (safe for client-side)
- `backend/.env` - Server config (PORT, CORS_ORIGIN)
- `backend/firebase-service-account.json` - Firebase Admin SDK private key (**NEVER commit!**)

## Routing

### Public Routes
- `/` - Landing page with animations, featured products, CTA
- `/login`, `/signup` - Authentication pages
- `/item/:id` - Public product view with contact button

### Protected Routes (require authentication)
- `/profile` - User's own items, post new items, link to chat
- `/chat` - One-on-one messaging interface
- `/liked` - Saved/liked products
- `/following` - Feed of followed users' posts
- `/user/:id` - Public profile of another user

## Important Conventions

### Code Style
- Use **named exports** for components (not default exports)
- Use `function` declarations for React components, not `const`
- Use Zod for all form and API validation
- Use early returns for better readability
- Use semantic HTML and accessible JSX
- Use descriptive variable names: `hasLiked`, `isLoading`, `handleUpload`

### Tailwind CSS 4
- Use first-party `@tailwindcss/vite` plugin
- Utility-first classes for all styling (avoid custom CSS files)
- Mobile-first responsive design (`sm`, `md`, `lg`, `xl`, `2xl`)
- No PostCSS configuration needed

### Firebase Security
- **NEVER commit** `.env` files or `firebase-service-account.json`
- Frontend Firebase keys are Auth-only (security rules enforced on backend)
- All Firestore/Storage operations go through backend API
- Backend validates ownership before allowing updates/deletes

### API Communication
- All protected endpoints require `Authorization: Bearer <token>` header
- Backend validates JWT on every protected route
- Error responses follow consistent format (see docs/API.md)
- Health check endpoint at `/api/health` for Docker healthcheck

## Testing Workflow

When making changes:
1. **Frontend changes**: Run `npm run lint` in frontend/, test in browser at http://localhost:5173
2. **Backend changes**: Run `npm run lint` in backend/, test API with curl or Postman at http://localhost:5000
3. **Type changes**: Update in shared/, then rebuild both frontend and backend
4. **Docker**: Test full stack with `docker-compose up --build`

## Common Gotchas

1. **Shared types**: After modifying shared/, you may need to restart dev servers
2. **Firebase paths**: Defined in `shared/constants/firebasePaths.ts` - use these constants, don't hardcode
3. **Authentication**: Backend middleware attaches `req.user` (with uid) to all authenticated requests
4. **CORS**: Backend CORS configured in `src/config/cors.ts` - update if frontend URL changes
5. **Docker healthcheck**: Backend must respond to `/api/health` or Docker will restart container

## Brand Guidelines

### Typography
- **Headings**: Anton font (bold, geometric, for banners/CTAs)
- **Body text**: Gothic-style serif (EB Garamond, Cormorant Garamond for descriptions/instructions)

### Colors
- **Primary Red**: `#a61f1e` (passion, action, energy)
- **Secondary Blue**: `#a2c8ff` (freshness, balance, trust)
- **Background Black**: `#000000` (minimalism, sharpness, contrast)

### Tone
- Direct but friendly
- Confident and motivating
- Empathetic to community needs
- Modern rebel against overconsumption
- Brand manifesto: "Mi ne kupujemo stil. Mi ga stvaramo."
