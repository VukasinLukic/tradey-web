# Backend Implementation Checklist

## 🔐 PRIORITET 1: Bezbednost (ODMAH!)

- [ ] **Rotiraj Firebase API ključeve** u Firebase Console
  - Project Settings > General > Web Apps > Config
  - Generiši nove ključeve
  
- [ ] **Kreiraj `frontend/.env`** sa novim ključevima:
  ```
  VITE_FIREBASE_API_KEY=<new-key>
  VITE_FIREBASE_AUTH_DOMAIN=vibe-hakaton.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID=vibe-hakaton
  VITE_FIREBASE_STORAGE_BUCKET=vibe-hakaton.firebasestorage.app
  VITE_FIREBASE_MESSAGING_SENDER_ID=225908111904
  VITE_FIREBASE_APP_ID=<new-app-id>
  VITE_API_URL=http://localhost:5000/api
  ```

- [ ] **Preuzmi Firebase Service Account Key**
  - Firebase Console > Project Settings > Service Accounts
  - "Generate new private key"
  - Sačuvaj kao `backend/firebase-service-account.json`

- [ ] **Kreiraj `backend/.env`**:
  ```
  PORT=5000
  NODE_ENV=development
  FIREBASE_PROJECT_ID=vibe-hakaton
  FIREBASE_ADMIN_KEY_PATH=./firebase-service-account.json
  CORS_ORIGIN=http://localhost:5173
  ```

- [ ] **Ažuriraj `frontend/src/firebase/config.ts`** da koristi env varijable

## 🏗️ FAZA 1: Backend Setup

- [ ] `cd backend && npm install` - instaliraj zavisnosti
- [ ] Ažuriraj `frontend/package.json` - dodaj `"shared": "file:../shared"`
- [ ] `cd frontend && npm install` - instaliraj sa shared linkom
- [ ] `cd shared && npm install` - instaliraj shared zavisnosti

## 📝 FAZA 2: Backend Implementacija

### Config & Middleware
- [ ] `backend/src/config/firebaseAdmin.ts` - Firebase Admin init
- [ ] `backend/src/middleware/authMiddleware.ts` - JWT verifikacija
- [ ] `backend/src/middleware/errorHandler.ts` - Error handling
- [ ] `backend/src/middleware/rateLimiter.ts` - Rate limiting

### Services
- [ ] `backend/src/services/firestore.service.ts` - Firestore helper funkcije
- [ ] `backend/src/services/storage.service.ts` - Storage upload/delete

### Controllers & Routes
- [ ] **Health Check**
  - `backend/src/routes/health.ts` - GET /health

- [ ] **Posts API**
  - `backend/src/controllers/postController.ts`:
    - `getPosts()` - GET /posts
    - `getPost()` - GET /posts/:id
    - `createPost()` - POST /posts
    - `updatePost()` - PUT /posts/:id
    - `deletePost()` - DELETE /posts/:id
    - `toggleLike()` - POST /posts/:id/like
  - `backend/src/routes/posts.routes.ts`

- [ ] **Users API**
  - `backend/src/controllers/userController.ts`:
    - `getUser()` - GET /users/:id
    - `updateUser()` - PUT /users/:id
    - `toggleFollow()` - POST /users/:id/follow
  - `backend/src/routes/users.routes.ts`

- [ ] **Chat API**
  - `backend/src/controllers/chatController.ts`:
    - `getChats()` - GET /chats
    - `getMessages()` - GET /chats/:chatId/messages
    - `sendMessage()` - POST /chats/:chatId/messages
    - `createChat()` - POST /chats
  - `backend/src/routes/chat.routes.ts`

### Main Server
- [ ] `backend/src/routes/index.ts` - Glavni router
- [ ] `backend/src/server.ts` - Express server setup

## 🔗 FAZA 3: Frontend API Integration

- [ ] `frontend/src/services/api.ts` - Axios client sa JWT interceptor
- [ ] Napomena za Teodoru: Ažurirati hooks da koriste API service

## 🧪 FAZA 4: Testiranje

- [ ] `cd backend && npm run dev` - Pokreni backend
- [ ] Test: `curl http://localhost:5000/api/health`
- [ ] Test: `curl http://localhost:5000/api/posts`
- [ ] `cd frontend && npm run dev` - Pokreni frontend
- [ ] E2E test: Login → Create Post → View Post

## 🐳 FAZA 5: Docker

- [ ] Test build: `docker-compose build`
- [ ] Test run: `docker-compose up`
- [ ] Verify: http://localhost:3000 (frontend)
- [ ] Verify: http://localhost:5000/api/health (backend)
- [ ] Screenshots za dokumentaciju

## 📚 FAZA 6: Dokumentacija

- [ ] Popuni `docs/API.md` sa stvarnim primerima
- [ ] Screenshot terminal sa running serverima
- [ ] Screenshot Docker compose up
- [ ] Screenshot aplikacije u browseru

## ⏱️ Procena Vremena

- **Bezbednost & Setup**: 30 min
- **Backend Core (Config + Middleware)**: 1h
- **Posts API**: 2h
- **Users API**: 1h  
- **Chat API**: 2h
- **Frontend API Service**: 1h
- **Testing**: 1h
- **Docker**: 1h
- **Dokumentacija**: 30 min

**UKUPNO: ~10 sati** ✅

---

## 🚀 Kako Početi

1. Otvori terminal u `backend/` folderu
2. Uradi sve iz **PRIORITET 1**
3. Instaliraj zavisnosti
4. Kreni sa implementacijom redosledno
5. Testiraj svaki endpoint kad ga napraviš
6. Na kraju Docker i dokumentacija

**Srećno! 💪**

