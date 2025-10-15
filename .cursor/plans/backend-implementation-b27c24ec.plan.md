<!-- b27c24ec-56f4-4ab7-8591-515fa0e5ad09 18745148-2efa-4767-94b0-ccd61c05926c -->
# TRADEY Backend Implementation - Complete Plan

## Phase 1: Project Restructuring & Security 🔒

### 1.1 Reorganize to Monorepo Structure

**Current issue:** Everything is in root, Firebase credentials exposed

**Action:**

- Move all current files to `/frontend` folder
- Create `/backend`, `/shared`, `/docs` folders per `struktura_projekta.md`
- Update all import paths in frontend (TypeScript will help catch these)

**Files to move:**

```
src/ → frontend/src/
public/ → frontend/public/
vite.config.ts, tsconfig.json, package.json → frontend/
index.html → frontend/
```

### 1.2 Fix Firebase Security (CRITICAL - Do First!)

**Current issue:** API keys exposed in `src/firebase/config.ts`

**Action:**

1. **Rotate Firebase API keys** in Firebase Console (Project Settings > General)
2. Create `frontend/.env`:
   ```
   VITE_FIREBASE_API_KEY=your_new_key
   VITE_FIREBASE_AUTH_DOMAIN=vibe-hakaton.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=vibe-hakaton
   VITE_FIREBASE_STORAGE_BUCKET=vibe-hakaton.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=225908111904
   VITE_FIREBASE_APP_ID=1:225908111904:web:36ffedcbbdfd2ed0b85a45
   ```

3. Update `frontend/src/firebase/config.ts` to use `import.meta.env.VITE_*`
4. Add `frontend/.env` to `.gitignore`
5. Create `frontend/.env.example` for documentation

### 1.3 Create Shared Types Package

**Location:** `/shared`

**Files to create:**

```typescript
// shared/types/user.types.ts
export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl?: string;
  bio?: string;
  following?: string[];
  likedPosts?: string[];
  createdAt: Date;
  role?: 'user' | 'admin';
}

// shared/types/post.types.ts
export const ClothingConditions = { /* same as entities.ts */ };
export type ClothingCondition = keyof typeof ClothingConditions;
export interface Post { /* from entities.ts */ }

// shared/types/chat.types.ts
export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: Date;
  readBy: string[];
}

// shared/constants/firebasePaths.ts
export const COLLECTIONS = {
  USERS: 'users',
  POSTS: 'posts',
  CHATS: 'chats',
  MESSAGES: 'messages',
  REPORTS: 'reports'
};

// shared/constants/validationSchemas.ts (Zod)
import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  brand: z.string().min(1),
  condition: z.enum(['NEW', 'MINT', 'VERY_GOOD', 'GOOD', 'FAIR']),
  size: z.string(),
  tradePreferences: z.string().optional(),
  images: z.array(z.string()).min(1).max(5)
});
// Add more schemas for other operations
```

**Setup:**

- Create `shared/package.json` with just TypeScript + Zod dependencies
- Both frontend and backend will link to this: `"shared": "file:../shared"`

---

## Phase 2: Backend Foundation 🏗️

### 2.1 Initialize Backend Project

**Location:** `/backend`

```bash
cd backend
npm init -y
npm install express cors dotenv firebase-admin multer express-rate-limit
npm install -D typescript @types/express @types/cors @types/node @types/multer ts-node nodemon
```

**Create `backend/tsconfig.json`:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**Create `backend/package.json` scripts:**

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### 2.2 Firebase Admin SDK Setup

**Action:** Download service account key from Firebase Console

**Create `backend/.env`:**

```
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=vibe-hakaton
FIREBASE_ADMIN_KEY_PATH=./firebase-service-account.json
CORS_ORIGIN=http://localhost:5173
```

**Create `backend/src/config/firebaseAdmin.ts`:**

```typescript
import admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

const serviceAccount = require(`../../${process.env.FIREBASE_ADMIN_KEY_PATH}`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`
});

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage().bucket();
export default admin;
```

### 2.3 Core Middleware

**`backend/src/middleware/authMiddleware.ts`:**

```typescript
import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebaseAdmin';

export interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split('Bearer ')[1];
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

**`backend/src/middleware/errorHandler.ts`:**

```typescript
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
};
```

**`backend/src/middleware/rateLimiter.ts`:**

```typescript
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});
```

---

## Phase 3: Backend Services & Controllers 🚀

### 3.1 Storage Service

**`backend/src/services/storage.service.ts`:**

```typescript
import { storage } from '../config/firebaseAdmin';
import { v4 as uuidv4 } from 'uuid';

export class StorageService {
  async uploadImage(file: Express.Multer.File, userId: string): Promise<string> {
    const fileName = `posts/${userId}/${Date.now()}-${uuidv4()}.${file.mimetype.split('/')[1]}`;
    const fileUpload = storage.file(fileName);
    
    await fileUpload.save(file.buffer, {
      metadata: { contentType: file.mimetype }
    });
    
    await fileUpload.makePublic();
    return `https://storage.googleapis.com/${storage.name}/${fileName}`;
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const fileName = imageUrl.split(`${storage.name}/`)[1];
    await storage.file(fileName).delete();
  }
}
```

### 3.2 Firestore Service

**`backend/src/services/firestore.service.ts`:**

```typescript
import { db } from '../config/firebaseAdmin';
import { COLLECTIONS } from 'shared/constants/firebasePaths';

