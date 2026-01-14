📄 DOKUMENT 3: AI ARCHITECTURE & STRATEGY

Ovde će biti NAJTEHNIČKI deo - ali i dalje bez koda, samo plan.



🧠 KOJE AI MODELE KORISTIŠ (i zašto)

MODEL 1: CLIP (OpenAI) - za image embeddings

Šta je CLIP?

Model koji "razume" slike i tekst u istom prostoru

Pre-trained na 400M slika

NE TRENIRAŠ GA - samo koristiš

Verzija: openai/clip-vit-base-patch32

Šta radi:

Slika jakne → CLIP → vektor [512 brojeva]

Zašto baš CLIP?

✅ Razume modu i stil

✅ Brz (300ms per image na CPU)

✅ Može da radi bez GPU-a

✅ Besplatan i open source

Alternativa (ako imaš GPU):

openai/clip-vit-large-patch14 (bolji, ali sporiji)



MODEL 2: Sentence Transformers - za text embeddings

Verzija: sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2

Šta radi:

"Top kožna jakna..." → Transformer → vektor [384 brojeva]

Zašto baš ovaj?

✅ Podržava srpski jezik

✅ Brz (50ms per text na CPU)

✅ Mali model (120MB)



MODEL 3: Custom Ranking Model (tvoj algoritam)

OVO NEĆEŠ TRENIRATI!

Umesto treniranja, koristiš weighted scoring:

python

final_score = (

    0.40 * cosine_similarity(user_style_vector, item_image_embedding) +

    0.30 * size_match_score +

    0.15 * popularity_score +

    0.10 * price_match_score +

    0.05 * location_score

)

```



**Kasnije (kada imaš podatke):**

- Možeš da trenaš **ranking model** (LightGBM ili XGBoost)

- Ulaz: features (similarity, popularity...)

- Izlaz: verovatnoća da će korisnik lajkovati



---



### MODEL 4: GPT-2 / Llama - za generisanje opisa



**Verzija:** `gpt2` ili Claude API (što već koristiš)



**Šta radi:**

```

Input: {category: "jakna", color: "black", condition: "kao_novo"}

Output: "Top kožna jakna, bukvalno kao nova 🖤 Nosila 2x max."

```



**MVP pristup:**

- Koristi **template-based** generaciju (jeftinije)

- Kasnije uključi LLM (Claude API)



---



## 🏗️ ARHITEKTURA AI SERVERA (detaljan plan)



### FOLDER STRUKTURA

```

tradey-ai-server/

├── app/

│   ├── __init__.py

│   ├── main.py                 # FastAPI app

│   ├── config.py               # Config (model paths, Firebase...)

│   │

│   ├── api/

│   │   ├── __init__.py

│   │   ├── process_item.py     # POST /api/process-item

│   │   ├── recommend.py        # POST /api/recommend

│   │   ├── similar.py          # POST /api/similar-items

│   │   ├── description.py      # POST /api/generate-description

│   │   └── update_profile.py   # POST /api/update-profile

│   │

│   ├── ml/

│   │   ├── __init__.py

│   │   ├── embeddings.py       # CLIP + Sentence Transformers

│   │   ├── ranking.py          # Scoring logic

│   │   ├── cold_start.py       # Cold start strategy

│   │   └── style_detector.py   # Boja, stil, brend detection

│   │

│   ├── db/

│   │   ├── __init__.py

│   │   ├── vector_store.py     # Qdrant / FAISS wrapper

│   │   └── firebase_client.py  # Firebase connection

│   │

│   └── utils/

│       ├── __init__.py

│       ├── image_utils.py      # Download, resize...

│       └── text_utils.py       # Text cleaning

│

├── data/

│   ├── embeddings.db           # SQLite (metadata)

│   ├── vectors/                # FAISS index files

│   └── user_profiles.json      # Cached user vectors

│

├── models/

│   ├── clip/                   # Downloaded CLIP model

│   ├── sentence-transformer/   # Downloaded ST model

│   └── ...

│

├── tests/

│   ├── test_embeddings.py

│   └── test_ranking.py

│

├── requirements.txt

├── Dockerfile                  # Za kasnije

└── README.md



🔧 TEHNIČKI STACK

python

# requirements.txt



# Core framework

fastapi==0.104.1

uvicorn[standard]==0.24.0

pydantic==2.5.0



# ML models

torch==2.1.0                    # PyTorch (CPU version)

transformers==4.35.0            # HuggingFace

sentence-transformers==2.2.2

