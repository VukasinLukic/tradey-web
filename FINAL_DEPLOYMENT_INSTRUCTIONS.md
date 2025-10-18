# Finalne Instrukcije za Deployment

## ✅ Sve Izmene su Završene!

---

## Šta je Popravljeno:

### 1. **Rate Limiting (429 Error)**
- **Problem:** Backend je blokirao frontend nakon 50-100 zahteva
- **Rešenje:** Povećani limiti:
  - API limiter: 100 → **500 zahteva** / 15 minuta
  - Chat limiter: 50 → **300 zahteva** / 15 minuta
- **Fajl:** `backend/src/middleware/rateLimiter.ts`

### 2. **Followers/Following Brojevi**
- **Problem:** Prikazivao 0 followers umesto pravog broja
- **Rešenje:** Dodao `followers` polje u `UserProfile` tip i povlačenje iz baze
- **Fajlovi:**
  - `frontend/src/types/entities.ts` (dodao `followers?: string[]`)
  - `frontend/src/pages/UserProfile.tsx` (koristi `userProfile.followers?.length`)

### 3. **404 na Following/Followers Link**
- **Problem:** Linkovi `/user/:id/following` nisu postojali
- **Rešenje:** Uklonjeni linkovi, sada su obični `<div>` elementi (ne klikabilni)
- **Fajl:** `frontend/src/pages/UserProfile.tsx`

### 4. **Redirect od Login/Signup**
- **Problem:** Ulogovani korisnici mogli da vide login/signup stranice
- **Rešenje:** Dodao automatski redirect na `/profile` ako je korisnik već ulogovan
- **Fajlovi:**
  - `frontend/src/pages/Login.tsx`
  - `frontend/src/pages/Signup.tsx`

### 5. **Dockerfile za Railway**
- **Problem:** Railway nije mogao da builuje jer je fajl tražio `firebase-service-account.json`
- **Rešenje:** Uklonjena linija koja kopira fajl (sada koristi environment variable)
- **Fajl:** `backend/Dockerfile`

---

## Šta Treba Sada da Uradiš:

### Korak 1: Git Push

```bash
git add -A
git commit -m "Fix rate limiting, followers count, auth redirects, and Railway deployment"
git push origin main
```

**Objašnjenje:** Ovo šalje sve izmene na GitHub, što će pokrenuti automatski redeploy na Railway i Vercel.

---

### Korak 2: Proveri Railway Redeploy