export class FirestoreService {
  async getDocument(collection: string, id: string) {
    const doc = await db.collection(collection).doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  async queryDocuments(collection: string, filters: any[], orderBy?: any, limit?: number) {
    let query: any = db.collection(collection);
    
    filters.forEach(([field, op, value]) => {
      query = query.where(field, op, value);
    });
    
    if (orderBy) query = query.orderBy(orderBy.field, orderBy.direction);
    if (limit) query = query.limit(limit);
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  // Add more generic methods: createDocument, updateDocument, deleteDocument, etc.
}
```

### 3.3 Post Controller (Full CRUD)

**`backend/src/controllers/postController.ts`:**

```typescript
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { db } from '../config/firebaseAdmin';
import { createPostSchema } from 'shared/constants/validationSchemas';
import { StorageService } from '../services/storage.service';

const storageService = new StorageService();

export class PostController {
  // GET /api/posts - List posts with filters
  async getPosts(req: AuthRequest, res: Response) {
    try {
      const { q, tag, creator, limit = 20 } = req.query;
      let query = db.collection('posts').orderBy('createdAt', 'desc');
      
      if (creator) query = query.where('authorId', '==', creator);
      // Add more filters
      
      const snapshot = await query.limit(Number(limit)).get();
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  }

  // GET /api/posts/:id
  async getPost(req: AuthRequest, res: Response) {
    try {
      const doc = await db.collection('posts').doc(req.params.id).get();
      if (!doc.exists) return res.status(404).json({ error: 'Post not found' });
      res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch post' });
    }
  }

  // POST /api/posts - Create post (with images)
  async createPost(req: AuthRequest, res: Response) {
    try {
      const validation = createPostSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ errors: validation.error.errors });
      }

      const userId = req.user!.uid;
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();

      const newPost = {
        ...validation.data,
        authorId: userId,
        authorUsername: userData?.username,
        authorLocation: userData?.location,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isAvailable: true
      };

      const docRef = await db.collection('posts').add(newPost);
      res.status(201).json({ id: docRef.id, ...newPost });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create post' });
    }
  }

  // PUT /api/posts/:id
  async updatePost(req: AuthRequest, res: Response) {
    // Authorization check + update logic
  }

  // DELETE /api/posts/:id
  async deletePost(req: AuthRequest, res: Response) {
    // Authorization check + delete images + delete document
  }

  // POST /api/posts/:id/like
  async toggleLike(req: AuthRequest, res: Response) {
    const userId = req.user!.uid;
    const postId = req.params.id;
    
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const likedPosts = userDoc.data()?.likedPosts || [];
    
    if (likedPosts.includes(postId)) {
      await userRef.update({
        likedPosts: admin.firestore.FieldValue.arrayRemove(postId)
      });
      res.json({ liked: false });
    } else {
      await userRef.update({
        likedPosts: admin.firestore.FieldValue.arrayUnion(postId)
      });
      res.json({ liked: true });
    }
  }
}
```

### 3.4 User Controller

**`backend/src/controllers/userController.ts`:**

```typescript
// GET /api/users/:id - Get user profile
// PUT /api/users/:id - Update profile (owner only)
// POST /api/users/:id/follow - Follow/unfollow user
```

### 3.5 Chat Controller

**`backend/src/controllers/chatController.ts`:**

```typescript
// GET /api/chats - Get user's chats
// GET /api/chats/:chatId/messages - Get messages (paginated)
// POST /api/chats/:chatId/messages - Send message
// POST /api/chats - Create new chat
```

---

## Phase 4: API Routes Setup 🛣️

### 4.1 Route Files

**`backend/src/routes/health.ts`:**

```typescript
import { Router } from 'express';
const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;
```

**`backend/src/routes/posts.routes.ts`:**

```typescript
import { Router } from 'express';
import { PostController } from '../controllers/postController';
import { authenticate } from '../middleware/authMiddleware';
import multer from 'multer';

const router = Router();
const postController = new PostController();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.post('/', authenticate, upload.array('images', 5), postController.createPost);
router.put('/:id', authenticate, postController.updatePost);
router.delete('/:id', authenticate, postController.deletePost);
router.post('/:id/like', authenticate, postController.toggleLike);

export default router;
```

**Similar structure for `users.routes.ts` and `chat.routes.ts`**

### 4.2 Main Router

**`backend/src/routes/index.ts`:**

```typescript
import { Router } from 'express';
import healthRouter from './health';
import postsRouter from './posts.routes';
import usersRouter from './users.routes';
import chatRouter from './chat.routes';

const router = Router();

router.use('/', healthRouter);
router.use('/posts', postsRouter);
router.use('/users', usersRouter);
router.use('/chats', chatRouter);