Pillow==10.1.0                  # Image processing



# Vector database

qdrant-client==1.7.0            # Production choice

# OR faiss-cpu==1.7.4           # Lighter alternative



# Firebase

firebase-admin==6.2.0



# Utils

requests==2.31.0

numpy==1.24.3

pandas==2.1.3                   # Za batch processing

python-dotenv==1.0.0



# Development

pytest==7.4.3



🚀 KAKO RADE EMBEDDINGS (najvažniji deo)

KORAK 1: Generisanje embeddings (kad se postavi item)

python

# Pseudokod



def process_new_item(item_id, image_url, category):

    

    # 1. Preuzmi sliku

    image = download_image(image_url)

    

    # 2. Generiši image embedding

    image_embedding = CLIP.encode_image(image)  

    # → numpy array [512 floats]

    

    # 3. Detektuj boju, stil, brend

    detected_color = detect_color(image)

    detected_style = detect_style(image_embedding)

    detected_brand = detect_brand(image)  # OCR + logo detection

    

    # 4. Generiši opis (ako korisnik nije dao)

    description = generate_description(

        category=category,

        color=detected_color,

        style=detected_style,

        brand=detected_brand

    )

    

    # 5. Generiši text embedding od opisa

    text_embedding = SentenceTransformer.encode(description)

    # → numpy array [384 floats]

    

    # 6. Skladišti u vector DB

    VectorStore.add(

        item_id=item_id,

        image_vector=image_embedding,

        text_vector=text_embedding,

        metadata={

            "category": category,

            "color": detected_color,

            "style": detected_style,

            "brand": detected_brand

        }

    )

    

    # 7. Update Firebase (aiGenerated fields)

    Firebase.update_item(item_id, {

        "aiGenerated": {

            "description": description,

            "detectedBrand": detected_brand,

            "detectedColor": detected_color,

            "detectedStyle": detected_style

        }

    })

    

    return success



KORAK 2: User style vector (kako AI uči korisnika)

python

# Pseudokod



def compute_user_style_vector(user_id):

    

    # 1. Uzmi sve swipe right interakcije

    liked_items = Firebase.get_user_likes(user_id)

    

    # 2. Uzmi embeddings tih itema

    liked_embeddings = []

    for item_id in liked_items:

        embedding = VectorStore.get_embedding(item_id)

        liked_embeddings.append(embedding)

    

    # 3. Prosečni vektor = user style

    user_style_vector = np.mean(liked_embeddings, axis=0)

    # → numpy array [512 floats]

    

    # 4. Keširaj za brže preporuke

    cache_user_profile(user_id, user_style_vector)

    

    return user_style_vector

```



**Primer (vizuelno):**

```

Marija lajkovala:

  - Crna jakna   → embedding [0.1, 0.8, -0.3, ...]

  - Crne pantalone → embedding [0.2, 0.7, -0.2, ...]

  - Bela majica  → embedding [-0.5, 0.3, 0.8, ...]



Njen style vector = prosek:

  → [-0.07, 0.6, 0.1, ...]



AI sada zna: "Marija voli casual, crno-bele kombinacije"



KORAK 3: Personalizovani feed (kako AI rangira)

python

# Pseudokod



def generate_personalized_feed(user_id, count=50):

    

    # 1. Uzmi user preferences

    user = Firebase.get_user(user_id)

    user_style_vector = get_cached_user_profile(user_id)

    

    # 2. Hard filter (size, gender, location)

    candidate_items = Firebase.query_items({

        "size": {"in": user.preferences.sizes},

        "gender": {"in": user.preferences.interestedIn},

        "location": user.profile.city,  # opciono

        "status": "active"

    })

    

    # 3. Uzmi embeddings svih kandidata

    candidate_embeddings = VectorStore.get_batch(candidate_items)

    

    # 4. Računaj similarity score

    similarity_scores = []

    for item_id, item_embedding in candidate_embeddings:

        

        # Cosine similarity

        similarity = cosine_similarity(

            user_style_vector, 

            item_embedding

        )

        

        similarity_scores.append({

            "itemId": item_id,

            "styleSimilarity": similarity

        })

    

    # 5. Dodaj ostale faktore

    final_scores = []

    for item in similarity_scores:

        

        item_data = Firebase.get_item(item.itemId)

        

        # Style score (40%)

        style_score = item.styleSimilarity * 0.40

        

        # Size exact match (30%)

        size_score = 0.30 if item_data.size == user.size else 0.15

        

        # Popularity (15%)

        max_likes = 100  # normalizacija

        popularity_score = (item_data.stats.totalLikes / max_likes) * 0.15

        

        # Budget (10%)

        budget_score = 0.10 if item_data.price <= user.budgetMax else 0

        

        # Location (5%)

        location_score = 0.05 if item_data.location == user.city else 0

        

        final_score = (

            style_score + 

            size_score + 

            popularity_score + 

            budget_score + 

            location_score

        )

        

        final_scores.append({

            "itemId": item.itemId,

            "score": final_score

        })

    

    # 6. Sortiraj po score-u

    ranked = sorted(final_scores, key=lambda x: x.score, reverse=True)

    

    # 7. Diverzitet (90% safe + 10% exploration)

    safe_items = ranked[:45]  # top 90%

    exploration_items = random.sample(ranked[45:], 5)  # random 10%

    

    final_feed = safe_items + exploration_items

    random.shuffle(final_feed)  # Shuffle da ne bude predvidljivo

    

    return final_feed[:count]