1. Otvori [railway.app](https://railway.app) → Tvoj projekat
2. Idi na **Deployments** tab
3. Vidi da novi deployment počinje automatski nakon push-a
4. Čekaj da kaže **"Deployment successful"** (2-3 minuta)

**NE MORAŠ NIŠTA DA MENJAŠ - Railway detektuje GitHub push i automatski rebuilduje!**

---

### Korak 3: Proveri Vercel Redeploy

1. Otvori [vercel.com](https://vercel.com) → Tvoj projekat
2. Idi na **Deployments** tab
3. Vidi da novi deployment počinje automatski nakon push-a
4. Čekaj da kaže **"Ready"** (1-2 minuta)

**NE MORAŠ NIŠTA DA MENJAŠ - Vercel detektuje GitHub push i automatski rebuilduje!**

---

### Korak 4: Testiraj Aplikaciju

1. **Otvori:** https://tradey-web.vercel.app
2. **Testiraj:**
   - ✅ Profil drugog korisnika prikazuje tačan broj followera
   - ✅ Chat ne crashuje nakon 50 zahteva
   - ✅ Ulogovani korisnik ne može da vidi login/signup (redirectuje na profil)
   - ✅ Svi proizvodi se učitavaju

---

## ODGOVORI NA TVOJA PITANJA:

### Q: Da li treba opet da pokrećem Docker lokalno?

**A: NE!** Docker je potreban samo za lokalni development ili ako hoćeš da testirajš lokalno. Za production deployment na Railway/Vercel:
- Railway koristi Dockerfile automatski
- Vercel koristi `npm run build` automatski
- **Ti samo pushuj na GitHub i sve se automatski deploya!**

---

### Q: Kako profesor proverava aplikaciju?

Profesor može da proveri na **3 načina**:

#### 1. **Vercel/Railway URL (PREPORUČENO)**
Daj mu:
- Frontend: https://tradey-web.vercel.app
- Backend API: https://tradey-web-production.up.railway.app

**Ovo je najlakše - samo otvori link i sve radi!**

#### 2. **Lokalno sa `npm run dev`**
Ako hoće lokalno:
```bash
# Frontend
cd frontend
npm install
npm run dev  # Radi na http://localhost:5173

# Backend (drugi terminal)
cd backend
npm install
npm run dev  # Radi na http://localhost:5000
```

**NAPOMENA:** Mora da ima `.env` fajlove i Firebase credentials!

#### 3. **Docker Compose**
Ako hoće Docker:
```bash
docker-compose up --build
```

**NAPOMENA:** Mora da ima `firebase-service-account.json` u `/backend` folderu!

---

### Q: Šta da pošaljem profesoru?

Za **Zadatak 2 - Docker**, trebaš da dokumentuješ:

1. **Dokumentacija (PDF/DOCX):**
   - Screenshot-ovi svih docker komandi
   - Screenshot-ovi imidža, kontejnera, volumena, mreže
   - Screenshot-ovi pokrenute aplikacije
   - Objašnjenje svakog koraka

2. **Fajlovi za upload:**
   - `docker-compose.yaml`
   - `backend/Dockerfile`
   - `frontend/Dockerfile`
   - `.dockerignore` fajlovi
   - `README.md` (opciono)

3. **Link ka GitHub repo-u**

4. **Production URL-ovi:**
   - Frontend: https://tradey-web.vercel.app
   - Backend: https://tradey-web-production.up.railway.app

---

### Q: Koji Docker screenshotovi su potrebni?

Za **više ocenu**, screenshot-uj:

#### **1. Kreiranje imidža:**
```bash
docker build -t tradey-frontend ./frontend
docker build -t tradey-backend ./backend
```

#### **2. Prikaz imidža:**
```bash
docker images
```

#### **3. Pokretanje kontejnera:**
```bash
docker-compose up
```

#### **4. Prikaz kontejnera:**
```bash
docker ps
```

#### **5. Prikaz volumena:**
```bash
docker volume ls
```

#### **6. Prikaz mreže:**
```bash
docker network ls
```

#### **7. Screenshot pokrenute aplikacije u browseru**

---

## Docker-Compose Objašnjenje (Za Dokumentaciju)

### Tvoj `docker-compose.yaml`:

```yaml
version: '3.8'

name: tradey-app  # Ime projekta

services:
  backend:
    container_name: tradey-backend
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"  # Host:Container
    environment:
      - NODE_ENV=production
      - PORT=5000
      - CORS_ORIGIN=http://localhost:3000
    env_file:
      - ./backend/.env  # Učitava varijable iz fajla
    volumes:
      - ./backend:/app  # Bind mount za live reload
      - /app/node_modules  # Named volume za node_modules
    networks:
      - tradey-network
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped  # Automatsko pokretanje

  frontend:
    container_name: tradey-frontend
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - VITE_API_URL=http://localhost:5000/api
    ports:
      - "3000:3000"
    depends_on:
      - backend  # Čeka da backend startuje
    networks:
      - tradey-network
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

networks:
  tradey-network:
    driver: bridge  # Bridge network za komunikaciju između kontejnera

volumes:
  backend-node-modules:  # Named volume za perzistenciju
```

---

## Objašnjenja za Više Ocenu:

### **1. Multi-stage builds (Dockerfile):**
```dockerfile
FROM node:18-alpine AS builder  # Stage 1: Build
# ... build steps ...

FROM node:18-alpine  # Stage 2: Production
# ... samo production fajlovi
```
**Benefit:** Manji imidž, brži build.

### **2. .dockerignore:**
Sprečava kopiranje nepotrebnih fajlova:
```
node_modules
dist
.env
.git
```

### **3. Healthcheck:**
Automatski proverava da li je servis "zdrav":
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
```

### **4. Bind Mount:**
```yaml
volumes:
  - ./backend:/app  # Lokalne izmene se odmah reflektuju u kontejneru
```

### **5. Named Volume:**
```yaml
volumes:
  - /app/node_modules  # Sprečava overwrite node_modules
```

---

## Finalna Checklist:

- [x] Backend rate limiting povećan
- [x] Followers/Following brojevi popravljeni
- [x] Auth redirect dodat
- [x] Dockerfile optimizovan za Railway
- [x] Frontend build prolazi
- [x] Backend build prolazi
- [ ] **Git push** ← URadi OVO SADA!
- [ ] Railway redeploy (automatski nakon push-a)
- [ ] Vercel redeploy (automatski nakon push-a)
- [ ] Testiraj aplikaciju na production URL-u

---

## Sledeći Korak:

**Otvori terminal i uradi:**

```bash
cd d:\tradey-web
git add -A
git commit -m "Fix rate limiting, followers count, auth redirects, and Railway deployment"
git push origin main
```

**Posle toga čekaj 3-5 minuta i testiraj:**
https://tradey-web.vercel.app

---

**SVE JE SPREMNO! Samo pushuj i sve će raditi! 🚀**
