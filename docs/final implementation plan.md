📋 TRADEY - DETALJAN IMPLEMENTACIONI PLAN

Analizirajući sve dokumente i vaš pitch, evo preciznog i akcionog plana koji integriše sve aspekte projekta:



🎯 PREGLED PROJEKTA

Tradey = Tinder za garderobu sa AI rangiranjem

Validacija: 100+ anketa, 82% troši previše vremena tražeći odeću

Tržište: Second-hand raste 3x brže od fast fashion-a

Cilj: 1.4% balkanskog tržišta = 1M+ EUR prometa



🏗️ ARHITEKTURA SISTEMA

REPOZITORIJUMI (Multi-repo pristup)

📁 tradey-backend (Node.js/Express + Firebase Functions)

   └─ Glavni API server

   

📁 tradey-web (React)

   └─ Postojeći MVP web



📁 tradey-mobile (React Native/Expo)

   └─ PRIORITET - gde publika živi



📁 tradey-ai-server (Python/FastAPI)  

   └─ AI rangiranje i preporuke





🗄️ BAZE PODATAKA - ŠTA IDE GDE

1. Firebase Firestore (Real-time + osnovni podaci)

✅ KORISTI ZA:

Users (profil, preferences, stats)

Items (oglasi sa slikama)

Interactions (swipe-ovi, lajkovi)

Matches (obostrani lajkovi)

Chat (real-time poruke)

❌ NE KORISTI ZA:

AI embeddings (nema vector search)

Kompleksni upiti (npr. "sve jakne u 10km sa 50+ lajkova")



2. PostgreSQL (Supabase ili direktno)

✅ KORISTI ZA:

Krediti (KRITIČNO - mora backend logika!)

Transakcije paketa (Free/Basic/Pro/Business)

Kompleksni upiti i analytics

Aukcije/ponude (ako implementirate)

Primer šeme:

-- users_credits

user_id | credits_available | plan_type | last_purchase_at

--------|-------------------|-----------|------------------

abc123  | 3                 | free      | 2025-01-10



-- transactions

tx_id | user_id | type     | amount | timestamp

------|---------|----------|--------|-------------------

tx001 | abc123  | purchase | 10     | 2025-01-14 10:00

tx002 | abc123  | match    | -1     | 2025-01-14 11:30





3. Vector Database (Pinecone ili pgvector)

✅ KORISTI ZA:

Image embeddings (CLIP vektori 512-dim)

Text embeddings (384-dim)

Similarity search ("pronađi slične jakne")

ZAŠTO OVO JE KLJUČNO: AI algoritam mora brzo da pronađe stilski slične komade. Vector search to radi za 100ms, dok bi Firebase trebao minute.



🚀 AKCIONI PLAN (PRIORITIZOVAN)

FAZA 0: PRE POČETKA (1 nedelja)

Zadatak 0.1: Audit postojećeg koda

# Cilj: Mapirati šta već postoji



1. Kloniraj tradey-web repo

2. Napravi listu svih API poziva:

   - Koje rute frontend koristi?

   - Koja logika je na frontendu a treba na backendu?

   

3. Dokumentuj trenutni Firebase schema:

   - Koje kolekcije postoje?

   - Koja polja su populated?



Zadatak 0.2: Definisanje API Contracta

Kreirati dokument: API_CONTRACT.md

# MVP API Endpoints



## Auth

POST /auth/register

POST /auth/login



## Items

GET  /items/feed?userId=X          → AI poziv

POST /items/create

GET  /items/:id



## Interactions  

POST /interactions/swipe

POST /interactions/match



## Credits (NOVI - MORA U POSTGRES!)

GET  /credits/balance?userId=X

POST /credits/purchase

POST /credits/consume              → poziva se pre matcha





FAZA 1: BACKEND CENTRALIZACIJA (2 nedelje)

Cilj: Izvući SVU logiku iz React-a u Node.js API

Nedelja 1: Setup & Auth

# 1. Kreirati tradey-backend repo

mkdir tradey-backend && cd tradey-backend

npm init -y



# 2. Instalirati dependencies

npm install express firebase-admin cors dotenv

npm install --save-dev nodemon



# 3. Struktura foldera

tradey-backend/

├── src/

│   ├── config/

│   │   └── firebase.js          # Firebase Admin init

│   ├── middleware/