KORAK 4: Cold Start (novi korisnik)

python

# Pseudokod



def generate_cold_start_feed(user_id):

    

    user = Firebase.get_user(user_id)

    total_swipes = user.stats.totalSwipes

    

    # FAZA 1: 0-10 swipe-ova

    if total_swipes < 10:

        return get_popular_items_from_quiz(user.preferences.styles)

    

    # FAZA 2: 10-30 swipe-ova

    elif total_swipes < 30:

        quiz_items = get_popular_items_from_quiz(user.preferences.styles)

        behavioral_items = get_items_from_early_likes(user_id)

        

        return mix(quiz_items * 0.7, behavioral_items * 0.3)

    

    # FAZA 3: 30+ swipe-ova

    else:

        return generate_personalized_feed(user_id)



🗄️ VECTOR DATABASE (Qdrant vs FAISS)

OPCIJA 1: FAISS (jednostavnije za MVP)

Prednosti:

✅ Radi in-memory (brzo)

✅ Jednostavan setup

✅ Besplatan

Mane:

❌ Nema persistence (mora da se reload-uje)

❌ Nema metadata filtriranje

Setup:

python

import faiss

import numpy as np



# Inicijalizuj index

dimension = 512  # CLIP embedding size

index = faiss.IndexFlatL2(dimension)  # L2 distance



# Dodaj vektore

embeddings = np.array([...])  # shape: (N, 512)

index.add(embeddings)



# Pretraga

query_vector = np.array([...])  # shape: (1, 512)

distances, indices = index.search(query_vector, k=50)



OPCIJA 2: Qdrant (bolje za produkciju)

Prednosti:

✅ Persistence (ne gubi podatke)

✅ Metadata filtriranje

✅ REST API

✅ Skalabilno

Mane:

❌ Malo kompleksnije

Setup:

python

from qdrant_client import QdrantClient

from qdrant_client.models import Distance, VectorParams, PointStruct



# Inicijalizuj client

client = QdrantClient(path="./data/qdrant")  # lokalno



# Kreiraj collection

client.create_collection(

    collection_name="tradey_items",

    vectors_config=VectorParams(size=512, distance=Distance.COSINE)

)



# Dodaj vektor

client.upsert(

    collection_name="tradey_items",

    points=[

        PointStruct(

            id="item_xyz789",

            vector=[0.1, 0.2, ...],  # 512 dims

            payload={

                "category": "jakna",

                "color": "black",

                "size": "M"

            }

        )

    ]

)



# Pretraga sa filterima

results = client.search(

    collection_name="tradey_items",

    query_vector=[0.1, 0.2, ...],

    limit=50,

    query_filter={

        "must": [

            {"key": "size", "match": {"value": "M"}}

        ]

    }

)

💡 PREPORUKA: Počni sa FAISS (brži start), kasnije prelazi na Qdrant.



📊 PERFORMANSE (realnost)

Koliko je brzo?

Na CPU serveru (bez GPU):

Operacija

Vreme

Šta radi

CLIP embedding (1 slika)

~300ms

Generiše vektor od slike

Text embedding (1 opis)

~50ms

Generiše vektor od teksta

Vector search (50k itema)

~100ms

Pronalazi najsličnije

Total za 1 item

~450ms

Process new item

Total za feed

~200ms

Recommend 50 items

Na GPU serveru (ako imaš):

CLIP: ~50ms (6x brže)

Ostalo: isto

Zaključak: CPU je dovoljan za 10k korisnika.



🔐 SIGURNOST & API KEYS

