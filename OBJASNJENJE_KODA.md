# TRADEY - Tehnička Dokumentacija i Objašnjenje Koda

## 📋 Sadržaj

1. [Uvod i Arhitektura Projekta](#uvod-i-arhitektura-projekta)
2. [Autentifikacija - Sigurno Prijavljivanje](#autentifikacija---sigurno-prijavljivanje)
3. [Profile Management - Korisnički Profil](#profile-management---korisnički-profil)
4. [Chat Sistem - Real-time Komunikacija](#chat-sistem---real-time-komunikacija)
5. [Post Management - Kreiranje i Upravljanje Objavama](#post-management---kreiranje-i-upravljanje-objavama)
6. [Marketplace - Pretraga i Filtriranje](#marketplace---pretraga-i-filtriranje)
7. [ItemView - Detaljan Pregled Proizvoda](#itemview---detaljan-pregled-proizvoda)
8. [Social Features - Praćenje i Interakcija](#social-features---praćenje-i-interakcija)
9. [Backend API Arhitektura](#backend-api-arhitektura)

---

## Uvod i Arhitektura Projekta

### 🎯 Vizija: Revolucionarna Platforma za Razmenu Garderobe

TRADEY je više od aplikacije - to je pokret koji transformiše način kako ljudi razmišljaju o modi. Umesto tradicionalnog kupovanja nove odeće, korisnici mogu da traže, pronađu i razmenjuju garderobu sa drugim entuzijastima mode. Ovo je aplikacija koja kombinuje najbolje od društvenih mreža i e-commerce platformi, stvarajući jedinstveno iskustvo za fashion-conscious korisnike.

**Zašto TRADEY?**
- **Demokratizuje modu** - omogućava svima pristup kvalitetnoj garderobi
- **Promoviše održivost** - smanjuje potrošnju nove odeće kroz ponovno korišćenje
- **Gradi zajednicu** - povezuje ljude sa sličnim stilovima i interesovanjima
- **Stimuliše kreativnost** - inspirira nove kombinacije i stilove

### 🛠️ Tehnološki Stack: Moderna Full-Stack Arhitektura

**Frontend Arhitektura:**
- **React 18** sa TypeScript - za type-safe komponente i bolje developer experience
- **React Router v6** - za elegantnu navigaciju i nested routing
- **Axios** - za robustnu HTTP komunikaciju sa interceptors
- **Firebase Authentication** - za sigurnu autentifikaciju bez backend kompleksnosti
- **Tailwind CSS** - za brzu styling sa custom design sistemom
- **Zustand** - za lightweight state management

**Backend Infrastruktura:**
- **Node.js + Express.js** - za skalabilni REST API
- **TypeScript** - za enterprise-level type safety
- **Firebase Admin SDK** - za direktan pristup Firestore i Storage
- **Multer** - za handling file uploads sa validacijom
- **JWT Authentication** - za stateless autentifikaciju

**Cloud & DevOps:**
- **Firebase Firestore** - NoSQL baza optimizovana za real-time aplikacije
- **Firebase Storage** - CDN-optimizovano čuvanje slika
- **Docker & Docker Compose** - za kontejnerizaciju i lakše deployment
- **GitHub** - za version control i CI/CD

### 🏗️ Arhitektura Komunikacije: Kako Sve Radi Zajedno

```
┌─────────────────┐          ┌─────────────────┐
│                 │          │                 │
│   React SPA     │ <──────> │  Express API    │
│  (Frontend)     │   HTTP   │   (Backend)     │
│                 │   REST   │                 │
└────────┬────────┘          └────────┬────────┘
         │                            │
         │                            │
         ├─────> Firebase Auth        │
         │       (JWT Tokens)         │
         │                            │
         └─────────────────┬──────────┘
                           │
                           ▼
                  ┌────────────────┐
                  │   Firebase     │
                  │   Firestore    │
                  │   Storage      │
                  └────────────────┘
```

**Data Flow Story:**
1. **Frontend** šalje HTTP zahteve sa JWT tokenima
2. **Backend** verifikuje tokene i procesira logiku
3. **Firebase** čuva podatke i slike sa automatskim backup-om
4. **Real-time updates** se sinhronizuju kroz Firestore listeners

---

## Autentifikacija - Sigurno Prijavljivanje

### 🔐 Priča o Sigurnosti: Kako TRADEY Čuva Vaše Podatke

Autentifikacija u TRADEY-u je dizajnirana sa fokusom na sigurnost i korisničko iskustvo. Umesto tradicionalnih username/password kombinacija, koristimo Firebase Authentication koja pruža enterprise-level sigurnost sa minimalnim setup-om.

### 1. Signup Journey: Od Ideje do Profila

Kada korisnik pristupa `/signup` strani, započinje se proces kreiranja naloga koji kombinuje sigurnost sa jednostavnošću:

```typescript
// frontend/src/components/auth/SignupForm.tsx

const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  setError(null);
  setLoading(true);

  try {
    // Korak 1: Postavljanje persistencije na LOCAL
    // Ovo osigurava da korisnik ostaje ulogovan čak i nakon zatvaranja browsera
    await setPersistence(auth, browserLocalPersistence);

    // Korak 2: Kreiranje korisnika u Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    const user = userCredential.user;

    // Korak 3: Dobijanje JWT tokena
    // Token se automatski kešira i koristi za sve buduće API pozive
    await user.getIdToken(true);

    // Korak 4: Kreiranje user profila u našem backend-u
    // Backend poziv koji kreira dokument u Firestore kolekciji "users"
    await usersApi.createProfile({
      uid: user.uid,
      username,
      email: user.email!,
      phone,
      location,
    });

    // Korak 5: Navigacija na profile stranicu
    navigate('/profile');
  } catch (error) {
    // Detaljno handleovanje grešaka...
  }
};
```

**Backend Magic: Kreiranje User Profila**

```typescript
// backend/src/controllers/userController.ts

createUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.uid;  // Izvučeno iz JWT tokena

  // Validacija podataka pomoću Zod schema
  const validation = createUserProfileSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({
      error: 'Validation failed',
      errors: validation.error.issues,
    });
    return;
  }

  // Provera da li korisnik već postoji
  const existingUser = await firestoreService.getDocument<UserProfile>(
    COLLECTIONS.USERS, 
    userId
  );
  if (existingUser) {
    res.status(409).json({ error: 'User profile already exists' });
    return;
  }

  // Provera jedinstvenog username-a
  const usersWithSameUsername = await firestoreService.queryDocuments(
    COLLECTIONS.USERS,
    {
      filters: [['username', '==', validation.data.username]],
      limit: 1,
    }
  );

  if (usersWithSameUsername.length > 0) {
    res.status(400).json({ error: 'Username already taken' });
    return;
  }

  // Kreiranje user profila
  const newUserProfile: UserProfile = {
    uid: validation.data.uid,
    username: validation.data.username,
    email: validation.data.email,
    phone: validation.data.phone,
    location: validation.data.location,
    createdAt: new Date(),
    following: [],      // Prazna lista korisnika koje prati
    likedPosts: [],     // Prazna lista lajkovanih objava
  };

  // Snimanje u Firestore
  await firestoreService.setDocument(
    COLLECTIONS.USERS, 
    userId, 
    newUserProfile
  );

  res.status(201).json(newUserProfile);
});
```

### 2. Login Flow: Povratak u TRADEY Svijet

Login proces je dizajniran da bude brz i siguran:

```typescript
// frontend/src/components/auth/LoginForm.tsx

const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  setLoading(true);

  try {
    // Postavljanje persistencije
    await setPersistence(auth, browserLocalPersistence);

    // Firebase login
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      email, 
      password
    );

    // Refresh tokena
    await userCredential.user.getIdToken(true);

    // Provera da li profil postoji u backend-u
    try {
      await usersApi.getById(userCredential.user.uid);
    } catch (profileError) {
      console.warn('User profile not found in backend:', profileError);
    }

    // Navigacija na profile
    navigate('/profile');
  } catch (error) {
    // Error handling...
  }
};
```

### 3. Axios Interceptor: Nevidljivi Čuvar Sigurnosti

Ključni deo autentifikacije je Axios interceptor koji automatski dodaje JWT token svakom API zahtevu:

```typescript
// frontend/src/services/api.ts

apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Dobijanje trenutno ulogovanog korisnika
      const user = auth.currentUser;
      
      if (user) {
        // Dobijanje fresh JWT tokena
        const token = await user.getIdToken();
        
        // Dodavanje tokena u Authorization header
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Postavljanje Content-Type (osim za FormData)
      if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

**Kako ovo funkcioniše:**
1. Svaki put kada se pozove `apiClient.get()`, `apiClient.post()`, itd.
2. Interceptor prvo izvuče trenutnog korisnika iz Firebase Auth
3. Dobije fresh JWT token (Firebase automatski refreshuje token ako je istekao)
4. Doda token u `Authorization: Bearer {token}` header
5. Backend verifikuje token pomoću Firebase Admin SDK

### 4. Backend Authentication Middleware: Vrata Sigurnosti

Na backend strani, middleware verifikuje JWT token:

```typescript
// backend/src/middleware/authMiddleware.ts

export const authenticate = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Izvlačenje tokena iz Authorization header-a
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      res.status(401).json({ error: 'No authentication token provided' });
      return;
    }

    try {
      // Verifikacija tokena pomoću Firebase Admin SDK
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      // Dodavanje user informacija u request objekat
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
      };
      
      next(); // Nastavak ka route handler-u
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  }
);
```

---

## Profile Management - Korisnički Profil

### 👤 Priča o Profilu: Vaš TRADEY Identitet

Profile stranica je srce TRADEY iskustva - mesto gde korisnici grade svoj identitet u zajednici, upravljaju svojim objavama i prate svoju aktivnost. Ovo je prva stranica koju korisnici vide nakon login-a, i dizajnirana je da bude intuitivna i informativna.

### 1. Dashboard: Vaš TRADEY Command Center

Profile stranica prikazuje dashboard sa 4 kartice koje omogućavaju brz pristup svim glavnim funkcionalnostima:

```typescript
// frontend/src/pages/Profile.tsx

<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  {/* Stats Card - Prikazuje statistike */}
  <div className="bg-tradey-black text-white p-8">
    <div className="space-y-6">
      {/* Posts Count */}
      <div className="flex items-baseline justify-between">
        <span className="font-sans text-lg">Posts</span>
        <span className="font-fayte text-6xl">{posts.length}</span>
      </div>
      
      {/* Following Count - Link ka /following?tab=following */}
      <Link to="/following?tab=following">
        <div className="flex items-baseline justify-between">
          <span className="font-sans text-lg">Following</span>
          <span className="font-fayte text-6xl">
            {userProfile.following?.length || 0}
          </span>
        </div>
      </Link>
      
      {/* Followers Count - Link ka /following?tab=followers */}
      <Link to="/following?tab=followers">
        <div className="flex items-baseline justify-between">
          <span className="font-sans text-lg">Followers</span>
          <span className="font-fayte text-6xl">{followersCount}</span>
        </div>
      </Link>
    </div>
  </div>

  {/* Edit Profile Card */}
  <button onClick={() => setShowEditModal(true)}>
    {/* Edit ikonica i tekst */}
  </button>

  {/* Messages Card - Link ka /chat */}
  <Link to="/chat">
    {/* Messages ikonica i tekst */}
  </Link>

  {/* Liked Items Card - Link ka /liked */}
  <Link to="/liked">
    {/* Heart ikonica i tekst */}
  </Link>
</div>
```

### 2. Edit Profile: Transformacija Vašeg Identiteta

Klikom na "Edit" karticu, otvara se modal sa formom za izmenu profila:

```typescript
// frontend/src/pages/Profile.tsx

const handleProfileUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) return;

  setIsUpdating(true);
  try {
    // Kreiranje FormData objekta (podržava file upload)
    const formData = new FormData();
    formData.append('username', username);
    formData.append('bio', bio);
    formData.append('location', location);
    
    // Dodavanje avatara ako je izabran
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    // Slanje PUT zahteva
    await usersApi.update(user.uid, formData);
    
    showToast('Profile updated successfully!', 'success');
    setShowEditModal(false);
    refetch(); // Ponovno učitavanje profila
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || 
                        'Failed to update profile.';
    showToast(errorMessage, 'error');
  } finally {
    setIsUpdating(false);
  }
};
```

**Backend Update sa File Upload-om:**

```typescript
// backend/src/controllers/userController.ts

updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.uid;

  // Provera vlasništva
  if (id !== userId) {
    res.status(403).json({ 
      error: 'Forbidden: You can only update your own profile' 
    });
    return;
  }

  // Validacija podataka
  const validation = updateUserProfileSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({
      error: 'Validation failed',
      errors: validation.error.issues,
    });
    return;
  }

  // Upload novog avatara ako je prosleđen
  let avatarUrl = validation.data.avatarUrl;
  if (req.file) {
    try {
      // Brisanje starog avatara
      if (user.avatarUrl) {
        await storageService.deleteImage(user.avatarUrl);
      }
      
      // Upload novog avatara u Firebase Storage
      avatarUrl = await storageService.uploadAvatar(req.file, userId);
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  }

  // Update podataka u Firestore
  const updateData: any = { ...validation.data };
  if (avatarUrl) {
    updateData.avatarUrl = avatarUrl;
  }

  await firestoreService.updateDocument(
    COLLECTIONS.USERS, 
    id, 
    updateData
  );

  // Vraćanje ažuriranih podataka
  const updatedUser = await firestoreService.getDocument<UserProfile>(
    COLLECTIONS.USERS, 
    id
  );
  res.json(updatedUser);
});
```

### 3. My Items: Vaša Garderoba na Display-u

Ispod dashboard-a, prikazuju se sve objave korisnika:

```typescript
// frontend/src/pages/Profile.tsx

<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
  {posts.map((post) => (
    <ProductCard key={post.id} post={post} />
  ))}
</div>
```

**ProductCard Komponenta:**

```typescript
function ProductCard({ post }: { post: any }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/item/${post.id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="aspect-[3/4] relative overflow-hidden bg-gray-50 mb-3">
        <img
          src={post.images[0]}
          alt={post.title}
          className="w-full h-full object-cover transition-transform 
                     duration-700 ease-out group-hover:scale-105"
        />

        {/* SOLD oznaka ako nije dostupno */}
        {!post.isAvailable && (
          <div className="absolute inset-0 bg-white/80 
                          flex items-center justify-center">
            <span className="font-sans text-xs text-tradey-black/60">
              SOLD
            </span>
          </div>
        )}

        {/* Edit dugme na hover */}
        {isHovered && (
          <div className="absolute top-3 right-3 w-8 h-8 
                          flex items-center justify-center 
                          bg-white/90 backdrop-blur-sm">
            <svg className="w-4 h-4">...</svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h3 className="font-sans text-tradey-black text-sm font-medium">
          {post.title}
        </h3>
        <p className="font-sans text-tradey-black/50 text-xs">
          {post.brand}
        </p>
        <p className="font-sans text-tradey-black/60 text-xs">
          Size {post.size}
        </p>
      </div>
    </Link>
  );
}
```

---

## Chat Sistem - Real-time Komunikacija

### 💬 Priča o Komunikaciji: Kako TRADEY Povezuje Ljude

Chat sistem je srce TRADEY zajednice - mesto gde se dešavaju magični trenuci kada se ljudi povezuju oko zajedničke ljubavi prema modi. Dizajniran je da bude intuitivan, brz i pouzdan, omogućavajući korisnicima da komuniciraju u realnom vremenu.

### 1. Chat Lista: Vaš Inbox za Fashion Konverzacije

Na `/chat` strani, prikazuje se lista svih chat konverzacija:

```typescript
// frontend/src/hooks/useChats.ts

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        // GET /api/chats
        const response = await chatApi.getChats();
        setChats(response.data);
      } catch (err) {
        console.error('Failed to fetch chats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
    
    // Polling - osvežavanje svakih 5 sekundi
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, []);

  return { chats, loading };
}
```

**Backend - Dobijanje User Chats:**

```typescript
// backend/src/controllers/chatController.ts

getChats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.uid;

  // Query chats gde je korisnik učesnik
  const chats = await firestoreService.queryDocuments<Chat>(
    COLLECTIONS.CHATS,
    {
      filters: [['participants', 'array-contains', userId]],
      orderBy: { field: 'updatedAt', direction: 'desc' },
    }
  );

  res.json(chats);
});
```

### 2. Kreiranje Novog Chata: Contact Seller Magic

Kada korisnik klikne "Contact Seller" na ItemView strani, započinje se proces kreiranja konverzacije:

```typescript
// frontend/src/hooks/useCreateChat.ts

export function useCreateChat() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const createChat = async (participantId: string, initialMessage?: string) => {
    if (!participantId) return;

    setLoading(true);
    try {
      // POST /api/chats sa participantId
      const response = await chatApi.createChat(participantId);
      const chat = response.data;

      // Ako je prosleđena poruka, pošalji je
      if (initialMessage) {
        await chatApi.sendMessage(chat.id, initialMessage);
      }

      // Navigacija na chat stranicu
      navigate('/chat');
    } catch (error) {
      console.error('Failed to create chat:', error);
    } finally {
      setLoading(false);
    }
  };

  return { createChat, loading };
}
```

**Backend - Kreiranje Chata:**

```typescript
// backend/src/controllers/chatController.ts