│   │   └── auth.js              # Verify token

│   ├── routes/

│   │   ├── auth.js

│   │   ├── items.js

│   │   ├── interactions.js

│   │   └── credits.js           # NOVO!

│   ├── services/

│   │   ├── ai-client.js         # Poziva AI server

│   │   └── credit-service.js    # Biznis logika kredita

│   └── index.js

├── .env

└── package.json



Ključni fajl: credit-service.js

// KRITIČNO: Kredit logika MORA biti samo na serveru!



class CreditService {

  async consumeCredit(userId, action = 'match') {

    // 1. Proveri koliko ima kredita (PostgreSQL!)

    const balance = await db.query(

      'SELECT credits_available FROM users_credits WHERE user_id = $1',

      [userId]

    );

    

    if (balance.rows[0].credits_available <= 0) {

      throw new Error('INSUFFICIENT_CREDITS');

    }

    

    // 2. Oduzmi kredit (atomic operacija!)

    await db.query(

      'UPDATE users_credits SET credits_available = credits_available - 1 WHERE user_id = $1',

      [userId]

    );

    

    // 3. Logiraj transakciju

    await db.query(

      'INSERT INTO transactions (user_id, type, amount) VALUES ($1, $2, $3)',

      [userId, action, -1]

    );

    

    return { success: true };

  }

}



Nedelja 2: Items & Feed

// routes/items.js



router.get('/feed', async (req, res) => {

  const { userId } = req.query;

  

  // 1. Proveri cold start (Firebase)

  const user = await firebase.firestore()

    .collection('users')

    .doc(userId)

    .get();

  

  const totalSwipes = user.data().stats.totalSwipes || 0;

  

  // 2. Pozovi AI server

  const aiResponse = await axios.post('http://ai-server:8000/api/recommend', {

    userId,

    userPreferences: user.data().preferences,

    coldStart: totalSwipes < 30,

    count: 50

  });

  

  // 3. Enrich sa Firebase podacima

  const itemDetails = await Promise.all(

    aiResponse.data.items.map(itemId => 

      firebase.firestore().collection('items').doc(itemId).get()

    )

  );

  

  res.json({

    feed: itemDetails.map(doc => doc.data()),

    aiMetadata: {

      coldStart: totalSwipes < 30,

      totalSwipes

    }

  });

});



Zadatak za kraj Faze 1: ✅ Svi API endpointi rade ✅ Frontend više NE poziva Firebase direktno ✅ Krediti žive u PostgreSQL ✅ Deploy na Render (ili Railway)



FAZA 2: AI SERVER MVP (4 nedelje)

Cilj: AI koji RADI, ne perfect AI

Nedelja 3-4: Setup & Image Embeddings

# 1. Kreirati tradey-ai-server repo

mkdir tradey-ai-server && cd tradey-ai-server



# 2. Struktura (kao u Dokumentu 3)

tradey-ai-server/

├── app/

│   ├── main.py                    # FastAPI

│   ├── api/

│   │   ├── process_item.py        # POST /api/process-item

│   │   └── recommend.py           # POST /api/recommend

│   ├── ml/

│   │   ├── embeddings.py          # CLIP wrapper

│   │   └── ranking.py             # Scoring algorithm

│   └── db/

│       └── vector_store.py        # FAISS (za MVP)

├── data/

│   └── faiss_index/

├── models/                         # Pre-downloaded CLIP

└── requirements.txt



Ključni fajl: embeddings.py

# ml/embeddings.py



import torch

from transformers import CLIPModel, CLIPProcessor

from PIL import Image

import requests

from io import BytesIO



class ImageEmbedder:

    def __init__(self):

        self.model = CLIPModel.from_pretrained("./models/clip")

        self.processor = CLIPProcessor.from_pretrained("./models/clip")

        

    def embed_image(self, image_url):

        # 1. Download image

        response = requests.get(image_url)

        image = Image.open(BytesIO(response.content))

        

        # 2. Process

        inputs = self.processor(images=image, return_tensors="pt")

        

        # 3. Generate embedding

        with torch.no_grad():

            embedding = self.model.get_image_features(**inputs)

        

        # 4. Normalize (za cosine similarity)

        embedding = embedding / embedding.norm(dim=-1, keepdim=True)

        

        return embedding.cpu().numpy()[0]  # shape: (512,)