Environment Variables (.env)

bash

# Firebase

FIREBASE_CREDENTIALS_PATH=/path/to/firebase-key.json



# Server

AI_SERVER_PORT=8000

AI_SERVER_HOST=0.0.0.0



# API Keys (ako treba)

CLAUDE_API_KEY=sk-ant-...  # za generisanje opisa



# Vector DB

QDRANT_PATH=./data/qdrant



# Models

CLIP_MODEL=openai/clip-vit-base-patch32

SENTENCE_MODEL=sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2



🖥️ KAKO PODIGNEŠ AI SERVER (step-by-step)

FAZA 1: PRIPREMA SERVERA

Korak 1: SSH u server

bash

ssh root@твој-IP

Korak 2: Update sistema

bash

# Ubuntu/Debian

sudo apt update && sudo apt upgrade -y



# Install Python 3.10+

sudo apt install python3.10 python3.10-venv python3-pip -y



# Install dodatke

sudo apt install git curl wget -y

Korak 3: Kreiraj folder projekta

bash

mkdir /opt/tradey-ai

cd /opt/tradey-ai



FAZA 2: SETUP PYTHON OKRUŽENJA

Korak 4: Virtual environment

bash

python3 -m venv venv

source venv/bin/activate

Korak 5: Install dependencies

bash

# Kreiraj requirements.txt (kopiraj sa gore)

nano requirements.txt



# Install

pip install --upgrade pip

pip install -r requirements.txt

⏳ Ovo će trajati 10-15 minuta (PyTorch je veliki)



FAZA 3: DOWNLOAD MODELA

Korak 6: Download CLIP

bash

python3 << EOF

from transformers import CLIPModel, CLIPProcessor



model_name = "openai/clip-vit-base-patch32"

model = CLIPModel.from_pretrained(model_name)

processor = CLIPProcessor.from_pretrained(model_name)



model.save_pretrained("./models/clip")

processor.save_pretrained("./models/clip")

print("CLIP downloaded!")

EOF

Korak 7: Download Sentence Transformer

bash

python3 << EOF

from sentence_transformers import SentenceTransformer



model_name = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

model = SentenceTransformer(model_name)

model.save("./models/sentence-transformer")

print("SentenceTransformer downloaded!")

EOF

Sada imaš modele lokalno - ne treba internet za inference.



FAZA 4: SETUP FIREBASEA

Korak 8: Firebase credentials

bash

# Upload Firebase JSON key na server

scp /path/to/firebase-key.json root@IP:/opt/tradey-ai/firebase-key.json

Korak 9: .env file

bash

nano .env



# Dodaj:

FIREBASE_CREDENTIALS_PATH=/opt/tradey-ai/firebase-key.json

AI_SERVER_PORT=8000

QDRANT_PATH=./data/qdrant



FAZA 5: POKRENI SERVER

Korak 10: Run FastAPI

bash

# Development mode

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

Testiranje:

bash

curl http://localhost:8000/health

# → {"status": "ok"}



Korak 11: Production mode (systemd service)

bash

sudo nano /etc/systemd/system/tradey-ai.service

Dodaj:

ini

[Unit]

Description=Tradey AI Server

After=network.target



[Service]

Type=simple

User=root

WorkingDirectory=/opt/tradey-ai

Environment="PATH=/opt/tradey-ai/venv/bin"

ExecStart=/opt/tradey-ai/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000

Restart=always



[Install]

WantedBy=multi-user.target

Enable i start:

bash

sudo systemctl daemon-reload

sudo systemctl enable tradey-ai

sudo systemctl start tradey-ai

sudo systemctl status tradey-ai



Korak 12: Firewall & nginx (opciono)

bash

# Firewall

sudo ufw allow 8000/tcp



# Nginx reverse proxy (ako želiš HTTPS)

sudo apt install nginx -y



FAZA 6: TESTIRANJE

Korak 13: Test endpoint

bash

curl -X POST http://tvoj-IP:8000/api/process-item \

  -H "Content-Type: application/json" \

  -d '{

    "itemId": "test_001",

    "imageUrl": "https://example.com/jakna.jpg",

    "category": "jakna"

  }'



📌 FINAL CHECKLIST

Kada sve radi:

✅ Python 3.10+ instaliran ✅ Virtual env kreiran ✅ Dependencies instalirani ✅ CLIP i SentenceTransformer downloadovani ✅ Firebase credentials setupovani ✅ FastAPI server radi ✅ Systemd service enabled ✅ Firewall otvoren