createChat = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.uid;
  const validation = createChatSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      error: 'Validation failed',
      errors: validation.error.issues,
    });
    return;
  }

  const { participantId } = validation.data;

  // Provera da li pokušavamo kreirati chat sami sa sobom
  if (participantId === userId) {
    res.status(400).json({ 
      error: 'You cannot create a chat with yourself' 
    });
    return;
  }

  // Provera da li učesnik postoji
  const participantExists = await firestoreService.documentExists(
    COLLECTIONS.USERS, 
    participantId
  );
  if (!participantExists) {
    res.status(404).json({ error: 'Participant not found' });
    return;
  }

  // Provera da li chat već postoji između ova dva korisnika
  const existingChats = await firestoreService.queryDocuments<Chat>(
    COLLECTIONS.CHATS,
    {
      filters: [['participants', 'array-contains', userId]],
    }
  );

  const existingChat = existingChats.find(chat =>
    chat.participants.includes(participantId) && 
    chat.participants.length === 2
  );

  // Ako postoji, vrati postojeći chat
  if (existingChat) {
    res.json(existingChat);
    return;
  }

  // Kreiranje novog chata
  const newChat = {
    participants: [userId, participantId],
    lastMessage: '',
    lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const createdChat = await firestoreService.createDocument(
    COLLECTIONS.CHATS, 
    newChat
  );

  res.status(201).json(createdChat);
});
```

### 3. Prikazivanje Poruka: Real-time Konverzacija

Kada korisnik izabere chat, prikazuju se poruke:

```typescript
// frontend/src/hooks/useChatMessages.ts