Test:

# U terminalu AI servera

python3 << EOF

from app.ml.embeddings import ImageEmbedder



embedder = ImageEmbedder()

vector = embedder.embed_image("https://example.com/jakna.jpg")



print(f"Embedding shape: {vector.shape}")  # (512,)

print(f"First 5 values: {vector[:5]}")

EOF



Nedelja 5-6: Ranking & Cold Start

Ključni fajl: ranking.py

# ml/ranking.py



import numpy as np

from sklearn.metrics.pairwise import cosine_similarity



class FeedRanker:

    def rank_items(self, user_profile, candidate_items, cold_start=False):

        if cold_start:

            # Cold start: popularnost + kviz preferences

            return self._cold_start_rank(user_profile, candidate_items)

        else:

            # Personalized: AI scoring

            return self._personalized_rank(user_profile, candidate_items)

    

    def _personalized_rank(self, user_profile, candidates):

        scores = []

        

        for item in candidates:

            # 1. Style similarity (40%)

            style_score = cosine_similarity(

                [user_profile['styleVector']], 

                [item['embedding']]

            )[0][0] * 0.40

            

            # 2. Size match (30%)

            size_score = 0.30 if item['size'] in user_profile['sizes'] else 0.15

            

            # 3. Popularity (15%)

            popularity_score = (item['totalLikes'] / 100) * 0.15

            

            # 4. Budget (10%)

            budget_score = 0.10 if item.get('price', 0) <= user_profile.get('budgetMax', 9999) else 0

            

            # 5. Location (5%)

            location_score = 0.05 if item['location'] == user_profile['city'] else 0

            

            final_score = (

                style_score + size_score + popularity_score + 

                budget_score + location_score

            )

            

            scores.append({

                'itemId': item['itemId'],

                'score': final_score

            })

        

        # Sort by score

        ranked = sorted(scores, key=lambda x: x['score'], reverse=True)

        

        # 90% safe + 10% exploration

        safe = ranked[:int(len(ranked) * 0.9)]

        exploration = np.random.choice(ranked[int(len(ranked) * 0.9):], 

                                       size=min(5, len(ranked) - len(safe)), 

                                       replace=False).tolist()

        

        final = safe + exploration

        np.random.shuffle(final)

        

        return [item['itemId'] for item in final]



Test endpoint:

curl -X POST http://localhost:8000/api/recommend \

  -H "Content-Type: application/json" \

  -d '{

    "userId": "test_user",

    "userPreferences": {

      "sizes": ["M", "L"],

      "city": "Beograd"

    },

    "coldStart": false,

    "count": 10

  }'



Zadatak za kraj Faze 2: ✅ AI server vraća ranked feed ✅ Cold start radi (najpopularniji itemi) ✅ Personalizovani feed radi (AI rangiranje) ✅ Latency < 500ms



FAZA 3: MOBILNA APLIKACIJA (4 nedelje)

Cilj: React Native app sa 80% feature pariteta

Nedelja 7-8: Setup & Core UI

# 1. Kreirati Expo project

npx create-expo-app tradey-mobile

cd tradey-mobile



# 2. Instalirati dependencies

npx expo install react-native-gesture-handler react-native-reanimated

npm install @react-navigation/native @react-navigation/stack

npm install axios react-query

npm install firebase



# 3. Struktura

tradey-mobile/

├── src/

│   ├── screens/

│   │   ├── FeedScreen.js         # Swipe cards

│   │   ├── UploadScreen.js

│   │   ├── MatchesScreen.js

│   │   └── ProfileScreen.js

│   ├── components/

│   │   ├── SwipeCard.js          # KLJUČNA komponenta!

│   │   └── CreditBadge.js

│   ├── services/

│   │   └── api.js                # Axios instance

│   └── navigation/

│       └── AppNavigator.js

└── App.js



Ključna komponenta: SwipeCard.js

// components/SwipeCard.js

import { PanGestureHandler } from 'react-native-gesture-handler';

import Animated, { 

  useAnimatedGestureHandler, 

  useAnimatedStyle,

  withSpring 

} from 'react-native-reanimated';



