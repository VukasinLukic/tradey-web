📄 DOKUMENT 2: DATA MODEL & SCHEMA

Ovo je kritičan dokument - ovde definišemo šta živi u Firebase-u, šta na AI serveru, i kako se sve povezuje.



🗂️ FIREBASE COLLECTIONS (Source of Truth)

COLLECTION 1: users

json

{

  "userId": "user_abc123",

  "profile": {

    "displayName": "Marija",

    "avatarUrl": "https://...",

    "city": "Beograd",

    "gender": "female",

    "createdAt": "2025-01-14T10:00:00Z"

  },

  

  "preferences": {

    "sizes": ["S", "M"],

    "budgetMax": 5000,

    "interestedIn": ["female", "unisex"],

    "styles": ["casual", "streetwear"],  // iz kviza

    "favoriteColors": ["black", "white", "blue"]

  },

  

  "stats": {

    "totalSwipes": 145,

    "totalLikes": 42,

    "totalMatches": 8,

    "activeLastSeen": "2025-01-14T15:30:00Z"

  },

  

  "credits": {

    "available": 3,

    "plan": "free"  // free | premium | business

  }

}

Ključna polja za AI:

preferences.styles - početni stil iz kviza

stats.totalSwipes - da li je cold start ili ima podatke

preferences.sizes - hard filter



COLLECTION 2: items

json

{

  "itemId": "item_xyz789",

  "sellerId": "user_abc123",

  

  "details": {

    "category": "jakna",  // jakna | pantalone | majica | cipele | ...

    "gender": "female",   // male | female | unisex

    "size": "M",

    "condition": "kao_novo",  // novo | kao_novo | noseno | osteceno

    "location": "Beograd",

    "images": [

      "https://storage.../img1.jpg",

      "https://storage.../img2.jpg"

    ]

  },

  

  "listingType": "razmena",  // razmena | prodaja

  

  "aiGenerated": {

    "description": "Top kožna jakna, bukvalno kao nova 🖤 Nosila 2x max.",

    "detectedBrand": "Zara",  // null ako AI nije detektovao

    "detectedColor": "black",

    "detectedStyle": "casual",  // casual | formal | streetwear | vintage | ...

    "confidence": 0.87  // AI confidence score

  },

  

  "stats": {

    "totalViews": 234,

    "totalLikes": 18,

    "totalOffers": 3,  // za aukcije

    "createdAt": "2025-01-13T08:00:00Z",

    "status": "active"  // active | matched | removed

  }

}

Ključna polja za AI:

aiGenerated.detectedColor/Style - za stilsku sličnost

stats.totalLikes - za popularity score

details.size/gender/location - za hard filtering



COLLECTION 3: interactions

Ovo je NAJVAŽNIJA kolekcija za AI učenje.

json

{

  "interactionId": "int_001",

  "userId": "user_abc123",

  "itemId": "item_xyz789",

  

  "type": "swipe",  // swipe | offer | match | chat_opened

  

  "swipe": {

    "direction": "right",  // left | right

    "timestamp": "2025-01-14T15:45:12Z",

    "position": 23  // pozicija u feedu (koliko je scrollovala)

  },

  

  "context": {

    "session": "session_20250114_1545",

    "deviceType": "mobile",

    "feedRank": 5  // AI mu je dao ovo kao 5. po rangu

  }

}

Za offer/auction:

json

{

  "interactionId": "int_002",

  "userId": "user_abc123",

  "itemId": "item_xyz789",

  

  "type": "offer",

  

  "offer": {

    "amount": 2500,  // RSD

    "timestamp": "2025-01-14T16:00:00Z",

    "status": "pending"  // pending | accepted | rejected

  }

}

Za match:

json

{

  "interactionId": "int_003",

  "userId": "user_abc123",

  "itemId": "item_xyz789",

  

  "type": "match",

  

  "match": {

    "matchedWith": "user_def456",  // seller

    "timestamp": "2025-01-14T16:05:00Z",

    "chatOpened": true,

    "messagesCount": 0

  }

}



COLLECTION 4: matches

json

{

  "matchId": "match_001",

  "participants": ["user_abc123", "user_def456"],

  "itemId": "item_xyz789",

  

  "matchType": "mutual_like",  // mutual_like | offer_accepted

  

  "timeline": {

    "matchedAt": "2025-01-14T16:05:00Z",

    "chatOpenedAt": "2025-01-14T16:10:00Z",

    "lastMessageAt": "2025-01-14T17:30:00Z"

  },

  

  "outcome": {

    "completed": null,  // null | true | false

    "completedAt": null

  }

}



COLLECTION 5: auctions (opciono - možete i bez)

json

{

  "auctionId": "auction_001",

  "itemId": "item_xyz789",

  "sellerId": "user_abc123",

  

  "offers": [

    {

      "userId": "user_def456",

      "amount": 2500,

      "timestamp": "2025-01-14T16:00:00Z"

    },

    {

      "userId": "user_ghi789",

      "amount": 3000,

      "timestamp": "2025-01-14T16:15:00Z"

    }

  ],

  

  "status": "active",  // active | closed

  "winner": null

}



