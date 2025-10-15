# TRADEY – Detaljan Plan Implementacije

Ovaj dokument služi kao mapa puta za razvoj aplikacije TRADEY, progresivne web platforme za razmenu polovnih odevnih predmeta.
Zadaci su podeljeni po fazama kako bi razvoj tekao organizovano i postepeno.
**Na projektu rade Teodora (frontend/UI/UX) i Vukašin (backend/logika/povezivanje sa Firebase-om i Docker).**

---

## Faza 1: Temelji i Osnovna Funkcionalnost (MVP)

### A. Postavka Projekta (Završeno)

-   [x] Podešavanje projekta: Vite + React 19 + TypeScript
-   [x] Instalacija i konfiguracija: Tailwind CSS 4 (mobile-first pristup)
-   [x] Konfiguracija Firebase SDK (`src/firebase/config.ts`) za Auth, Firestore i Storage
-   [x] Instalacija i konfiguracija React Router-a
-   [x] Kreirana kompletna struktura direktorijuma (pages, components, hooks, store, firebase, ui)
-   [x] Definisane javne i zaštićene rute sa placeholder stranicama
-   [x] Postavljen `AuthWrapper` za zaštitu ruta i navigaciju ulogovanih korisnika

### B. Autentifikacija Korisnika

-   **[Vukašin]** Kreirati `useAuth` hook (`src/hooks/useAuth.ts`) koji koristi Firebase `onAuthStateChanged` za praćenje ulogovanog korisnika.
-   **[Vukašin]** Povezati `AuthWrapper` sa `useAuth` hook-om i Firestore dokumentima.
-   **[Teodora]** Dizajnirati i implementirati `LoginForm.tsx` komponentu (email + lozinka).
-   **[Vukašin]** Implementirati funkciju za prijavu (`signInWithEmailAndPassword`) i prikaz grešaka.
-   **[Teodora]** Kreirati `SignupForm.tsx` komponentu (validacija, error states).
-   **[Vukašin]** Implementirati registraciju (`createUserWithEmailAndPassword`) + Firestore `/users/{id}` dokument.
-   **[Zajedno]** Integrisati forme u `LoginPage.tsx` i `SignupPage.tsx`, povezati sa navigacijom.

### C. UI Kostur i Osnovne Komponente

-   **[Teodora]** Kreirati responzivnu `Header.tsx` komponentu (Login/Signup za goste; Profil/Poruke/Logout za ulogovane).
-   **[Teodora]** Napraviti `Footer.tsx` sa osnovnim kontakt informacijama i linkovima.
-   **[Zajedno]** Integrisati `Header` i `Footer` u `App.tsx` (vidljivi na svim rutama).
-   **[Teodora]** Kreirati re-upotrebljive UI komponente (`src/components/ui`):
    -   `Button.tsx` – osnovna dugmad
    -   `Input.tsx` – polja sa validacijom
    -   `Spinner.tsx` – indikator učitavanja
    -   `Toast.tsx` – sistem notifikacija

### D. Upravljanje Artiklima

-   **[Teodora]** Dizajnirati i implementirati formu `PostEditor.tsx` za dodavanje i izmenu artikala.
-   **[Vukašin]** Implementirati `ImageUploader.tsx` (upload do 5 slika u Firebase Storage, preview).
-   **[Vukašin]** Funkcija za dodavanje/ažuriranje artikala u Firestore `/posts` kolekciji.
-   **[Teodora]** Dizajnirati `ProductCard.tsx` za prikaz pojedinačnog artikla.
-   **[Teodora]** Prikaz liste korisnikovih artikala na `ProfilePage.tsx` (grid prikaz).
-   **[Vukašin]** Implementirati funkciju za brisanje artikla (Firestore + Storage reference).

---

## Faza 2: Društvene Funkcije i Interaktivnost

### A. Pregled Artikala i Korisnika

-   **[Teodora]** Kompletirati `ItemViewPage.tsx` (`/item/:id`) – prikaz svih detalja o artiklu (slike, opis, dugmad za like/chat).
-   **[Vukašin]** Implementirati `UserProfilePage.tsx` (`/user/:id`) – prikaz javnog profila i korisnikovih artikala.

### B. Lajkovanje i Praćenje

-   **[Teodora]** Dodati “Like” dugme na `ProductCard` i `ItemViewPage`.
-   **[Vukašin]** Funkcija za ažuriranje `likes` niza u korisnikovom dokumentu (Firestore `arrayUnion`/`arrayRemove`).
-   **[Teodora]** Kreirati `LikedPage.tsx` (`/liked`) – prikaz svih sačuvanih artikala.
-   **[Vukašin]** Dodati “Follow” dugme (FireStore `following` logika).
-   **[Teodora]** Napraviti `FollowingPage.tsx` (`/following`) – feed artikala praćenih korisnika.

### C. Chat u Realnom Vremenu

-   **[Teodora]** Dodati “Započni razmenu” dugme na `ItemViewPage`.
-   **[Vukašin]** Implementirati logiku za kreiranje i učitavanje Firestore chat dokumenata (`/chats/{chatId}`).
-   **[Teodora]** Dizajnirati `ChatPage.tsx` – lista razgovora.
-   **[Vukašin]** Implementirati `ChatBox.tsx` (unos i prikaz poruka u realnom vremenu, Firestore `onSnapshot`).

---

## Faza 3: Fino Podešavanje i V1

### A. Pretraga i Filtriranje

-   **[Teodora]** Napraviti `SearchBar.tsx` komponentu (frontend filtriranje artikala).
-   **[Vukašin]** Omogućiti pretragu po nazivu i opisu artikla iz Firestore-a.
-   **[Teodora]** (Opciono) Filtriranje po tagovima na osnovu kolekcije.

### B. Poboljšanje UI/UX

-   **[Vukašin]** Implementirati globalni sistem za notifikacije (`Toast`, `Snackbar`).
-   **[Teodora]** Dodati indikatore učitavanja (`Spinner`, `Skeleton`).
-   **[Teodora]** Finalizovati validaciju formi (Zod/Yup).
-   **[Teodora]** Dodati mikroanimacije i tranzicije (Framer Motion, Tailwind transition).

### C. Optimizacija i Deploy

-   **[Vukašin]** Kompresija i lazy loading slika pre upload-a (`browser-image-compression`).
-   **[Teodora]** Testirati pristupačnost (kontrast, tastatura, fokus state).
-   **[Vukašin]** Deploy aplikacije:
    -   Frontend – Vercel
    -   Backend/Express proxy – Render
    -   Baza – Firebase
-   **[Zajedno]** Finalno testiranje i dokumentovanje.

---

## Faza 4: Docker i Dokumentacija

### A. Docker (Zadatak 2)

-   **[Vukašin]** Napisati `Dockerfile` za frontend (React build + serve).
-   **[Vukašin]** Napisati `Dockerfile` za backend (Express + Firebase Admin SDK).
-   **[Teodora]** Kreirati `docker-compose.yaml` (servisi, mreže, portovi, volumeni, restart policy).
-   **[Teodora]** Testirati pokretanje `docker-compose up`.
-   **[Zajedno]** Screenshot svih komandi i pokrenutih kontejnera.

### B. Bonus Opcije za Višu Ocenu

-   Dodati `.dockerignore` fajlove.
-   Definisati `healthcheck` rutu za backend (`GET /health`).
-   Dodati `named volume` za uploads (bind mount).
-   Exportovati `firestore_data.json` (test podaci).
-   Postaviti sve na GitHub i povezati u dokumentaciju.