export const SwipeCard = ({ item, onSwipe }) => {

  const translateX = useSharedValue(0);

  

  const gestureHandler = useAnimatedGestureHandler({

    onActive: (event) => {

      translateX.value = event.translationX;

    },

    onEnd: (event) => {

      if (event.translationX > 120) {

        // Swipe RIGHT (like)

        runOnJS(onSwipe)('right', item.itemId);

      } else if (event.translationX < -120) {

        // Swipe LEFT (skip)

        runOnJS(onSwipe)('left', item.itemId);

      } else {

        // Return to center

        translateX.value = withSpring(0);

      }

    }

  });

  

  const animatedStyle = useAnimatedStyle(() => ({

    transform: [{ translateX: translateX.value }]

  }));

  

  return (

    <PanGestureHandler onGestureEvent={gestureHandler}>

      <Animated.View style={[styles.card, animatedStyle]}>

        <Image source={{ uri: item.images[0] }} style={styles.image} />

        <View style={styles.details}>

          <Text style={styles.category}>{item.category} - {item.size}</Text>

          <Text style={styles.location}>📍 {item.location}</Text>

        </View>

      </Animated.View>

    </PanGestureHandler>

  );

};



Nedelja 9-10: Integracija & Polishing

Kritični flow: Swipe → Match → Credit check

// screens/FeedScreen.js



const FeedScreen = () => {

  const [credits, setCredits] = useState(null);

  const [feed, setFeed] = useState([]);

  

  // Load feed

  useEffect(() => {

    const loadFeed = async () => {

      const response = await api.get(`/items/feed?userId=${userId}`);

      setFeed(response.data.feed);

    };

    loadFeed();

  }, []);

  

  // Load credits

  useEffect(() => {

    const loadCredits = async () => {

      const response = await api.get(`/credits/balance?userId=${userId}`);

      setCredits(response.data.available);

    };

    loadCredits();

  }, []);

  

  const handleSwipe = async (direction, itemId) => {

    // 1. Log swipe (za AI učenje)

    await api.post('/interactions/swipe', {

      userId,

      itemId,

      direction

    });

    

    // 2. Check if match

    if (direction === 'right') {

      const matchResponse = await api.post('/interactions/match', {

        userId,

        itemId

      });

      

      if (matchResponse.data.isMatch) {

        // 3. Check credits

        if (credits <= 0) {

          // Show paywall!

          navigation.navigate('Paywall', { 

            message: 'Potreban ti je 1 kredit za ovaj match!' 

          });

        } else {

          // 4. Consume credit

          await api.post('/credits/consume', { userId });

          setCredits(credits - 1);

          

          // 5. Open chat

          navigation.navigate('Chat', { matchId: matchResponse.data.matchId });

        }

      }

    }

    

    // Remove card from feed

    setFeed(feed.filter(item => item.itemId !== itemId));

  };

  

  return (

    <View style={styles.container}>

      <CreditBadge count={credits} />

      {feed.map(item => (

        <SwipeCard 

          key={item.itemId} 

          item={item} 

          onSwipe={handleSwipe} 

        />

      ))}

    </View>

  );

};



Zadatak za kraj Faze 3: ✅ Swipe UX radi glatko (60fps) ✅ Kredit sistem integrisan ✅ Matchovanje funkcionalno ✅ Ready za TestFlight/Google Play beta



FAZA 4: LANSIRANJE & MARKETING (kontinuirano)

Pre-launch checklist:

# 2 nedelje pre lansiranja



TEHNIČKI:

- [ ] Stress test: 1000 concurrent users

- [ ] AI latency < 500ms

- [ ] Firebase limits check (50k reads/day?)

- [ ] Backup strategy (PostgreSQL + Firebase)

- [ ] Monitoring (Sentry za errors)



PRAVNI:

- [ ] Privacy Policy (obavezno za App Store!)

- [ ] Terms of Service

- [ ] GDPR compliance (ako targetiramo EU)



MARKETING:

- [ ] Landing page (tradey.rs)

- [ ] Instagram @tradey.rs (organik + ads)

- [ ] TikTok content (kako radi app)

- [ ] Referral program ("Pozovi druga, dobij 3 kredita")



Launch strategy:

# SOFT LAUNCH (Beograd only)

Nedelja 1: FON studenti (100 korisnika)

Nedelja 2: Instagram ads (Beograd 18-30)

Nedelja 3: Partnerships (second hand shops)



# SCALE (ceo Balkan)

Mesec 2: Novi Sad, Niš

Mesec 3: Zagreb, Ljubljana

