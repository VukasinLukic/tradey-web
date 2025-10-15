<!-- 868938b5-1efd-4791-b1ad-78cc7e180a82 737c9dda-0a37-4d74-aafa-0b26ecd6d2f0 -->
# Finalni Plan Implementacije: TRADEY

Ovaj dokument predstavlja detaljan plan za završetak razvoja aplikacije TRADEY. Plan je zasnovan na analizi postojećeg koda i strateških dokumenata (`implementationplan.md`, `masterplan.md`) i podeljen je u logičke faze sa jasno definisanim zaduženjima.

---

### Analiza Trenutnog Stanja (Šta je urađeno)

-   **Frontend (React/Vite/TS):** Aplikacija ima solidnu osnovu.
    -   **Završeno:** Kompletna postavka projekta, ruting, autentifikacija (`Login`/`Signup`), UI kostur (`Header`/`Footer`), set UI komponenti, i puna funkcionalnost za kreiranje/pregled objava (`PostEditor`, `ProfilePage`, `ItemViewPage`).
    -   **Status:** Funkcionalni MVP bez direktne interakcije između korisnika.

-   **Backend (Firebase):** Trenutna arhitektura se oslanja na direktnu komunikaciju klijenta sa Firebase servisima (Auth, Firestore, Storage).

---

### Faza 1: Razvoj Node.js Backenda i API Sloja

**Cilj:** Kreirati robustan backend koji će služiti kao posrednik između klijenta i Firebase-a, omogućavajući bolju validaciju, sigurnost i skalabilnost.

-   **Zadužen:** Vukašin

1.  **Inicijalizacija Backend Projekta:**

    -   Kreirati novi direktorijum `backend` u root-u projekta.
    -   Postaviti Node.js + Express projekat sa TypeScript-om.
    -   Strukturirati foldere: `src/routes`, `src/controllers`, `src/middleware`.

2.  **Povezivanje sa Firebase Admin SDK:**

    -   Implementirati `backend/src/firebaseAdmin.ts` za sigurnu konekciju sa Firebase servisima sa servera.

3.  **Implementacija Autentifikacije i API Ruta:**

    -   Kreirati `authMiddleware.ts` koje će verifikovati Firebase Auth JWT tokene poslate sa frontenda.
    -   Razviti REST API rute prema specifikaciji iz `masterplan.md`:
        -   `GET /api/posts`, `GET /api/posts/:id`
        -   `GET /api/users/:id`
        -   (Zaštićene) `POST /api/posts`, `PUT /api/posts/:id`, `DELETE /api/posts/:id`

---

### Faza 2: Refaktorisanje Frontenda

**Cilj:** Preusmeriti postojeću frontend logiku da komunicira sa novim backend API-jem umesto direktno sa Firebase-om.

-   **Zaduženi:** Vukašin (logika), Teodora (UI/UX)

1.  **Kreiranje API Servisa na Frontendu:**

    -   **Vukašin:** Napraviti centralizovani servis (npr. `src/services/api.ts`) sa funkcijama za pozivanje novih backend endpointa (koristeći `axios` ili `fetch`).

2.  **Ažuriranje Hook-ova i Komponenti:**

    -   **Vukašin:** Izmeniti postojeće hook-ove (`useUserPosts`, `usePost`, `useUserProfile`) da koriste novi API servis umesto direktnih `getDoc`, `getDocs` poziva.
    -   **Vukašin:** Refaktorisati logiku u `PostEditor.tsx` i `storageService.ts` tako da upload slika i kreiranje objava idu preko backenda.
    -   **Teodora:** Ažurirati `Index.tsx` da prikazuje istaknute proizvode sa `GET /api/posts` umesto mock podataka.
    -   **Teodora:** Osigurati da svi `Spinner` i `Toast` indikatori pravilno rade sa novim asinhronim pozivima.

---

### Faza 3: Implementacija Društvenih Funkcija

**Cilj:** Dodati ključne socijalne interakcije koje čine jezgro TRADEY platforme.

-   **Zaduženi:** Vukašin (backend), Teodora (frontend)

1.  **Lajkovanje i Praćenje:**

    -   **Vukašin:** Implementirati backend rute: `POST /api/posts/:id/like` i `POST /api/users/:id/follow`.
    -   **Teodora:** Na `ProductCard.tsx` i `ItemViewPage.tsx` dodati "Like" dugme i povezati ga sa novom API rutom.
    -   **Teodora:** Na `UserProfilePage.tsx` dodati "Follow" dugme.
    -   **Zajedno:** Implementirati `LikedPage.tsx` i `FollowingPage.tsx` za prikaz podataka sa odgovarajućih API ruta.

2.  **Chat u Realnom Vremenu:**

    -   **Vukašin:** Implementirati backend rute za chat: `GET /api/chats`, `GET /api/chats/:id/messages`, `POST /api/chats/:id/messages`. Za real-time komponentu, razmotriti WebSockets ili omogućiti klijentu da i dalje direktno sluša Firestore `onSnapshot` nakon inicijalizacije chata preko API-ja.
    -   **Teodora:** Dizajnirati kompletan UI za `ChatPage.tsx` (lista razgovora) i `ChatBox.tsx` (prikaz poruka i polje za unos).
    -   **Zajedno:** Povezati "Započni razmenu" dugme na `ItemViewPage.tsx` sa logikom za kreiranje/otvaranje chata.

---

### Faza 4: Dokerizacija i Finalizacija

**Cilj:** Pripremiti aplikaciju za jednostavno pokretanje u bilo kom okruženju koristeći Docker.

-   **Zaduženi:** Vukašin, Teodora

1.  **Kreiranje Docker Fajlova:**

    -   **Vukašin:** Napisati `backend/Dockerfile` za Node.js aplikaciju.
    -   **Vukašin:** Napisati `frontend/Dockerfile` za React aplikaciju (multi-stage build).
    -   **Zajedno:** Dodati `.dockerignore` fajlove u oba direktorijuma.

2.  **Orkestracija sa Docker Compose:**

    -   **Teodora:** Kreirati `docker-compose.yaml` u root direktorijumu.
    -   Definisati `frontend` i `backend` servise, povezati ih preko custom mreže, podesiti portove, volumene za razvoj (bind mounts) i `restart policy`.

3.  **Finalno Testiranje i Dokumentacija:**

    -   **Zajedno:** Testirati kompletan flow aplikacije pokrenute preko `docker-compose up`.
    -   **Zajedno:** Pripremiti finalnu dokumentaciju, uključujući screenshot-ove Docker komandi i uputstvo za pokretanje.