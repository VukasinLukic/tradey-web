TRADEY/
│
├── README.md                      # opis projekta i komande pokretanja
├── docker-compose.yaml             # frontend + backend servisi
├── firestore_data.json             # eksport Firestore baze
├── .gitignore                      # ignoriši node_modules, .env, dist itd.
├── .env.example                    # primer environment varijabli (bez tajnih podataka)
│
├── shared/                         # zajednički kod između frontenda i backenda
│   ├── types/
│   │   ├── user.types.ts           # UserProfile, UserRole
│   │   ├── post.types.ts           # Post, ClothingCondition
│   │   ├── chat.types.ts           # Chat, Message
│   │   └── index.ts                # centralni export svih tipova
│   └── constants/
│       ├── firebasePaths.ts        # putanje kolekcija u Firestore
│       └── validationSchemas.ts    # Zod šeme za validaciju (koriste ih frontend i backend)
│
├── frontend/                       # tvoj trenutni vibe-hakaton projekat (React + Firebase)
│   ├── Dockerfile
│   ├── .dockerignore               # ignoriši node_modules, dist pri Docker build-u
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── .env                        # lokalne env varijable (dodati u .gitignore)
│   ├── public/
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── index.css
│       ├── services/
│       │   └── api.ts              # centralizovan API client (axios) za komunikaciju sa backendom
│       ├── firebase/
│       │   ├── config.ts           # Firebase client config (samo Auth)
│       │   └── auth.ts             # helper funkcije za Auth
│       ├── components/
│       │   ├── auth/
│       │   │   ├── LoginForm.tsx
│       │   │   └── SignupForm.tsx
│       │   ├── chat/
│       │   │   └── ChatBox.tsx
│       │   ├── post/
│       │   │   ├── PostCard.tsx
│       │   │   ├── PostEditor.tsx
│       │   │   ├── ProductCard.tsx
│       │   │   └── ImageUploader.tsx
│       │   ├── layout/
│       │   │   ├── Header.tsx
│       │   │   ├── Footer.tsx
│       │   │   └── AuthWrapper.tsx
│       │   └── ui/
│       │       ├── Button.tsx
│       │       ├── Input.tsx
│       │       ├── Spinner.tsx
│       │       ├── Toast.tsx
│       │       └── Modal.tsx
│       ├── pages/
│       │   ├── Index.tsx
│       │   ├── Login.tsx
│       │   ├── Signup.tsx
│       │   ├── Profile.tsx
│       │   ├── ItemView.tsx
│       │   ├── Chat.tsx
│       │   ├── Liked.tsx
│       │   ├── Following.tsx
│       │   └── UserProfile.tsx
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   ├── usePost.ts
│       │   ├── useUserPosts.ts
│       │   └── useUserProfile.ts
│       ├── store/
│       │   ├── authStore.ts
│       │   └── uiStore.ts
│       ├── routes/
│       │   └── AppRoutes.tsx
│       ├── types/                  # lokalni frontend tipovi (ako je potrebno)
│       │   └── index.ts
│       ├── utils/
│       │   └── helpers.ts
│       └── constants/
│           └── locations.ts
│
├── backend/                        # novi Node.js + Express server
│   ├── Dockerfile
│   ├── .dockerignore               # ignoriši node_modules, dist pri Docker build-u
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                        # FIREBASE_ADMIN_KEY_PATH, PORT, CORS_ORIGIN itd.
│   ├── firebase-service-account.json  # Firebase Admin SDK credentials (dodati u .gitignore!)
│   └── src/
│       ├── server.ts               # entry point (Express app setup, middleware, routing)
│       ├── config/
│       │   ├── firebaseAdmin.ts    # inicijalizacija Firebase Admin SDK
│       │   └── cors.ts             # CORS konfiguracija
│       ├── routes/
│       │   ├── index.ts            # glavni router (kombinuje sve rute)
│       │   ├── health.ts           # GET /health za Docker healthcheck
│       │   ├── posts.routes.ts     # rute za objave (GET, POST, PUT, DELETE)
│       │   ├── users.routes.ts     # rute za korisnike (GET, PUT)
│       │   └── chat.routes.ts      # rute za chat (GET, POST)
│       ├── controllers/
│       │   ├── postController.ts   # logika za CRUD operacije nad postovima
│       │   ├── userController.ts   # logika za profile i follow/unfollow
│       │   └── chatController.ts   # logika za poruke i liste chatova
│       ├── middleware/
│       │   ├── authMiddleware.ts   # verifikacija Firebase JWT tokena
│       │   ├── errorHandler.ts     # centralizovano rukovanje greškama
│       │   └── rateLimiter.ts      # rate limiting za zaštitu API-ja
│       ├── services/
│       │   ├── firestore.service.ts # abstraktni layer za Firestore operacije
│       │   └── storage.service.ts   # abstraktni layer za Firebase Storage
│       └── utils/
│           ├── response.ts         # helper funkcije za API odgovore
│           └── validator.ts        # Zod validacija na backend strani
│
└── docs/                           # dokumentacija za predaju (seminarski + docker faza)
    ├── TRADEY_Dokumentacija.docx   # glavni dokument
    ├── API.md                      # dokumentacija svih API endpointa
    ├── screenshots/
    │   ├── docker_build.png
    │   ├── docker_ps.png
    │   ├── compose_up.png
    │   ├── app_running.png
    │   ├── api_posts.png
    │   ├── frontend_landing.png
    │   └── frontend_profile.png
    └── plan_razvoja.txt

NAPOMENE:
---------
1. **shared/ folder** omogućava da frontend i backend koriste iste tipove i konstante.
   - U package.json oba projekta, dodati: "shared": "file:../shared"
   - Importovati tipove: import { Post, UserProfile } from 'shared/types';

2. **services/ folder na frontendu** sadrži api.ts koji centralizuje sve HTTP pozive ka backendu.
   - Koristi axios ili fetch
   - Automatski dodaje Authorization header sa Firebase JWT-om

3. **services/ folder na backendu** sadrži abstraktne layere za Firebase operacije.
   - firestore.service.ts: reusable funkcije za rad sa Firestore-om
   - storage.service.ts: reusable funkcije za Firebase Storage

4. **.dockerignore fajlovi** su kritični za optimizaciju Docker build vremena.
   - Ignoriši: node_modules/, dist/, .git/, .env, *.log

5. **firebase-service-account.json** je privatni ključ i MORA biti u .gitignore!
   - Preuzeti sa Firebase Console > Project Settings > Service Accounts

6. **healthcheck ruta** (GET /api/health) je neophodna za Docker compose healthcheck direktive.