export function useChatMessages(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!chatId) return;

    setLoading(true);
    try {
      // GET /api/chats/:chatId/messages
      const response = await chatApi.getMessages(chatId, { limit: 50 });
      
      // Poruke dolaze u desc order (najnovije prvo)
      // Obrnemo ih da najstarije budu na vrhu
      const sortedMessages = response.data.messages.reverse();
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    fetchMessages();
    
    // Polling - svake 2 sekunde proveri nove poruke
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const sendMessage = async (text: string): Promise<boolean> => {
    if (!chatId || !text.trim()) return false;

    try {
      // POST /api/chats/:chatId/messages
      await chatApi.sendMessage(chatId, text.trim());
      
      // Odmah učitaj nove poruke
      await fetchMessages();
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  };

  return { 
    messages, 
    loading, 
    sendMessage, 
    fetchMessages 
  };
}
```

### 4. Slanje Poruka: Backend Magic

```typescript
// backend/src/controllers/chatController.ts

sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { chatId } = req.params;
  const userId = req.user!.uid;

  // Validacija teksta poruke
  const validation = sendMessageSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({
      error: 'Validation failed',
      errors: validation.error.issues,
    });
    return;
  }

  const { text } = validation.data;

  // Kreiranje poruke u subcollection
  const newMessage = {
    chatId,
    senderId: userId,
    text,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    readBy: [userId], // Pošiljalac je pročitao poruku
  };

  const messageRef = await db
    .collection(COLLECTIONS.CHATS)
    .doc(chatId)
    .collection(COLLECTIONS.MESSAGES)
    .add(newMessage);

  // Update chat dokumenta sa zadnjom porukom
  await firestoreService.updateDocument(COLLECTIONS.CHATS, chatId, {
    lastMessage: text,
    lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Vraćanje kreirane poruke
  const messageDoc = await messageRef.get();
  const message = {
    id: messageDoc.id,
    ...messageDoc.data(),
  };

  res.status(201).json(message);
});
```

---

## Post Management - Kreiranje i Upravljanje Objavama

### 📸 Priča o Objavama: Kako TRADEY Oživljava Garderobu

Post Management sistem je srce TRADEY platforme - mesto gde korisnici transformišu svoju garderobu u digitalne objave koje mogu da dele sa celim svetom. Svaka objava je priča o komadu odeće, njegovoj istoriji i potencijalu za novu životnu priču.

### 1. Kreiranje Nove Objave: Od Garderobe do Digitalne Priče

Kada korisnik klikne "New Post" dugme, vodi se na `/post/new` stranicu sa formom za kreiranje objave:

```typescript
// frontend/src/pages/NewPost.tsx

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) return;

  setIsSubmitting(true);
  try {
    // Kreiranje FormData objekta za slanje slika i teksta
    const formData = new FormData();
    
    // Dodavanje tekstualnih polja
    formData.append('title', title);
    formData.append('description', description);
    formData.append('brand', brand);
    formData.append('size', size);
    formData.append('condition', condition);
    formData.append('type', type);
    formData.append('style', style);
    
    // Dodavanje trade preferences ako postoje
    if (tradePreferences) {
      formData.append('tradePreferences', tradePreferences);
    }

    // Dodavanje slika (maksimalno 5)
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    // POST zahtev ka backend-u
    const response = await postsApi.create(formData);
    
    showToast('Post created successfully!', 'success');
    navigate(`/item/${response.data.id}`);
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || 
                        'Failed to create post.';
    showToast(errorMessage, 'error');
  } finally {
    setIsSubmitting(false);
  }
};
```

**Backend - Kreiranje Post-a:**

```typescript
// backend/src/controllers/postController.ts

createPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.uid;

  // Validacija podataka (bez slika)
  const bodySchema = createPostSchema.omit({ images: true });
  const validation = bodySchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      error: 'Validation failed',
      errors: validation.error.issues,
    });
    return;
  }

  // Dobijanje user podataka za author info
  const userDoc = await firestoreService.getDocument<any>(
    COLLECTIONS.USERS, 
    userId
  );
  if (!userDoc) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  // Upload slika u Firebase Storage
  let imageUrls: string[] = [];
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    if (req.files.length > 5) {
      res.status(400).json({ error: 'Maximum 5 images allowed' });
      return;
    }
    
    try {
      imageUrls = await storageService.uploadImages(
        req.files as Express.Multer.File[], 
        userId
      );
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload images' });
      return;
    }
  } else {
    res.status(400).json({ error: 'At least one image is required' });
    return;
  }

  // Kreiranje post dokumenta
  const newPost = {
    ...validation.data,
    images: imageUrls,
    authorId: userId,
    authorUsername: userDoc.username,
    authorLocation: userDoc.location,
    isAvailable: true,
    createdAt: new Date(),
  };

  const createdPost = await firestoreService.createDocument(
    COLLECTIONS.POSTS, 
    newPost
  );

  res.status(201).json(createdPost);
});
```

### 2. Edit Post: Transformacija Objave

Kada korisnik klikne "Edit Post" na ItemView strani, vodi se na `/edit-post/:id`:

```typescript
// frontend/src/pages/EditPost.tsx

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!post || !user) return;

  setIsSubmitting(true);
  try {
    const formData = new FormData();
    
    // Dodavanje tekstualnih polja
    formData.append('title', title);
    formData.append('description', description);
    formData.append('brand', brand);
    formData.append('size', size);
    formData.append('condition', condition);
    formData.append('type', type);
    formData.append('style', style);
    
    if (tradePreferences) {
      formData.append('tradePreferences', tradePreferences);
    }

    // Dodavanje postojećih slika kao JSON string
    formData.append('images', JSON.stringify(existingImages));

    // Dodavanje novih slika ako postoje
    if (newImages.length > 0) {
      newImages.forEach((image) => {
        formData.append('images', image);
      });
    }

    // PUT zahtev za update
    await postsApi.update(post.id, formData);
    
    showToast('Post updated successfully!', 'success');
    navigate(`/item/${post.id}`);
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || 
                        'Failed to update post.';
    showToast(errorMessage, 'error');
  } finally {
    setIsSubmitting(false);
  }
};
```

### 3. Delete Post: Brisanje Objave

```typescript
// frontend/src/pages/ItemView.tsx

const handleDelete = async () => {
  if (!id) return;
  setDeleteLoading(true);
  
  try {
    // DELETE zahtev
    await postsApi.delete(id);
    navigate('/profile');
  } catch (error) {
    console.error('Error deleting post:', error);
    alert('Failed to delete post. Please try again.');
  } finally {
    setDeleteLoading(false);
    setShowDeleteModal(false);
  }
};
```

**Backend - Brisanje Post-a:**

```typescript
// backend/src/controllers/postController.ts

deletePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.uid;

  // Provera da li post postoji
  const post = await firestoreService.getDocument<Post>(
    COLLECTIONS.POSTS, 
    id
  );
  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  // Provera vlasništva
  if (post.authorId !== userId) {
    res.status(403).json({ 
      error: 'Forbidden: You can only delete your own posts' 
    });
    return;
  }

  // Brisanje slika sa Storage-a
  if (post.images && post.images.length > 0) {
    try {
      await storageService.deleteImages(post.images);
    } catch (error) {
      console.error('Error deleting images:', error);
    }
  }

  // Brisanje post dokumenta
  await firestoreService.deleteDocument(COLLECTIONS.POSTS, id);

  res.json({ message: 'Post deleted successfully' });
});
```

---

## Marketplace - Pretraga i Filtriranje

### 🛍️ Priča o Marketplace-u: TRADEY's Digitalni Shopping Mall

Marketplace stranica (`/marketplace`) je TRADEY's digitalni shopping mall - mesto gde se dešavaju magični trenuci kada korisnici pronalaze savršeni komad garderobe. Dizajniran je da bude intuitivan, brz i efikasan, omogućavajući korisnicima da brzo pronađu ono što traže.

### 1. Marketplace Hook: Upravljanje Stanjem Pretrage

```typescript
// frontend/src/hooks/useMarketplace.ts

export function useMarketplace() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Filteri
  const [filters, setFilters] = useState({
    search: '',
    size: undefined as string | undefined,
    condition: undefined as string | undefined,
    style: undefined as string | undefined,
  });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      // API poziv sa filterima
      const response = await postsApi.getAll({
        q: filters.search || undefined,
        size: filters.size,
        condition: filters.condition,
        style: filters.style,
        limit: 20,
      });

      setPosts(response.data);
      setTotalResults(response.data.length);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Resetuj stranicu kada se promene filteri
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      size: undefined,
      condition: undefined,
      style: undefined,
    });
    setPage(1);
  };

  return {
    posts,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    page,
    setPage,
    totalPages,
    totalResults,
    refetch: fetchPosts,
  };
}
```

### 2. Marketplace Page: UI Komponenta

```typescript
// frontend/src/pages/Marketplace.tsx