🤖 AI SERVER DATA (tvoj Python server)

FILE 1: embeddings.db (vector database)

Šta skladišti:

Image embeddings (512-dim vektori)

Text embeddings (384-dim vektori)

Format (SQLite ili Qdrant):

python

{

  "itemId": "item_xyz789",

  "imageEmbedding": [0.123, -0.456, 0.789, ...],  # 512 floats

  "textEmbedding": [0.234, -0.567, 0.891, ...],   # 384 floats

  "metadata": {

    "category": "jakna",

    "color": "black",

    "style": "casual"

  },

  "indexedAt": "2025-01-14T10:00:00Z"

}



FILE 2: user_profiles.json (AI cache)

Šta skladišti:

Computed style preferences

Personalization vectors

json

{

  "user_abc123": {

    "styleVector": [0.8, 0.2, 0.5, ...],  // learned preferences

    "preferredColors": {

      "black": 0.9,

      "white": 0.7,

      "blue": 0.4

    },

    "preferredCategories": {

      "jakna": 0.8,

      "pantalone": 0.3

    },

    "lastUpdated": "2025-01-14T15:00:00Z",

    "dataPoints": 42  // broj swipe-ova

  }

}

```



---



## 🔄 DATA FLOW (kako se sve povezuje)



### SCENARIO 1: Korisnik postavi oglas

```

1. Frontend → Firebase (items collection)

   {

     category: "jakna",

     size: "M",

     images: [blob1, blob2],

     ...

   }



2. Firebase Cloud Function → trigger

   "New item detected"



3. Cloud Function → AI Server API

   POST /api/process-item

   {

     itemId: "item_xyz789",

     imageUrl: "https://...",

     category: "jakna"

   }



4. AI Server:

   - Preuzme sliku

   - Generiše image embedding (CLIP)

   - Detektuje boju, stil, brend

   - Generiše opis teksta

   - Generiše text embedding

   - Skladišti u embeddings.db



5. AI Server → Firebase

   Update item with aiGenerated fields



6. Firebase → Frontend

   "Item je spreman za feed"

```



---



### SCENARIO 2: Korisnik otvori feed

```

1. Frontend → Backend API

   GET /api/feed?userId=user_abc123



2. Backend:

   - Proveri da li je cold start (< 30 swipe-ova)

   - Ako jeste → vrati najpopularnije + kviz match

   - Ako nije → pozovi AI server



3. Backend → AI Server

   POST /api/recommend

   {

     userId: "user_abc123",

     userPreferences: {...},

     recentSwipes: [...],

     count: 50

   }



4. AI Server:

   - Uzme user style vector

   - Izračuna similarity sa svim items

   - Primeni hard filters (size, gender, location)

   - Primeni scoring (stilska + popularnost + ...)

   - Vrati top 50



5. AI Server → Backend

   {

     items: ["item_001", "item_023", ...],

     scores: [0.92, 0.87, ...]

   }



6. Backend → Firebase

   Fetch item details



7. Backend → Frontend

   Vrati feed sa svim podacima

```



---



### SCENARIO 3: Korisnik swipe-uje

```

1. Frontend → Firebase (interactions)

   {

     userId: "user_abc123",

     itemId: "item_xyz789",

     type: "swipe",

     direction: "right"

   }



2. Firebase → AI Server (batch update, ne real-time)

   Svaki sat ili na kraju dana:

   POST /api/update-profile

   {

     userId: "user_abc123",

     newInteractions: [...]

   }



3. AI Server:

   - Update user style vector

   - Re-rank buduće preporuke

```



---



## 🏗️ TEHNIČKA ARHITEKTURA (dijagram)

```

┌─────────────────────────────────────────────────┐

│                   FRONTEND                      │

│           (React Native / Web)                  │

└────────────┬────────────────────────────────────┘

             │

             ▼

┌─────────────────────────────────────────────────┐

│              FIREBASE (Firestore)               │

│  ┌──────────┬──────────┬──────────┬──────────┐  │

│  │  users   │  items   │  inter-  │ matches  │  │

│  │          │          │ actions  │          │  │

│  └──────────┴──────────┴──────────┴──────────┘  │

└────────────┬────────────────────────────────────┘

             │

             │ (Cloud Functions trigger)

             │

             ▼

┌─────────────────────────────────────────────────┐

│           BACKEND API (Node.js)                 │

│         (Firebase Functions ili Express)        │

│                                                 │

│  - Feed generation logic                       │

│  - Match logic                                 │

│  - Business rules                              │

└────────────┬────────────────────────────────────┘

             │

             │ HTTP API calls

             │

             ▼

┌─────────────────────────────────────────────────┐

│           AI SERVER (Python)                    │

│              (tvoj računar)                     │

│                                                 │

│  ┌─────────────────────────────────────────┐   │

