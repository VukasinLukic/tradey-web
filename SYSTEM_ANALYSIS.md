# TRADEY - Sistem Analiza i Preporuke

## 📋 Sadržaj

1. [Greške u Logici Aplikacije](#1-greške-u-logici-aplikacije)
2. [Predlozi za Poboljšanje Korisničkog Iskustva](#2-predlozi-za-poboljšanje-korisničkog-iskustva)
3. [Šta Nam Još Fali](#3-šta-nam-još-fali)
4. [Sigurnosne Rupe](#4-sigurnosne-rupe)

---

## 1. Greške u Logici Aplikacije

### 🔴 KRITIČNO: Greška u `markAllAsRead` Firestore Query

**Lokacija**: `backend/src/controllers/chatController.ts:348`

**Problem**: Nepravilna upotreba Firestore `not-in` operatora sa ugnjezdenim nizom.

```typescript
// POGREŠNO (trenutno):
.where('readBy', 'not-in', [[userId]])

// ISPRAVNO:
.where('readBy', 'array-contains', userId)
```

**Uticaj**: Korisnici ne mogu da označe poruke kao pročitane, što remeti funkcionalnost četa.

**Preporuka**: Refaktorisati query logiku ili koristiti client-side filtriranje.

---

### 🟠 Race Condition: Username Uniqueness Check

**Lokacija**: `backend/src/controllers/userController.ts:198-211`

**Problem**: Dva korisnika mogu istovremeno proveriti da li je username slobodan, i oba dobiju potvrdu pre nego što bilo ko upiše u bazu.

**Scenario**:

1. Korisnik A proverava username "milan" → slobodan ✅
2. Korisnik B proverava username "milan" → slobodan ✅
3. Korisnik A kreira profil sa "milan"
4. Korisnik B kreira profil sa "milan"
5. Rezultat: Duplikat! 💥

**Preporuka**: Koristiti Firestore transakcije ili unique constraint na database nivou.

---

### ✅ Like Toggle - FIXOVANO

**Status**: ✅ Implementirano!

**Šta je urađeno**: Refaktorisan da koristi samo atomične Firestore operacije bez pre-check-a.

---

### ✅ Chat Deletion - FIXOVANO

**Status**: ✅ Implementirano!

**Šta je urađeno**:
- Soft delete sa `deletedFor` poljem
- Delete dugme dodato u Chat UI
- Permanentno brisanje samo kad oba korisnika obrišu

---

### ✅ Review Rating - FIXOVANO

**Status**: ✅ Implementirano!

**Šta je urađeno**: Sada koristi Firestore transakcije za atomične update operacije.

---

### 🟡 getFeed Query Inefficiency

**Status**: ⚠️ Za optimizaciju u budućnosti

**Trenutno**: Radi, ali može biti sporije za korisnike koji prate >10 osoba.

**Preporuka**: Denormalizovati feed kolekciju ili cursor-based paginacija.

---

### 🟡 Post Status Backward Compatibility Issue

**Status**: ⚠️ Za buduću migraciju

**Trenutno**: Radi sa dual check (`status` i `isAvailable`).

**Preporuka**: Napraviti jednokratnu migraciju svih postova.

---

### ✅ Pagination Validation - FIXOVANO

**Status**: ✅ Implementirano!

**Šta je urađeno**: Dodato validiranje - limit max 100, offset min 0.

---

## 2. Predlozi za Poboljšanje Korisničkog Iskustva

### ✅ Email Verification - IMPLEMENTIRANO!

**Status**: ✅ Gotovo!

**Šta je urađeno**:
- Email verification se šalje nakon signup-a
- Kreirana `/verify-email` stranica sa auto-refresh (proverava svakih 3s)
- Resend email funkcionalnost

**Firebase Setup Potreban**:
1. Firebase Console → Authentication → Settings → Email templates
2. Enable "Email address verification" template
3. Dodaj `localhost` u Authorized domains

**Napomena**: Mejlovi se šalju preko Firebase Auth sistema (od noreply@your-project.firebaseapp.com). Proveri spam folder pri testiranju!

---

### ✅ Forgot Password Flow - IMPLEMENTIRANO!

**Status**: ✅ Gotovo!

**Šta je urađeno**:
- Kreirana `/forgot-password` stranica
- "Forgot password?" link na login strani
- Firebase password reset email integration

---

### 💡 Real-time Chat Updates

**Status**: ❌ Chat zahteva manual refresh

**Trenutno**: Korisnici moraju da osvežavaju stranicu da vide nove poruke.

**Predlog**: Implementirati Firestore real-time listeners:

```typescript
// Frontend:
const unsubscribe = onSnapshot(
  collection(db, `chats/${chatId}/messages`),
  (snapshot) => {
    const newMessages = snapshot.docs.map((doc) => doc.data());
    setMessages(newMessages);
  }
);
```

**Benefit**: Instant komunikacija, bolje korisničko iskustvo.

---

### 💡 Notification System

**Status**: ❌ Ne postoji

**Šta fali**: Korisnici ne dobijaju obaveštenja za:

- Nove poruke
- Nove like-ove na njihovim postovima
- Nove komentare
- Nove follow-ere
- Follow request-ove

**Predlog**: Implementirati Firebase Cloud Messaging (FCM) sa push notifikacijama i in-app notification center.

---

### 💡 Report/Block Functionality

**Status**: ❌ Ne postoji

**Problem**: Nema načina da se prijavi neprikladan sadržaj ili blokira dosadni korisnik.

**Predlog**:

- Dodati "Report" dugme na postove, komentare, profile
- Implementirati "Block User" funkcionalnost
- Kreirati admin moderation queue

---

### 💡 Better Search

**Status**: ⚠️ Client-side only, ograničeno

**Trenutno**: Pretraga radi samo na učitanim postovima (max 100).

**Predlog**: Implementirati full-text search sa Algolia ili ElasticSearch:

- Pretraga po naslovu, brendu, opisu
- Autocomplete
- Typo tolerance
- Filtriranje u real-time

---

### 💡 Transaction/Trade Tracking System

**Status**: ❌ Ne postoji

**Problem**: Korisnici se dogovaraju u četu, ali nema formalnog tracking-a:

- Ko je prihvatio trade?
- Da li je roба prebačena?
- Ko duguje review?

**Predlog**: Implementirati Trade Request workflow:

1. Korisnik šalje trade request na post
2. Vlasnik prihvata/odbija
3. Prati status: Pending → Accepted → Completed
4. Auto-prompt za review nakon completion

---

### 💡 Wishlist Feature

**Status**: Postoji "Liked" ali nije jasno

**Predlog**: Preimenovati "Liked" u "Wishlist" ili "Saved Items" da bude jasnije da se radi o sačuvanim artiklima, ne o "like-ovanju".

---

## 3. Šta Nam Još Fali

### 🎯 Kritične Funkcionalnosti

#### 1. **Admin Dashboard**

**Zašto**: Trenutno nema načina da se:

- Moderira sadržaj
- Banuju korisnici
- Vide statistike platforme
- Reaguje na report-ove

**Šta treba**:

- Admin panel sa user management
- Content moderation tools
- Analytics dashboard
- Ban/warning sistem

---

#### 2. **User Verification Badges**

**Zašto**: Povećava poverenje u platformi

**Predlog**:

- Email verified badge ✉️
- Phone verified badge 📱
- "Trusted Trader" badge za korisnike sa visokim ratingom
- Power seller badge za aktivne prodavce

---

#### 3. **Image Optimization Pipeline**

**Trenutno**: Slike se kompresuju client-side

**Šta fali**:

- Server-side WebP conversion
- Responsive image sizes
- CDN caching
- Lazy loading optimization

**Impact**: Spore stranice, visoka potrošnja bandwidth-a

---

#### 5. **Multi-language Support (i18n)**

**Status**: Sve je trenutno u srpskom/engleskom miks

**Predlog**: Implementirati i18n:

- Engleski
- Srpski
- Potencijalno drugi jezici regiona

---

#### 6. **Social Sharing**

**Status**: Ne postoji

**Predlog**: Dodati mogućnost deljenja postova:

- Na društvenim mrežama
- Copy link
- QR kod za proizvod

---

#### 7. **Analytics & Insights za Korisnike** - ovo ne radi jos !!!

**Predlog**: "My Stats" stranica:

- Koliko je puta post viđen
- Koliko ljudi je kliknulo
- Trend popularnosti
- Best performing posts

---

#### 8. **Saved Drafts**

**Status**: Ne postoji

**Problem**: Ako korisnik napravi post i zatvori tab, gubi sve.

**Predlog**: Auto-save draft-ova za:

- Novi post
- Komentari
- Profile edit

---

#### 9. **Feedback System**

**Status**: Ne postoji

**Predlog**: In-app feedback forma za korisničke sugestije i bug report-ove.

---

### 🎨 UX/UI Poboljšanja

#### 1. **Loading States**

**Problem**: Neke akcije nemaju loading indikator (follow/unfollow button)

**Predlog**: Svaka async akcija mora imati:

- Loading spinner ili skeleton
- Disabled state dok je u procesu
- Success/error feedback

---

#### 2. **Empty States**

**Status**: Neki postoje, neki ne

**Gde fali**:

- Prazna inbox lista
- Nema notifikacija
- Nema search rezultata

**Predlog**: Dodati ilustracije i poziv na akciju za sve empty state-ove.

---

#### 3. **Onboarding Flow**

**Status**: Ne postoji

**Predlog**: Nakon registracije, voditi korisnika kroz:

1. Completion profila (avatar, bio)
2. Postavljanje preferencija
3. Tour platforme (gdje je šta)
4. Prvi post

---

#### 4. **Better Mobile Experience**

**Status**: Radi, ali može bolje

**Predlozi**:

- Bottom navigation bar za glavne akcije
- Pull-to-refresh
- Swipe gestures
- Native-like feel

---

## 4. Sigurnosne Rupe

### 🔐 KRITIČNE SIGURNOSNE RUPE

#### 1. **Image Upload MIME Type Verification**

**Lokacija**: `backend/src/routes/posts.routes.ts:16-23`

**Problem**: File upload filter proverava samo MIME type iz client-provided headers, što može biti spoofovano.

**Rizik**:

- Upload malicioznih fajlova maskiranih kao slike
- Potencijalno server-side code execution
- Storage spam

**Fix**:

```typescript
import fileType from "file-type";

// Verifikuj stvarni content, ne samo MIME type:
const type = await fileType.fromBuffer(file.buffer);
if (!type || !["image/jpeg", "image/png", "image/webp"].includes(type.mime)) {
  throw new Error("Invalid file type");
}
```

---

#### 2. **Missing Input Sanitization**

**Lokacija**: `backend/src/controllers/postController.ts:432-466`

**Problem**: Comment text se trim-uje ali ne sanitizuje.

**Rizik**:

- Stored XSS ako se display logika promeni
- Database pollution sa malicioznim content-om
- Script injection u drugim klijentima

**Fix**:

```typescript
import DOMPurify from "isomorphic-dompurify";
text: DOMPurify.sanitize(text.trim());
```

---

#### 3. **JWT Token Not Refreshed Proactively**

**Lokacija**: `frontend/src/services/api.ts:24-26`

**Problem**: Token se fetch-uje za svaki request ali ne refreshuje proaktivno. Ako istekne tokom duge sesije, request-i će failovati.

**Rizik**: Korisnik gubi sesiju bez upozorenja.

**Fix**:

```typescript
const tokenResult = await user.getIdTokenResult();
if (tokenResult.expirationTime - Date.now() < 5 * 60 * 1000) {
  await user.getIdToken(true); // Force refresh
}
```

---

#### 4. **Missing Authorization Check - getUserPosts**

**Lokacija**: `backend/src/controllers/userController.ts:115`

**Problem**: Endpoint koristi `optionalAuthenticate`, što znači da neulogovani korisnici mogu pristupiti. Ne filtrira unavailable postove.

**Rizik**:

- Privacy concerns
- Neautentifikovani korisnici vide sve postove

**Fix**:

```typescript
if (id !== req.user?.uid) {
  // Samo prikazuj available postove za non-owners:
  filters.push(["status", "==", "available"]);
}
```

---

### 🔒 VISOK PRIORITET

#### 5. **Phone Number Validation Too Restrictive**

**Lokacija**: `shared/constants/validationSchemas.ts:25, 34`

**Problem**: Regex `/^\d{9,10}$/` prihvata samo 9-10 cifara bez country code-a ili formatiranja.

**Rizik**: Međunarodni korisnici ne mogu da se registruju.

**Fix**:

```typescript
import { parsePhoneNumber } from "libphonenumber-js";
phone: z.string().refine((value) => {
  try {
    const phoneNumber = parsePhoneNumber(value);
    return phoneNumber.isValid();
  } catch {
    return false;
  }
}, "Invalid phone number");
```

---

#### 6. **No Rate Limiting**

**Lokacija**: Svi endpoints

**Problem**: Nema rate limiting-a ni na jednom endpoint-u.

**Rizik**:

- Brute force napadi
- API spam
- DoS napadi
- Review bombing

**Fix**: Implementirati express-rate-limit:

```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuta
  max: 100, // max 100 requests po IP
});

app.use("/api/", limiter);
```

---

#### 7. **CORS Configuration**

**Lokacija**: `backend/src/config/cors.ts:8-16`

**Problem**: CORS dozvoljava localhost:5173-5179 i 3000, što je široko. Ako production koristi dev mode, može biti exploited.

**Fix**:

- Striktno odvojiti dev i prod konfiguracije
- Koristiti environment-based whitelisting
- Nikad ne merge-ovati dev origins u production

---

#### 8. **Information Disclosure in Errors**

**Lokacija**: `backend/src/middleware/errorHandler.ts:54-57`

**Problem**: Development mode expose-uje full stack traces u API response-ima.

**Rizik**:

- Path disclosure
- Technology stack exposure
- Internal system info leak

**Fix**: Osigurati da je `NODE_ENV=production` u produkciji, ukloniti stack traces.

---

### 🔓 SREDNJI PRIORITET

#### 9. **No HTTPS Enforcement**

**Status**: Nema koda koji forsira HTTPS

**Rizik**: Man-in-the-middle napadi

**Fix**:

```typescript
app.use((req, res, next) => {
  if (
    req.headers["x-forwarded-proto"] !== "https" &&
    process.env.NODE_ENV === "production"
  ) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});
```

---

#### 10. **Missing Security Headers**

**Status**: Nema helmet.js ili security headers

**Rizik**: XSS, clickjacking, MIME sniffing

**Fix**:

```typescript
import helmet from "helmet";
app.use(helmet());
```

---

#### 11. **No Audit Logging**

**Status**: Ne postoji

**Problem**: Nema audit trail-a za osetljive operacije (brisanje postova, banovane users, itd).

**Predlog**: Logovanje kritičnih akcija u posebnu kolekciju sa timestamp-om, user ID, akcijom.

---

#### 12. **No Data Retention Policy**

**Status**: Ne postoji

**Problem**: Stari podaci (deleted posts, inactive users) ostaju zauvek.

**Predlog**: Implementirati automatsko čišćenje:

- Obrisani postovi nakon 30 dana
- Neaktivni korisnici nakon 2 godine
- Stare poruke nakon 1 godine

---

### ⚠️ OSTALO

#### 14. **No API Versioning**

**Status**: Endpoints su `/api/users`, ne `/api/v1/users`

**Problem**: Breaking changes će uticati na sve klijente odjednom.

**Predlog**: Implementirati API versioning strategiju.

---

#### 15. **Frontend ENV Not Validated at Build**

**Lokacija**: `frontend/src/firebase/config.ts:19-32`

**Problem**: Env varijable se validiraju runtime, ne build time. Broken build može biti deployovan.

**Fix**: Validirati na build time ili failing build ako env vars nedostaju.

---

## 📊 Prioritizacija

### ✅ Sprint 1 - ZAVRŠEN! 🎉

1. ✅ **Isključi sopstvene postove iz "For You" feed-a**
2. ✅ **Fix Like Toggle race condition** - atomic operations
3. ✅ **Fix Chat Deletion** - soft delete + UI Delete button
4. ✅ **Fix Review Rating** - Firestore transactions
5. ✅ **Pagination validation** - limit max 100
6. ✅ **Email verification flow** - kompletna implementacija
7. ✅ **Password reset flow** - forgot password page

**Build Status**: ✅ Backend i Frontend build uspešan!

---

### Sledeći Sprint (Sprint 2):

1. Fix `markAllAsRead` query bug (KRITIČNO)
2. Dodaj rate limiting
3. Implementiraj file type verification
4. Real-time chat updates
5. Notification system
6. Report/Block functionality
7. Fix username uniqueness race condition

### Dugoročno (Q2 2025):

1. Admin dashboard
2. Trade tracking system
3. Advanced search (Algolia)
4. Multi-language support
5. Analytics & insights

---

## 🎯 Zaključak

**Trenutno stanje**: Aplikacija ima solidnu osnovu, ali ima kritičnih sigurnosnih i logičkih problema koje treba rešiti pre produkcije.

**Najkriticnije**:

- Race conditions u key operacijama
- Nedostaje rate limiting
- Slaba validacija input-a

**Najveći UX gap**:

- Nema notifikacija
- Chat nije real-time
- Nema načina da se prijavi abuse

**Prioritet**: Fokusirati se na sigurnost i stabilnost pre dodavanja novih feature-a.

---

**Datum analize**: 3. Novembar 2025
**Autor**: Claude Code Agent
**Verzija**: 1.0
