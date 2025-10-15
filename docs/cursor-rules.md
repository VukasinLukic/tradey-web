You are an expert in full-stack web development using the MERN stack (React/Node/Express) with TypeScript, Firebase, Docker, and accessible, mobile-first design patterns.

## Project Overview

-   This project is a progressive web app called "Tradey", a second-hand clothing trading platform.
-   The stack includes:
    -   **Frontend:** React 19, Vite, Tailwind CSS 4, React Router.
    -   **Backend:** Node.js, Express, TypeScript.
    -   **Database & Services:** Firebase (Authentication, Firestore, Storage).
    -   **Containerization:** Docker and Docker Compose.
-   The app features user authentication, item posting, real-time chat, user following, and item liking, all facilitated through a central backend API.

## Tailwind CSS 4 Integration (with Vite)

-   Use the first-party Vite plugin for Tailwind.
-   Use utility-first classes for all styling.
-   Avoid writing custom CSS files or PostCSS configuration.
-   Follow mobile-first responsive patterns using Tailwind breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`).
-   Use Tailwind transitions and animations for interactivity.

## Routing and Access Logic

-   Use React Router for frontend navigation.
-   **Public routes:**
    -   `/` → Landing page (animations, overview, CTA buttons, featured products)
    -   `/login` and `/signup`
    -   `/item/:id` → View product in full screen, with contact button
-   **Protected routes (require authentication):**
    -   `/profile` → Shows user items, link to post new items, and link to chat
    -   `/chat` → One-on-one chat interface
    -   `/liked` → Saved/liked products
    -   `/following` → Feed of followed users’ posts
    -   `/user/:id` → Public profile of another user

## Architecture and Data Flow

### Authentication

-   **Frontend:** Use the Firebase client-side SDK for user sign-up and sign-in (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`).
-   Upon successful login, retrieve the JWT (ID Token) from the user object.
-   **API Communication:** Include this JWT in the `Authorization` header (`Bearer <token>`) for all requests to the protected backend API endpoints.
-   **Backend:** Create an authentication middleware (`authMiddleware.ts`) that uses the Firebase Admin SDK to verify the incoming JWT. This middleware will protect all sensitive routes.
-   User profile metadata is stored in Firestore under the `/users` collection.

### Data Operations (Posting, Liking, Following)

-   **All data mutations must go through the backend API.** The frontend should not write directly to Firestore or Storage.
-   **Posting Items:** The frontend sends a request to `POST /api/posts`. The backend validates the data, uploads images to Firebase Storage, and creates a new document in the `/posts` collection in Firestore.
-   **Liking/Following:** The frontend sends requests to endpoints like `POST /api/posts/:id/like`. The backend handles the logic of updating the relevant arrays in Firestore documents.
-   **Data Fetching:** All data (posts, user profiles, etc.) is fetched from the backend via `GET` requests (e.g., `GET /api/posts`).

## Folder Structure

The project is a monorepo with distinct `frontend` and `backend` applications.

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

## Firebase Usage

-   **Frontend:** Use the modular client SDK primarily for **Authentication**.
-   **Backend:** Use the **Firebase Admin SDK** for all other operations:
    -   Verifying user tokens.
    -   Reading from and writing to Firestore.
    -   Uploading files to and deleting files from Storage.
-   Enforce strict Firebase Security Rules as a second layer of defense, but the primary validation and authorization layer is the backend API.
-   Compress and optimize images on the client before uploading.

## General Conventions

-   Use named exports for components.
-   Use `function` for components, not `const`.
-   Use Zod for form and API validation.
-   Use early returns for readability.
-   Write accessible JSX with semantic HTML.
-   Use descriptive variables: `hasLiked`, `isLoading`, `handleUpload`.

## Development Expectations

-   Code must be DRY, readable, and fully complete — no placeholders.
-   All components should be accessible and mobile-friendly.
-   Write only finished components — no `// todo` or scaffolding.
-   Always include proper imports and follow directory conventions.
-   Ensure all flows work from unauthenticated to authenticated state seamlessly.

---

TRADEY sa vizuelnim smernicama. Evo finalne verzije za tekstualni fajl, uključujući i:

Definisane fontove (naslovni i tekstualni)

Definisanu primarnu paletu boja

Savet za primenu u digitalnim materijalima i UI

TRADEY – Brand Identitet
(za .txt fajl ili Brand Book osnovu)

1. Core Brand Attributes
Disruptivan

Svestan i održiv

Urbano-minimalistički

Samouveren, direktan

Zajednički i otvoren

2. Tone of Voice
Direktan, ali prijateljski

Samouveren i motivišući

Empatičan prema potrebama zajednice

Moderan buntovnik protiv prekomerne potrošnje

3. Arhetipovi
Revolucionar (Outlaw)

Prijatelj (Everyman)

4. Emocionalni Ankori
Sloboda

Pripadnost

Osveženje

Odgovornost

Igra

5. Brand Manifesto
„Mi ne kupujemo stil. Mi ga stvaramo.“
TRADEY je više od aplikacije – to je pokret protiv zasićenosti, protiv bacanja, protiv uniformisanosti.
Ovde ne kupuješ da bi imao više – već menjaš da bi imao bolje.
Mi verujemo da je moda sloboda, a garderoba sredstvo izražavanja, ne konzumerizma.
U TRADEY svetu, tvoja stara jakna je nečija nova omiljena stvar.
Zato menjamo. Zajedno. Odvažno. Odgovorno. TRADEY.

6. Tipografija (Fonts)
Naslovni font: Anton

Debeo, geometrijski, odlučan. Idealan za bannere, CTA dugmiće, hero sekcije.

Tekstualni font: Neki mali gothic stil (preporuka: EB Garamond, UnifrakturCook, Cormorant Garamond – ili bilo koji stilizovan serif/gothic).

Koristiti za opise, uputstva, sitnije elemente (footer, FAQ, mikrocopy).

7. Boje (Brand Colors)
Element	Boja	HEX kod	Značenje
Primarna Crvena	Tamno crvena	#a61f1e	Strast, akcija, energija
Sekundarna Plava	Svetloplava	#a2c8ff	Svežina, balans, poverenje
Pozadinska Crna	Crna	#000000	Minimalizam, oštrina, kontrast