│  │  FastAPI endpoints:                     │   │

│  │  - POST /api/process-item               │   │

│  │  - POST /api/recommend                  │   │

│  │  - POST /api/similar-items              │   │

│  │  - POST /api/generate-description       │   │

│  │  - POST /api/update-profile             │   │

│  └─────────────────────────────────────────┘   │

│                                                 │

│  ┌─────────────────────────────────────────┐   │

│  │  ML Models:                             │   │

│  │  - CLIP (image embeddings)              │   │

│  │  - Sentence Transformers (text)         │   │

│  │  - Custom ranking model                 │   │

│  └─────────────────────────────────────────┘   │

│                                                 │

│  ┌─────────────────────────────────────────┐   │

│  │  Vector DB:                             │   │

│  │  - Qdrant / FAISS                       │   │

│  │  - SQLite (metadata)                    │   │

│  └─────────────────────────────────────────┘   │

└─────────────────────────────────────────────────┘



🔑 API ENDPOINTS (AI Server)

1. Process New Item

http

POST /api/process-item

Content-Type: application/json



{

  "itemId": "item_xyz789",

  "imageUrl": "https://storage.../image.jpg",

  "category": "jakna",

  "userProvidedDescription": null  // ako korisnik ostavio prazno

}



Response:

{

  "itemId": "item_xyz789",

  "aiGenerated": {

    "description": "Top kožna jakna...",

    "detectedBrand": "Zara",

    "detectedColor": "black",

    "detectedStyle": "casual",

    "confidence": 0.87

  },

  "embedding": {

    "imageVector": [...],  // ne vraća se frontend-u, samo za internal

    "textVector": [...]

  }

}



2. Get Personalized Feed

http

POST /api/recommend

Content-Type: application/json



{

  "userId": "user_abc123",

  "userPreferences": {

    "sizes": ["S", "M"],

    "gender": "female",

    "city": "Beograd",

    "budgetMax": 5000

  },

  "recentSwipes": [

    {"itemId": "item_001", "direction": "right"},

    {"itemId": "item_002", "direction": "left"}

  ],

  "excludeItems": ["item_003", "item_004"],  // već videla

  "count": 50

}



Response:

{

  "items": [

    {

      "itemId": "item_xyz789",

      "score": 0.92,

      "reason": "style_match"  // style_match | popular | exploration

    },

    ...

  ],

  "diversity": {

    "safeRecommendations": 45,  // 90%

    "explorations": 5           // 10%

  }

}



3. Find Similar Items (Pinterest feature)

http

POST /api/similar-items

Content-Type: application/json



{

  "itemId": "item_xyz789",

  "count": 20,

  "filters": {

    "sameCategory": true,

    "sameSeller": false

  }

}



Response:

{

  "similar": [

    {"itemId": "item_abc", "similarity": 0.94},

    {"itemId": "item_def", "similarity": 0.89},

    ...

  ]

}



4. Generate Description

http

POST /api/generate-description

Content-Type: application/json



{

  "imageUrl": "https://...",

  "category": "jakna",

  "condition": "kao_novo",

  "detectedBrand": "Zara",

  "detectedColor": "black"

}



Response:

{

  "description": "Top Zara kožna jakna, bukvalno kao nova 🖤 Nosila 2x max.",

  "tone": "casual",

  "length": 58  // characters

}



5. Update User Profile (batch)

http

POST /api/update-profile

Content-Type: application/json



{

  "userId": "user_abc123",

  "newInteractions": [

    {

      "itemId": "item_001",

      "type": "swipe",

      "direction": "right",

      "itemMetadata": {

        "category": "jakna",

        "color": "black",

        "style": "casual"

      }

    },

    ...

  ]

}



Response:

{

  "userId": "user_abc123",

  "updatedProfile": {

    "styleVector": [...],

    "dataPoints": 55,

    "lastUpdated": "2025-01-14T18:00:00Z"

  }

}



🚨 KRITIČNE NAPOMENE

⚠️ FIREBASE LIMITATIONS

Firebase Firestore NE MOŽE:

❌ Vector similarity search (zato AI server)

❌ Complex scoring (zato backend API)

❌ Real-time ML inference

Firebase Firestore MOŽE:

✅ CRUD operacije (users, items, interactions)

✅ Real-time updates (chat)

✅ Autentifikacija



⚠️ AI SERVER - NE MORA DA BUDE 24/7 (za MVP)

MVP pristup:

AI server radi batch processing (1x dnevno ili kad se pozove)

Feed se kesira na backend-u (24h)

Embeddings se generišu async (ne mora odmah)

Produkcija (kasnije):

AI server 24/7

Real-time preporuke



⚠️ SKALIRANJE (10k korisnika)

10k korisnika = ~50k itema

Firebase:

50k dokumenata = OK ✅

Queries su jeftine

AI Server:

50k embeddings = ~25 MB RAM ✅

FAISS može da radi in-memory

Qdrant bolji za produkciju



