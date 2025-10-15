# TRADEY – Masterplan (sa backendom i docker planom)

## App Overview and Objectives

TRADEY je veb aplikacija za razmenu polovnih odevnih predmeta između korisnika. Cilj je podsticanje održive mode kroz direktnu razmenu odeće bez novca, uz kvalitetno korisničko iskustvo i jasnu moderaciju sadržaja. Aplikacija omogućava objavljivanje artikala, privatnu komunikaciju (chat), praćenje korisnika i dogovaranje razmena.

**Fokus kursa:** aplikacija je implementirana tako da ispunjava zahteve za **Zadatak 2 – Docker** (kontejnerizacija svih servisa kroz terminal) i **Seminarski rad** (dokumentacija, implementacija i dokerizacija kompletne aplikacije).

---

## Target Audience

* Mladi 18–35 godina
* Ekološki i modno osvešćeni korisnici
* Entuzijasti thrifting/second-hand kulture
* Korisnici koji traže razmenu umesto kupovine

---

## Core Features and Functionality

1. **Autentikacija i profili**
   Registracija/prijava, uređivanje profila, avatar, bio, lokacija.
2. **Objave (postovi)**
   Naslov, opis, do 5 slika, veličina, stanje, brend, tagovi; status dostupnosti.
3. **Feed i pretraga**
   Globalni feed + feed praćenih; pretraga po naslovu/opisu/tagovima; filteri.
4. **Interakcije**
   Like/save, praćenje korisnika, prijava neprikladnog sadržaja (report).
5. **Chat**
   1-na-1 razgovor, poslednja poruka u listi chatova, notifikacija u UI-u.
6. **Admin/minimalna moderacija**
   Označavanje sumnjivih naloga/postova, skrivanje ili zaključavanje posta.
7. **Landing page**
   Istaknuti komadi, animacije, CTA; SEO meta tagovi.
8. **Responsive dizajn**
   Mobile-first, pristupačnost, tastaturna navigacija, alt tekstovi za slike.

---

## High‑Level Technical Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, React Router, Framer Motion
* **Backend:** Node.js + Express (TypeScript), REST API
* **Database:** Firebase Firestore (NoSQL)
* **Auth:** Firebase Authentication (email/lozinka)
* **Storage:** Firebase Storage (slike); kompresija u browseru
* **State Mgmt:** React state + Zustand (UI/toasts)
* **Validation:** Zod (na FE) + dodatne provere na BE
* **DevOps/Docker:** Docker, Docker Compose, .dockerignore, healthcheck, restart policy, bind‑mount za brzi razvoj
* **Cloud (bonus):** Vercel (FE), Render/Railway (BE)

**Napomena:** Zadržavamo postojeći FE (Vite/React/TS) i Firebase, uz dodavanje Express backenda kao stabilne API fasade (rate‑limiting, validacija, API ključevi, proxy ka Firebase-u po potrebi).

---

## Conceptual Data Model (Firestore)

* `/users/{userId}`: username, email, avatarUrl, bio, location, following[], likedPosts[], createdAt, role
* `/posts/{postId}`: title, description, images[], size, brand, condition, tags[], createdBy, createdAt, available
* `/chats/{chatId}`: participants[], lastMessage, updatedAt

  * `/chats/{chatId}/messages/{messageId}`: senderId, text, createdAt, readBy[]
* `/reports/{reportId}`: type, targetId, reason, createdBy, createdAt, status

---

## API Dizajn (Express, TS)

**Base URL:** `/api`

**Auth & User**

* `GET /health` – healthcheck
* `GET /users/:id` – profil korisnika
* `PUT /users/:id` – izmena profila (autorizovano)

**Posts**

* `GET /posts` – lista (query: `q`, `tag`, `creator`, `limit`, `cursor`)
* `GET /posts/:id` – detalji
* `POST /posts` – kreiranje (auth, validacija Zod)
* `PUT /posts/:id` – izmena (vlasnik/admin)
* `DELETE /posts/:id` – brisanje (vlasnik/admin)

**Interactions**

* `POST /posts/:id/like` – like/unlike
* `POST /users/:id/follow` – follow/unfollow
* `POST /reports` – prijava posta/korisnika

**Chat**

* `GET /chats` – moji chatovi (poslednje poruke)
* `GET /chats/:chatId/messages` – poruke (paginacija)
* `POST /chats/:chatId/messages` – slanje poruke

**Uploads**

* `POST /uploads/sign` – pre‑signed konfiguracija ili direktno prosleđivanje do Storage-a (po potrebi)