Mesec 4: Skopje, Sarajevo





💰 FOND ALOKACIJA (nagradno konkurs)

UKUPNO: ~5,000 EUR (pretpostavka)



1. Marketing (40% = 2,000 EUR)

   - Instagram Ads (targetirani 18-30, Beograd)

   - Influencer saradnje (mikro influenseri)

   - TikTok content kreator



2. AI Infrastructure (30% = 1,500 EUR)

   - Server hosting (6 meseci, ~200 EUR/mesec)

   - Vector database (Pinecone starter plan)

   - OpenAI API (za generisanje opisa)



3. Development (20% = 1,000 EUR)

   - Apple Developer ($99/year)

   - Google Play ($25 one-time)

   - Firebase Blaze plan upgrade

   - Tools & libraries



4. Operativni troškovi (10% = 500 EUR)

   - Domen (.rs + .com)

   - Legal (privacy policy drafting)

   - Accounting





📊 SUCCESS METRICS (kako merimo uspeh?)

# Dashboard metrics (Firebase Analytics)



PRIMARY:

- DAU/MAU (Daily/Monthly Active Users)

- Retention Rate (Dan 1, Dan 7, Dan 30)

- Swipes per session (prosek: 20-30)



SECONDARY:

- Match rate (cilj: 1 match / 20 swipe-ova)

- Credit conversion (cilj: 5% free → paid)

- Time in app (cilj: 10+ min/dan)



AI METRICS:

- Feed CTR (Click-Through Rate na lajk)

- Cold start success (Da li novi korisnik ostane?)

- Personalization lift (personalized vs random feed)





⚠️ KRITIČNE NAPOMENE

1. KREDITI = CORE BIZNIS LOGIKA

// ❌ NIKAD OVO:

// frontend direktno menja kredite u Firebase



// ✅ UVEK OVO:

// Backend API consumuje kredit nakon validacije

// PostgreSQL atomic transaction

// Log svake promene u transactions tabeli



2. AI SERVER NE MORA 24/7 (za MVP)

Za prvih 100 korisnika:

AI server može da radi batch (1x dnevno)

Feed se kesira u Redis (24h)

Ako padne → frontend pokazuje cached feed

Za 1000+ korisnika:

AI mora 24/7

Load balancer (2+ instance)

Monitoring (Prometheus + Grafana)

3. FIREBASE LIMITS

Free tier:

50k reads/day

20k writes/day

1 GB storage

Procena za 1000 korisnika:

Reads: ~30k/day (safe)

Writes: ~15k/day (safe)

Kad upgrade na Blaze?

Preko 5000 korisnika

Ili primetite throttling errors



🎓 UČENJE RESURSI (za tim)

# Za Maju (Backend):

- [Firebase Admin Node.js](https://firebase.google.com/docs/admin/setup)

- [Express.js crash course](https://www.youtube.com/watch?v=L72fhGm1tfE)

- [PostgreSQL basics](https://www.postgresqltutorial.com/)



# Za Vukašina (AI):

- [CLIP tutorial](https://huggingface.co/docs/transformers/model_doc/clip)

- [FastAPI course](https://fastapi.tiangolo.com/tutorial/)

- [Vector databases explained](https://www.pinecone.io/learn/vector-database/)



# Za Tea (Mobile):

- [React Native Expo](https://docs.expo.dev/)

- [React Navigation](https://reactnavigation.org/)

- [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)



# Za Mariju (Full-stack):

- [System Design Primer](https://github.com/donnemartin/system-design-primer)

- [Microservices patterns](https://microservices.io/patterns/)





✅ FINAL CHECKLIST (MVP READY)

BACKEND:

- [ ] Svi API endpoints rade

- [ ] Krediti u PostgreSQL

- [ ] Firebase integration

- [ ] Deploy na Render/Railway



AI SERVER:

- [ ] CLIP embeddings rade

- [ ] Feed ranking funkcionalan

- [ ] Cold start implementiran

- [ ] Latency < 500ms



MOBILNA APLIKACIJA:

- [ ] Swipe UX glatka

- [ ] Upload fotografija radi

- [ ] Chat real-time

- [ ] Kredit flow completan



OSTALO:

- [ ] Privacy Policy

- [ ] App Store/Play Store accounts

- [ ] Landing page

- [ ] Instagram kanal setup