export default router;
```

### 4.3 Server Entry Point

**`backend/src/server.ts`:**

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use('/api', apiLimiter, routes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
```

---

## Phase 5: Frontend API Integration 🔗

### 5.1 Create API Service Layer

**`frontend/src/services/api.ts`:**

```typescript
import axios from 'axios';
import { auth } from '../firebase/config';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically add Firebase JWT to all requests
apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Posts API
export const postsApi = {
  getAll: (params?: any) => apiClient.get('/posts', { params }),
  getById: (id: string) => apiClient.get(`/posts/${id}`),
  create: (data: any) => apiClient.post('/posts', data),
  update: (id: string, data: any) => apiClient.put(`/posts/${id}`, data),
  delete: (id: string) => apiClient.delete(`/posts/${id}`),
  toggleLike: (id: string) => apiClient.post(`/posts/${id}/like`),
};

// Users API
export const usersApi = {
  getById: (id: string) => apiClient.get(`/users/${id}`),
  update: (id: string, data: any) => apiClient.put(`/users/${id}`, data),
  follow: (id: string) => apiClient.post(`/users/${id}/follow`),
};

// Chat API
export const chatApi = {
  getChats: () => apiClient.get('/chats'),
  getMessages: (chatId: string, params?: any) => apiClient.get(`/chats/${chatId}/messages`, { params }),
  sendMessage: (chatId: string, text: string) => apiClient.post(`/chats/${chatId}/messages`, { text }),
  createChat: (participantId: string) => apiClient.post('/chats', { participantId }),
};

export default apiClient;
```

**Note for Teodora:** She'll update hooks to use this API service instead of direct Firestore calls

---

## Phase 6: Docker Setup 🐳

### 6.1 Backend Dockerfile

**`backend/Dockerfile`:**

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY firebase-service-account.json ./
EXPOSE 5000
CMD ["npm", "start"]
```

**`backend/.dockerignore`:**

```
node_modules
dist
.env
.git
*.log
*.md
```

### 6.2 Frontend Dockerfile

**`frontend/Dockerfile`:**

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

**`frontend/.dockerignore`:**

```
node_modules
dist
.env
.git
*.log
```

### 6.3 Docker Compose

**Root `docker-compose.yaml`:**

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    env_file:
      - ./backend/.env
    volumes:
      - ./backend:/app
      - /app/node_modules
    networks:
      - tradey-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    env_file:
      - ./frontend/.env
    depends_on:
      - backend
    networks:
      - tradey-network
    restart: unless-stopped

networks:
  tradey-network:
    driver: bridge
```

---

## Phase 7: Testing & Documentation 📝

### 7.1 Test Backend Endpoints

```bash
# Start backend
cd backend && npm run dev

# Test endpoints
curl http://localhost:5000/api/health
curl http://localhost:5000/api/posts
```

### 7.2 Update .gitignore

```
# Root .gitignore
node_modules/
dist/
*.log
.env
.DS_Store

# Firebase credentials
**/firebase-service-account.json

# IDE
.vscode/
.idea/
```

### 7.3 Create .env.example files

**`backend/.env.example`:**

```
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_ADMIN_KEY_PATH=./firebase-service-account.json
CORS_ORIGIN=http://localhost:5173
```

**`frontend/.env.example`:**

```
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
# ... etc
```

### 7.4 API Documentation

**Create `docs/API.md`** with all endpoint documentation (OpenAPI/Swagger style)

---

## Critical Path for Today ⚡

**Priority Order:**

1. ✅ Rotate Firebase keys & create .env files (15 min)
2. ✅ Restructure to monorepo (30 min)
3. ✅ Create shared types (30 min)
4. ✅ Backend setup + Firebase Admin (1 hour)
5. ✅ Post controller & routes (2 hours)
6. ✅ User controller & follow/like (1 hour)
7. ✅ Chat controller & routes (2 hours)
8. ✅ Frontend API service layer (1 hour)
9. ✅ Docker setup (1 hour)
10. ✅ Testing & fixes (1 hour)

**Total: ~10 hours** - doable if focused!

**Handoff to Teodora:**

- She updates hooks to use `src/services/api.ts` instead of direct Firebase
- No merge conflicts since you're only creating new backend files

### To-dos

- [ ] Rotate Firebase API keys and create .env files for frontend and backend with proper security
- [ ] Reorganize project into /frontend, /backend, /shared, /docs structure
- [ ] Create shared types package with user, post, and chat types + Zod validation schemas
- [ ] Initialize backend project with Express, TypeScript, Firebase Admin SDK, and core middleware
- [ ] Implement Firestore and Storage service layers for database and file operations
- [ ] Build complete Post API (CRUD + like) with controller, routes, and validation
- [ ] Build User API (profile, update, follow/unfollow) with authorization
- [ ] Build Chat API (list chats, messages, send message) with real-time support
- [ ] Create centralized API service layer (src/services/api.ts) with automatic JWT injection
- [ ] Create Dockerfiles, docker-compose.yaml, and .dockerignore files for both services
- [ ] Test all endpoints, create API documentation, and prepare .env.example files