**Sigurnost**: JWT iz Firebase Auth‑a validiran na backendu; rate‑limit; CORS whitelist; input sanitizacija; audit log za sensitive rute.

---

## UI/UX Principi

* Utility‑first (Tailwind), jasno tipografsko skaliranje, sistem boja (teme)
* Mobile‑first raspored, grid kartice, lazy loading slika
* Pristupačnost: kontrast, `aria-*`, `focus-visible`, `skip links`
* Mikroanimacije (Framer Motion) – ulaz liste, hover states, page transitions

---

## Security Considerations

* **Firestore Rules**: granularni access po korisniku; write samo za vlasnike; moderator role
* **Auth Guard**: zaštićene rute (FE/BE), verifikovan email (opciono)
* **Validacija**: Zod šeme na FE + server‑side provere
* **Upload zaštita**: ograničenje veličine i tipa fajla; kompresija slika; putanje po userId
* **Rate limiting**: eksplicitno na loginu, kreiranju posta, porukama

---

## Docker i DevOps (Zadatak 2)

**Cilj:** kontejnerizovati FE i BE, definisati mrežu, portove, volumene i healthcheck, sve komande iz terminala, i pokazati uspešno pokretanje aplikacije.

**Dockerfile (frontend)**

* Build stage: Node 18, `npm ci`, `npm run build`
* Run stage: `node:18-alpine` + `npm run preview` ili `serve` build
* `.dockerignore`: `node_modules`, `dist`, `.git`, `*.log`

**Dockerfile (backend)**

* Node 18, `npm ci`, `npm run build`, `npm run start`
* `.dockerignore`: `node_modules`, `dist`, `.env`, `.git`, `*.log`

**Compose (primer)**

* Servisi: `frontend`, `backend`
* Mreže: `app-net` (user-defined bridge)
* Portovi: `3000:3000` (FE), `5000:5000` (BE)
* Volumeni: bind‑mount za razvoj (npr. `./backend:/app`) + named volume za node_modules (opciono)
* `depends_on`, `healthcheck`, `restart: unless-stopped`
* `env_file`: odvojeni `.env` fajlovi za FE/BE

**Za više ocene**

* Dodatne build opcije (`--no-cache`, argovi) i multi‑stage
* `.dockerignore` objašnjen u dokumentaciji
* Healthcheck skripta za BE (`GET /health`)
* Named volume za persistenciju (npr. `uploads` ako bude lokalni store)

---

## Development Phases / Milestones

1. **MVP skelet**
   FE landing + auth ekrani (placeholder), BE `/health`, `/posts` (mock), upload flow skeleton.
2. **Docker (Zadatak 2)**
   Dockerfile FE/BE, compose (mreže, portovi, volumeni, healthcheck), pokretanje i screenshotovi.
3. **Core funkcionalnosti**
   Postovi (CRUD + slike), profil, feed, like/follow; Firestore pravila; validacija.
4. **Chat i pretraga**
   Realtime poruke, liste chatova, pretraga + filteri; paginacija.
5. **UX/QA i dokumentacija**
   Animacije, pristupačnost, testni podaci, finalni screenshotovi i PDF.
6. **Cloud (bonus)**
   FE na Vercel, BE na Render/Railway; update dokumentacije URL‑ovima.

---

## Potential Challenges and Solutions

* **Upload i performanse**: kompresija (browser-image-compression), lazy loading, limit 5 slika
* **Realtime troškovi**: smanjiti listenere; server agregira listu; paginacija
* **Pravila bezbednosti**: test set pravila + emulator pre produkcije
* **Iteracija uz Docker**: bind‑mount u compose za brzo ažuriranje bez rebuilda

---

## Future Expansion

* Notifikacije (FCM) i email obaveštenja
* Napredni ranking feed‑a (recency + interakcije)
* Geo‑filter (razmena u blizini)
* Verifikovani nalozi; role‑based UI
* Moderation dashboard (admin panel)

---

## Artefakti za predaju

* **Kod:** frontend, backend, docker fajlovi, `.env.example` (bez tajni)
* **Dokumentacija (PDF):** zahtevi, tehnologije, uputstvo (screenshotovi), dokerizacija (compose detaljno), delovi koda
* **„Baza“:** export test podataka (JSON za Firestore)
* **Screenshotovi:** `docker build`, `docker images`, `docker ps`, `docker network ls`, `docker volume ls`, aplikacija na `localhost`