export function MarketplacePage() {
  const {
    posts,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    totalResults,
  } = useMarketplace();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-tradey-red font-sans text-lg">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-fayte text-7xl md:text-9xl text-tradey-black 
                         mb-2 tracking-tight uppercase">
            SHOP
          </h1>
        </div>

        {/* Filteri */}
        <div className="mb-10 pb-6 border-b border-tradey-black/10">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="flex-1 min-w-[200px] px-4 py-2 border border-tradey-black/20 
                         rounded-none text-tradey-black font-sans text-sm 
                         placeholder:text-tradey-black/40 focus:outline-none 
                         focus:border-tradey-red transition-colors bg-white"
            />

            {/* Size Filter */}
            <select
              value={filters.size || ''}
              onChange={(e) => updateFilters({ size: e.target.value || undefined })}
              className="px-4 py-2 border border-tradey-black/20 rounded-none 
                         text-tradey-black font-sans text-sm focus:outline-none 
                         focus:border-tradey-red transition-colors bg-white cursor-pointer"
            >
              <option value="">All Sizes</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>

            {/* Condition Filter */}
            <select
              value={filters.condition || ''}
              onChange={(e) => updateFilters({ 
                condition: e.target.value as ClothingCondition || undefined 
              })}
              className="px-4 py-2 border border-tradey-black/20 rounded-none 
                         text-tradey-black font-sans text-sm focus:outline-none 
                         focus:border-tradey-red transition-colors bg-white cursor-pointer"
            >
              <option value="">All Conditions</option>
              {Object.entries(ClothingConditions).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>

            {/* Style Filter */}
            <select
              value={filters.style || ''}
              onChange={(e) => updateFilters({ style: e.target.value || undefined })}
              className="px-4 py-2 border border-tradey-black/20 rounded-none 
                         text-tradey-black font-sans text-sm focus:outline-none 
                         focus:border-tradey-red transition-colors bg-white cursor-pointer"
            >
              <option value="">All Styles</option>
              {CLOTHING_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            {(filters.search || filters.size || filters.condition || filters.style) && (
              <button
                onClick={resetFilters}
                className="text-tradey-red font-sans text-sm hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {/* Results count */}
          {(filters.search || filters.size || filters.condition || filters.style) && (
            <p className="text-tradey-black/60 font-sans text-sm mt-4">
              {totalResults} {totalResults === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>

        {/* Product Grid */}
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="font-sans text-tradey-black/40 text-lg mb-4">
              No items found
            </p>
            {(filters.search || filters.size || filters.condition || filters.style) && (
              <button
                onClick={resetFilters}
                className="px-6 py-2 border border-tradey-black text-tradey-black 
                           font-sans text-sm hover:bg-tradey-black hover:text-white 
                           transition-all"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {posts.map((post) => (
              <ProductCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
```

### 3. Backend - Dobijanje Posts sa Filterima

```typescript
// backend/src/controllers/postController.ts

getPosts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { q, tag, creator, limit = 20, condition, size } = req.query;

  const filters: Array<[string, FirebaseFirestore.WhereFilterOp, any]> = [];

  // Filter po kreatoru
  if (creator) {
    filters.push(['authorId', '==', creator as string]);
  }

  // Filter po stanju
  if (condition) {
    filters.push(['condition', '==', condition as string]);
  }

  // Filter po veličini
  if (size) {
    filters.push(['size', '==', size as string]);
  }

  // Filter po dostupnosti
  filters.push(['isAvailable', '==', true]);

  // Query posts iz Firestore
  const posts = await firestoreService.queryDocuments<Post>(
    COLLECTIONS.POSTS,
    {
      filters,
      orderBy: { field: 'createdAt', direction: 'desc' },
      limit: Number(limit),
    }
  );

  // Client-side search filter za query (title, description, brand)
  let filteredPosts = posts;
  if (q) {
    const searchQuery = (q as string).toLowerCase();
    filteredPosts = posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery) ||
      post.description.toLowerCase().includes(searchQuery) ||
      post.brand.toLowerCase().includes(searchQuery)
    );
  }

  // Dodavanje default vrednosti za backward compatibility
  const postsWithDefaults = filteredPosts.map(post => ({
    ...post,
    type: post.type || 'T-Shirt',
    style: post.style || 'Casual',
  }));

  res.json(postsWithDefaults);
});
```

---

## ItemView - Detaljan Pregled Proizvoda

### 🔍 Priča o ItemView-u: Kada Garderoba Postane Priča

ItemView stranica (`/item/:id`) je mesto gde se dešavaju magični trenuci kada komad garderobe postane priča. Ovo je stranica gde korisnici mogu da vide sve detalje o proizvodu, kontaktiraju prodavca i pronađu slične proizvode.

### 1. Učitavanje Post Podataka

```typescript
// frontend/src/hooks/usePost.ts

export function usePost(postId: string | undefined) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    if (!postId) return;

    setLoading(true);
    try {
      // GET /api/posts/:id
      const response = await postsApi.getById(postId);
      setPost(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load post');
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return { post, loading, error, refetch: fetchPost };
}
```

### 2. ItemView Page: Glavna Komponenta

```typescript
// frontend/src/pages/ItemView.tsx

export function ItemViewPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { post, loading } = usePost(id);
  const { createChat, loading: chatLoading } = useCreateChat();
  const { toggleLike } = useLikePost();
  const { allPosts } = useMarketplace();
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch seller's profile za avatar
  const { userProfile: sellerProfile } = useUserProfile(post?.authorId);

  // Fetch current user's profile za lajkovanje
  const { userProfile: currentUserProfile, refetch: refetchCurrentUser } = 
    useUserProfile(user?.uid);

  // Provera da li je post lajkovan
  const isLiked = currentUserProfile?.likedPosts?.includes(id || '') || false;

  // Slični proizvodi (isti autor ili slična veličina/stanje)
  const relatedProducts = useMemo(() => {
    if (!post) return [];
    return allPosts
      .filter(
        (p) =>
          p.id !== post.id &&
          (p.authorId === post.authorId || 
           p.size === post.size || 
           p.condition === post.condition)
      )
      .slice(0, 4);
  }, [post, allPosts]);

  const handleContactSeller = async () => {
    if (!post || !user) return;
    const message = `Hey, I'm interested in "${post.title}". Can we discuss a trade?`;
    await createChat(post.authorId, message);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post?.title,
          text: `Check out this item: ${post?.title}`,
          url: window.location.href,
        })
        .catch(() => setShowShareModal(true));
    } else {
      setShowShareModal(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="font-fayte text-2xl text-tradey-red mb-4">
          Item not found
        </h2>
        <Link to="/marketplace" className="text-tradey-blue hover:underline">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const images = post.images || [];
  const currentMainImage = mainImage || images[0];
  const isOwnPost = user?.uid === post.authorId;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm font-sans text-tradey-black">
        <Link to="/marketplace" className="hover:text-tradey-red transition-colors">
          Marketplace
        </Link>
        <span>/</span>
        <span className="text-tradey-black/60">{post.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="aspect-[3/4] bg-gray-100 mb-4 overflow-hidden relative">
            <img
              src={currentMainImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            {!post.isAvailable && (
              <div className="absolute inset-0 bg-tradey-black/70 
                              flex items-center justify-center">
                <span className="font-fayte text-tradey-white text-2xl 
                                 px-6 py-3 bg-tradey-red">
                  TRADED
                </span>
              </div>
            )}
          </div>
          
          {/* Thumbnail slike */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setMainImage(img)}
                className={`flex-shrink-0 w-20 h-20 overflow-hidden border-2 
                           transition-all ${
                  img === currentMainImage
                    ? 'border-tradey-red'
                    : 'border-tradey-black/20 hover:border-tradey-red/60'
                }`}
              >
                <img 
                  src={img} 
                  alt={`${post.title} ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Post Details */}
        <div className="bg-white p-8 shadow-sm border border-tradey-black/10">
          {/* Title & Brand */}
          <div className="mb-6">
            <h1 className="font-fayte text-4xl md:text-5xl text-tradey-black 
                           mb-2 uppercase">
              {post.title}
            </h1>
            <p className="font-sans text-2xl text-tradey-black/60">{post.brand}</p>
          </div>

          <hr className="border-tradey-black/10 my-6" />

          {/* Details Grid */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center py-2 
                           border-b border-tradey-black/5">
              <span className="font-sans text-tradey-black/60 font-medium">
                Condition:
              </span>
              <span className="font-sans text-tradey-black font-semibold">
                {ClothingConditions[post.condition as keyof typeof ClothingConditions]}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 
                           border-b border-tradey-black/5">
              <span className="font-sans text-tradey-black/60 font-medium">Size:</span>
              <span className="font-sans text-tradey-black font-semibold">
                {post.size}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 
                           border-b border-tradey-black/5">
              <span className="font-sans text-tradey-black/60 font-medium">
                Location:
              </span>
              <span className="font-sans text-tradey-black font-semibold">
                {post.authorLocation}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 
                           border-b border-tradey-black/5">
              <span className="font-sans text-tradey-black/60 font-medium">Seller:</span>
              <Link
                to={`/user/${post.authorId}`}
                className="flex items-center gap-2 font-sans text-tradey-red 
                           font-semibold hover:underline transition-colors"
              >
                {/* Seller Avatar */}
                <div className="w-8 h-8 rounded-full bg-tradey-black/10 
                               flex-shrink-0 overflow-hidden">
                  {sellerProfile?.avatarUrl ? (
                    <img
                      src={sellerProfile.avatarUrl}
                      alt={post.authorUsername}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center 
                                   bg-tradey-red/10">
                      <span className="font-fayte text-xs text-tradey-red">
                        {post.authorUsername.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                @{post.authorUsername}
              </Link>
            </div>
          </div>

          <hr className="border-tradey-black/10 my-6" />

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-sans text-tradey-black font-semibold text-lg mb-3">
              Description
            </h3>
            <p className="font-sans text-tradey-black/70 whitespace-pre-wrap 
                         leading-relaxed">
              {post.description}
            </p>
          </div>

          {/* Trade Preferences */}
          {post.tradePreferences && (
            <div className="mb-6 bg-tradey-red/5 p-4 border border-tradey-red/20">
              <h3 className="font-sans text-tradey-red font-semibold text-sm mb-2">
                Would NOT trade for:
              </h3>
              <p className="font-sans text-tradey-black/70">
                {post.tradePreferences}
              </p>
            </div>
          )}

          <hr className="border-tradey-black/10 my-6" />

          {/* Actions */}
          <div className="space-y-3">
            {/* Owner Actions - Edit & Delete */}
            {isOwnPost && (
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/edit-post/${id}`)}
                  className="flex-1 px-6 py-4 bg-tradey-black text-white 
                             font-sans text-base font-semibold hover:opacity-90 
                             transition-opacity"
                >
                  Edit Post
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex-1 px-6 py-4 border-2 border-tradey-red 
                             text-tradey-red font-sans text-base font-semibold 
                             hover:bg-tradey-red hover:text-white transition-colors"
                >
                  Delete Post
                </button>
              </div>
            )}

            {/* Contact Seller (za non-owners) */}
            {!isOwnPost && post.isAvailable && user && (
              <button
                onClick={handleContactSeller}
                disabled={chatLoading}
                className="w-full px-6 py-4 bg-tradey-red text-white 
                           font-sans text-base font-semibold hover:opacity-90 
                           transition-opacity disabled:opacity-50"
              >
                {chatLoading ? 'Starting conversation...' : 'Contact Seller'}
              </button>
            )}

            {!user && (
              <Link
                to="/login"
                className="block w-full px-6 py-4 bg-tradey-red text-white 
                           font-sans text-base font-semibold hover:opacity-90 
                           transition-opacity text-center"
              >
                Login to Contact Seller
              </Link>
            )}

            <div className="flex gap-3">
              {/* Like dugme */}
              {user && id && !isOwnPost && (
                <button
                  onClick={async () => {
                    const success = await toggleLike(id);
                    if (success) {
                      refetchCurrentUser();
                    }
                  }}
                  className={`flex-1 px-6 py-3 border-2 ${
                    isLiked
                      ? 'border-tradey-red bg-tradey-red/10 text-tradey-red'
                      : 'border-tradey-black/20 text-tradey-black hover:border-tradey-red hover:text-tradey-red'
                  } font-sans font-semibold hover:bg-tradey-red/5 
                    transition-colors flex items-center justify-center gap-2`}
                >
                  <svg
                    className={`w-5 h-5 ${isLiked ? 'fill-tradey-red' : 'fill-none'}`}
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {isLiked ? 'Liked' : 'Like'}
                </button>
              )}

              {/* Share dugme */}
              <button
                onClick={handleShare}
                className="px-6 py-3 border-2 border-tradey-black/20 
                           text-tradey-black hover:border-tradey-black 
                           font-sans font-semibold hover:bg-tradey-black/5 
                           transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" 
                     strokeWidth={2} viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="font-fayte text-3xl text-tradey-black mb-8 uppercase">
            More like this
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedPost) => (
              <Link key={relatedPost.id} to={`/item/${relatedPost.id}`} className="group">
                <div className="bg-tradey-white rounded-lg overflow-hidden 
                               shadow-lg hover:shadow-2xl transition-shadow">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={relatedPost.images[0]}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover 
                                 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-sans text-tradey-black text-lg truncate">
                      {relatedPost.title}
                    </h3>
                    <p className="font-sans text-tradey-black/60 text-sm">
                      {relatedPost.brand}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Social Features - Praćenje i Interakcija

### 👥 Priča o Društvenim Funkcijama: Kako TRADEY Gradi Zajednicu

Social features su srce TRADEY zajednice - omogućavaju korisnicima da prate druge korisnike, lajkuju objave i grade veze sa ljudima koji dele njihovu ljubav prema modi. Ovo je ono što čini TRADEY više od aplikacije - to je zajednica.

### 1. Follow/Unfollow Funkcionalnost

```typescript
// frontend/src/hooks/useFollowUser.ts

export function useFollowUser() {
  const [loading, setLoading] = useState(false);

  const toggleFollow = async (userId: string): Promise<boolean> => {
    setLoading(true);
    try {
      // POST /api/users/:id/follow
      const response = await usersApi.toggleFollow(userId);
      return response.data.following;
    } catch (error) {
      console.error('Failed to toggle follow:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { toggleFollow, loading };
}
```

**Backend - Follow/Unfollow Logic:**

```typescript
// backend/src/controllers/userController.ts

toggleFollow = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params; // User to follow/unfollow
  const userId = req.user!.uid; // Current user

  // Prevencija self-follow
  if (id === userId) {
    res.status(400).json({ error: 'You cannot follow yourself' });
    return;
  }

  // Provera da li target user postoji
  const targetUserExists = await firestoreService.documentExists(
    COLLECTIONS.USERS, 
    id
  );
  if (!targetUserExists) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  // Dobijanje trenutnog korisnika
  const currentUser = await firestoreService.getDocument<UserProfile>(
    COLLECTIONS.USERS, 
    userId
  );
  const following = (currentUser?.following as string[]) || [];

  // Toggle follow
  if (following.includes(id)) {
    // Unfollow - uklanjanje iz following liste
    await firestoreService.arrayRemove(
      COLLECTIONS.USERS, 
      userId, 
      'following', 
      id
    );
    res.json({ following: false });
  } else {
    // Follow - dodavanje u following listu
    await firestoreService.arrayUnion(
      COLLECTIONS.USERS, 
      userId, 
      'following', 
      id
    );
    res.json({ following: true });
  }
});
```

### 2. Like/Unlike Funkcionalnost

```typescript
// frontend/src/hooks/useLikePost.ts

export function useLikePost() {
  const [loading, setLoading] = useState(false);

  const toggleLike = async (postId: string): Promise<boolean> => {
    setLoading(true);
    try {
      // POST /api/posts/:id/like
      const response = await postsApi.toggleLike(postId);
      return response.data.liked;
    } catch (error) {
      console.error('Failed to toggle like:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { toggleLike, loading };
}
```

**Backend - Like/Unlike Logic:**

```typescript
// backend/src/controllers/postController.ts

toggleLike = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.uid;

  // Provera da li post postoji
  const postExists = await firestoreService.documentExists(
    COLLECTIONS.POSTS, 
    id
  );
  if (!postExists) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  // Dobijanje korisnika
  const user = await firestoreService.getDocument<any>(
    COLLECTIONS.USERS, 
    userId
  );
  const likedPosts = (user?.likedPosts as string[]) || [];

  // Toggle like
  if (likedPosts.includes(id)) {
    // Unlike - uklanjanje iz likedPosts liste
    await firestoreService.arrayRemove(
      COLLECTIONS.USERS, 
      userId, 
      'likedPosts', 
      id
    );
    res.json({ liked: false });
  } else {
    // Like - dodavanje u likedPosts listu
    await firestoreService.arrayUnion(
      COLLECTIONS.USERS, 
      userId, 
      'likedPosts', 
      id
    );
    res.json({ liked: true });
  }
});
```

### 3. Following/Followers Lista

```typescript
// frontend/src/hooks/useFollowing.ts

export function useFollowing(userId: string | undefined) {
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowing = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        // GET /api/users/:id/following
        const response = await usersApi.getFollowing(userId);
        setFollowing(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load following');
        setFollowing([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, [userId]);

  return { following, loading, error };
}
```

**Backend - Dobijanje Following Liste:**

```typescript
// backend/src/controllers/userController.ts

getFollowing = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const user = await firestoreService.getDocument<UserProfile>(
    COLLECTIONS.USERS, 
    id
  );
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const following = (user.following as string[]) || [];

  // Fetch full user profiles za following listu
  const followingUsers = await Promise.all(
    following.map(async (userId) => {
      const followedUser = await firestoreService.getDocument<UserProfile>(
        COLLECTIONS.USERS, 
        userId
      );
      if (followedUser) {
        return {
          uid: followedUser.uid,
          username: followedUser.username,
          avatarUrl: followedUser.avatarUrl,
          location: followedUser.location,
        };
      }
      return null;
    })
  );

  // Filter out null values
  const validFollowingUsers = followingUsers.filter(user => user !== null);

  res.json(validFollowingUsers);
});
```

**Backend - Dobijanje Followers Liste:**

```typescript
// backend/src/controllers/userController.ts

getFollowers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  // Provera da li target user postoji
  const targetUser = await firestoreService.getDocument<UserProfile>(
    COLLECTIONS.USERS, 
    id
  );
  if (!targetUser) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  // Query svih korisnika gde following array sadrži ovaj user ID
  const allUsers = await firestoreService.queryDocuments<UserProfile>(
    COLLECTIONS.USERS,
    {
      filters: [['following', 'array-contains', id]],
    }
  );

  // Return simplified user data
  const followers = allUsers.map(user => ({
    uid: user.uid,
    username: user.username,
    avatarUrl: user.avatarUrl,
    location: user.location,
  }));

  res.json(followers);
});
```

### 4. Liked Posts Stranica

```typescript
// frontend/src/hooks/useLikedPosts.ts

export function useLikedPosts(userId: string | undefined) {
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        // GET /api/users/:id/liked
        const response = await usersApi.getLikedPosts(userId);
        setLikedPosts(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load liked posts');
        setLikedPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedPosts();
  }, [userId]);

  return { likedPosts, loading, error };
}
```

**Backend - Dobijanje Liked Posts:**

```typescript
// backend/src/controllers/userController.ts

getLikedPosts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.uid;

  // Provera vlasništva
  if (id !== userId) {
    res.status(403).json({ 
      error: 'Forbidden: You can only view your own liked posts' 
    });
    return;
  }

  const user = await firestoreService.getDocument<UserProfile>(
    COLLECTIONS.USERS, 
    id
  );
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const likedPosts = (user.likedPosts as string[]) || [];

  // Fetch full post data za liked posts
  const posts = await Promise.all(
    likedPosts.map(async (postId) => {
      return await firestoreService.getDocument(COLLECTIONS.POSTS, postId);
    })
  );

  // Filter out null values (deleted posts)
  const validPosts = posts.filter(post => post !== null);

  res.json(validPosts);
});
```

---

## Backend API Arhitektura

### 🏗️ Priča o Backend-u: Kako TRADEY Radi Iza Scene

Backend je organizovan u modularnu arhitekturu sa jasnim odvajanjem odgovornosti. Svaki deo ima svoju ulogu u stvaranju robustnog i skalabilnog sistema koji može da podrži hiljade korisnika.

### 1. Server Setup i Middleware: Temelj Sistema

```typescript
// backend/src/server.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import { corsOptions } from './config/cors';

// Load environment variables
dotenv.config();

// Import Firebase Admin to initialize it
import './config/firebaseAdmin';

// Create Express app
const app = express();

// Port fallback logic - pokušava više portova
const PORTS = [
  parseInt(process.env.PORT || '5000'),
  5000, 5001, 5002, 5003
];

/**
 * Middleware Setup
 */

// CORS
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting za API routes
app.use('/api', apiLimiter);

/**
 * Routes
 */

// API routes (sve rute su prefiksovane sa /api)
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'TRADEY Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      posts: '/api/posts',
      users: '/api/users',
      chats: '/api/chats',
    },
    docs: 'See /docs/API.md for full documentation',
  });
});

/**
 * Error Handling
 */

// 404 handler
app.use(notFoundHandler);

// Global error handler (mora biti poslednji)
app.use(errorHandler);

/**
 * Start Server sa Port Fallback
 */

const tryPort = (portIndex: number = 0): void => {
  if (portIndex >= PORTS.length) {
    console.error('❌ All ports are in use! Please free up a port or kill existing processes.');
    process.exit(1);
    return;
  }

  const PORT = PORTS[portIndex];

  const server = app.listen(PORT)
    .on('listening', () => {
      console.log('='.repeat(50));
      console.log(`🚀 TRADEY Backend API is running`);
      console.log(`📍 Server: http://localhost:${PORT}`);
      console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⚡ CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
      if (portIndex > 0) {
        console.log(`⚠️  Using fallback port ${PORT} (default port was in use)`);
      }
      console.log('='.repeat(50));
    })
    .on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️  Port ${PORT} is in use, trying next port...`);
        server.close();
        tryPort(portIndex + 1);
      } else {
        console.error('❌ Server error:', err);
        process.exit(1);
      }
    });
};

tryPort();
```

### 2. Routes Organizacija: Organizovana Struktura

```typescript
// backend/src/routes/index.ts

import express from 'express';
import userRoutes from './users.routes';
import postRoutes from './posts.routes';
import chatRoutes from './chat.routes';
import healthRoutes from './health';

const router = express.Router();

// Health check
router.use('/health', healthRoutes);

// API routes
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/chats', chatRoutes);

export default router;
```

### 3. Firestore Service: Abstrakcija za Database Operacije

```typescript
// backend/src/services/firestore.service.ts

import { db } from '../config/firebaseAdmin';
import admin from 'firebase-admin';

class FirestoreService {
  /**
   * Kreiranje dokumenta sa auto-generated ID
   */
  async createDocument<T>(
    collection: string, 
    data: T
  ): Promise<T & { id: string }> {
    const docRef = await db.collection(collection).add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      id: docRef.id,
      ...data,
    } as T & { id: string };
  }

  /**
   * Dobijanje dokumenta po ID-u
   */
  async getDocument<T>(collection: string, id: string): Promise<T | null> {
    const doc = await db.collection(collection).doc(id).get();
    
    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as T;
  }

  /**
   * Update dokumenta
   */
  async updateDocument<T>(
    collection: string, 
    id: string, 
    data: Partial<T>
  ): Promise<void> {
    await db.collection(collection).doc(id).update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  /**
   * Brisanje dokumenta
   */
  async deleteDocument(collection: string, id: string): Promise<void> {
    await db.collection(collection).doc(id).delete();
  }

  /**
   * Query dokumenta sa filterima
   */
  async queryDocuments<T>(
    collection: string,
    options: {
      filters?: Array<[string, FirebaseFirestore.WhereFilterOp, any]>;
      orderBy?: { field: string; direction: 'asc' | 'desc' };
      limit?: number;
    }
  ): Promise<(T & { id: string })[]> {
    let query: FirebaseFirestore.Query = db.collection(collection);

    // Apply filters
    if (options.filters) {
      options.filters.forEach(([field, operator, value]) => {
        query = query.where(field, operator, value);
      });
    }

    // Apply ordering
    if (options.orderBy) {
      query = query.orderBy(
        options.orderBy.field, 
        options.orderBy.direction
      );
    }

    // Apply limit
    if (options.limit) {
      query = query.limit(options.limit);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as (T & { id: string })[];
  }

  /**
   * Provera da li dokument postoji
   */
  async documentExists(collection: string, id: string): Promise<boolean> {
    const doc = await db.collection(collection).doc(id).get();
    return doc.exists;
  }

  /**
   * Dodavanje elementa u array field
   */
  async arrayUnion(
    collection: string, 
    id: string, 
    field: string, 
    value: any
  ): Promise<void> {
    await db.collection(collection).doc(id).update({
      [field]: admin.firestore.FieldValue.arrayUnion(value),
    });
  }

  /**
   * Uklanjanje elementa iz array field
   */
  async arrayRemove(
    collection: string, 
    id: string, 
    field: string, 
    value: any
  ): Promise<void> {
    await db.collection(collection).doc(id).update({
      [field]: admin.firestore.FieldValue.arrayRemove(value),
    });
  }
}

export default new FirestoreService();
```

### 4. Error Handling Middleware: Elegantno Rukovanje Greškama

```typescript
// backend/src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('❌ Error:', err);

  // Handle Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        error: 'File is too large. Maximum size is 5MB.',
      });
      return;
    }
    res.status(400).json({
      error: `File upload error: ${err.message}`,
    });
    return;
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    res.status(400).json({
      error: 'Validation failed',
      details: err.message,
    });
    return;
  }

  // Handle Firestore errors
  if (err.code) {
    res.status(500).json({
      error: 'Database error',
      details: err.message,
    });
    return;
  }

  // Default error
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
  });
};
```

### 5. Rate Limiting Middleware: Zaštita od Preopterećenja

```typescript
// backend/src/middleware/rateLimiter.ts

import rateLimit from 'express-rate-limit';

// API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuta
  max: 100, // maksimalno 100 zahteva po IP-u u 15 minuta
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter za auth routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuta
  max: 5, // maksimalno 5 pokušaja login-a po IP-u u 15 minuta
  message: {
    error: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
```

### 6. CORS Konfiguracija: Sigurna Komunikacija

```typescript
// backend/src/config/cors.ts

export const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.CORS_ORIGIN || 'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5174',
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

---

## 🎯 Zaključak: TRADEY - Više od Aplikacije

TRADEY je više od aplikacije - to je pokret koji transformiše način kako ljudi razmišljaju o modi. Kroz kombinaciju moderne tehnologije i intuitivnog dizajna, TRADEY omogućava korisnicima da grade zajednicu, dele svoju ljubav prema modi i stvaraju održive veze kroz razmenu garderobe.

**Ključne karakteristike:**
- **Sigurna autentifikacija** sa Firebase Auth i JWT tokenima
- **Real-time komunikacija** kroz chat sistem
- **Robustno upravljanje objavama** sa file upload funkcionalnostima
- **Intuitivna pretraga i filtriranje** u marketplace-u
- **Društvene funkcije** koje grade zajednicu
- **Skalabilna backend arhitektura** sa modularnim dizajnom

**Tehnološki stack:**
- **Frontend:** React 18, TypeScript, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js, TypeScript, Firebase Admin SDK
- **Database:** Firebase Firestore (NoSQL)
- **Storage:** Firebase Storage
- **Authentication:** Firebase Authentication
- **Deployment:** Docker & Docker Compose

TRADEY demonstrira kako moderna full-stack arhitektura može da stvori aplikaciju koja je ne samo funkcionalna, već i inspirativna - aplikaciju koja povezuje ljude i transformiše način kako razmišljamo o modi i održivosti.

---

*Dokumentacija je kompletna i pokriva sve ključne funkcionalnosti TRADEY aplikacije. Projekat demonstrira modernu full-stack arhitekturu sa React frontend-om, Express backend-om, Firebase servisima i Docker kontejnerizacijom.*