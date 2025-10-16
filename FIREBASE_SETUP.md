# Firebase Setup Instructions for TRADEY

Ova aplikacija koristi Firebase za autentifikaciju, Firestore za bazu podataka i Storage za slike. Evo šta trebaš podesiti u Firebase Console-u.

## 1. Firestore Database

### Kolekcije

Kreiraj sledeće kolekcije u Firestore:

1. **`users`** - Profili korisnika
2. **`posts`** - Proizvodi za razmenu
3. **`chats`** - Chat konverzacije
4. **`messages`** - Poruke u chat-ovima

### Firestore Security Rules

Kopiraj sledeća pravila u **Firestore Rules** (Firebase Console > Firestore Database > Rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function - check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function - check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      // Anyone can read user profiles (for marketplace, profiles, etc.)
      allow read: if true;

      // Users can create their own profile
      allow create: if isAuthenticated() && request.auth.uid == userId;

      // Users can only update their own profile
      allow update: if isOwner(userId);

      // Users can only delete their own profile
      allow delete: if isOwner(userId);
    }

    // Posts collection
    match /posts/{postId} {
      // Anyone can read posts (public marketplace)
      allow read: if true;

      // Authenticated users can create posts
      allow create: if isAuthenticated()
                    && request.resource.data.authorId == request.auth.uid;

      // Only post owner can update
      allow update: if isAuthenticated()
                    && resource.data.authorId == request.auth.uid;

      // Only post owner can delete
      allow delete: if isAuthenticated()
                    && resource.data.authorId == request.auth.uid;
    }

    // Chats collection
    match /chats/{chatId} {
      // Only participants can read chat
      allow read: if isAuthenticated()
                  && request.auth.uid in resource.data.participants;

      // Authenticated users can create chats they're part of
      allow create: if isAuthenticated()
                    && request.auth.uid in request.resource.data.participants;

      // Participants can update chat (e.g., lastMessage)
      allow update: if isAuthenticated()
                    && request.auth.uid in resource.data.participants;

      // Participants can delete chat
      allow delete: if isAuthenticated()
                    && request.auth.uid in resource.data.participants;

      // Messages subcollection
      match /messages/{messageId} {
        // Only chat participants can read messages
        allow read: if isAuthenticated()
                    && request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;

        // Only chat participants can create messages
        allow create: if isAuthenticated()
                      && request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants
                      && request.resource.data.senderId == request.auth.uid;

        // Message sender can update their own message
        allow update: if isAuthenticated()
                      && resource.data.senderId == request.auth.uid;

        // Message sender can delete their own message
        allow delete: if isAuthenticated()
                      && resource.data.senderId == request.auth.uid;
      }
    }
  }
}
```

## 2. Firebase Storage

### Storage Rules

Kopiraj sledeća pravila u **Storage Rules** (Firebase Console > Storage > Rules):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Helper function - check file size (max 5MB for images)
    function isValidImageSize() {
      return request.resource.size < 5 * 1024 * 1024;
    }

    // Helper function - check if file is an image
    function isImage() {
      return request.resource.contentType.matches('image/.*');
    }

    // User avatars
    match /avatars/{userId}/{fileName} {
      // Anyone can read avatars (for public profiles)
      allow read: if true;

      // Only the user can upload/update their own avatar
      allow write: if request.auth != null
                   && request.auth.uid == userId
                   && isImage()
                   && isValidImageSize();

      // Only the user can delete their own avatar
      allow delete: if request.auth != null
                    && request.auth.uid == userId;
    }

    // Post images
    match /posts/{postId}/{fileName} {
      // Anyone can read post images (for public marketplace)
      allow read: if true;

      // Authenticated users can upload images for their posts
      // Note: Backend will validate that postId matches authorId
      allow write: if request.auth != null
                   && isImage()
                   && isValidImageSize();

      // Users can delete images (backend validates ownership)
      allow delete: if request.auth != null;
    }
  }
}
```

## 3. Firebase Authentication

### Omogući Email/Password autentifikaciju

1. Idi na **Firebase Console > Authentication > Sign-in method**
2. Omogući **Email/Password** provider
3. (Opcionalno) Omogući **Google** provider za Google Sign-In

### Email Verification (Opcionalno)

Ako želiš da korisnici verifikuju email:
1. Idi na **Authentication > Templates**
2. Prilagodi Email verification template
3. U kodu dodaj `sendEmailVerification()` nakon registracije

## 4. Firestore Indexes

Ove indekse možeš kreirati ručno ili ih Firebase automatski predlaže kad prvi put pokreneš query.

### Posts Collection Indexes

```
Collection: posts
Fields indexed:
- createdAt (Descending)
- isAvailable (Ascending)
- authorId (Ascending) + createdAt (Descending)
```

### Chats Collection Indexes

```
Collection: chats
Fields indexed:
- participants (Array) + lastMessageAt (Descending)
```

### Messages Subcollection Indexes

```
Collection: chats/{chatId}/messages
Fields indexed:
- createdAt (Ascending)
```

## 5. Environment Variables

### Frontend (.env)

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Backend (.env)

```env
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

Backend koristi `firebase-service-account.json` za Firebase Admin SDK. Ovaj fajl:
- **NIKADA** ne commituj u git
- Preuzmi ga iz Firebase Console > Project Settings > Service Accounts > Generate new private key
- Postavi ga u `backend/firebase-service-account.json`

## 6. Napomene

### Followers Tracking

Trenutno aplikacija ne trackuje "followers" brojač aktivno. Ako želiš da implementiraš:

1. Dodaj `followers` polje u `users` kolekciju (array of user IDs)
2. Update backend `toggleFollow` endpoint da ažurira i `followers` array kod praćenog korisnika
3. Ili koristi Cloud Functions za održavanje brojača

### Likes/Views Tracking

Aplikacija trenutno ne trackuje broj lajkova/pregleda po postu. Za implementaciju:

1. Dodaj `likes` array i `likesCount` polje u `posts` dokument
2. Update backend `toggleLike` endpoint da ažurira brojač
3. Frontend komponente već imaju placeholder za ove brojače

### Report Functionality

Report modali su implementirani u UI, ali backend endpoint za reporting nije kreiran. Za implementaciju:

1. Kreiraj `reports` kolekciju u Firestore
2. Dodaj backend endpoint `/api/reports` za kreiranje reporta
3. Pove ži frontend sa backend-om

## 7. Testiranje

Nakon podešavanja:

1. Pokreni backend: `cd backend && npm run dev`
2. Pokreni frontend: `cd frontend && npm run dev`
3. Registruj test korisnika
4. Postavi proizvod
5. Testiraj chat funkcionalnost
6. Proveri da li slike uploaduju u Storage

## 8. Production Deployment

Kad deplojuješ na production:

1. **Ažuriraj CORS_ORIGIN** u backend .env sa production URL-om
2. **Ažuriraj Firestore i Storage Rules** ako je potrebno
3. **Omogući Firestore Backups** (Firebase Console > Firestore > Backups)
4. **Postavi Cloud Functions** za dodatnu logiku (ako je potrebno)
5. **Proveri Firebase Pricing** - free tier ima limite

---

✅ Nakon što podesiš sve ovo, aplikacija će biti potpuno funkcionalna!

Ako imaš pitanja ili problema, proveri Firebase Console logs ili konzolu u browser-u za greške.
