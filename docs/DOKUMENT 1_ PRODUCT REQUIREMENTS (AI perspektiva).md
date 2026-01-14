📄 DOKUMENT 1: PRODUCT REQUIREMENTS (AI perspektiva)

Ovo je dokument koji ti garantuje da Claude Code ili bilo ko drugi razume šta gradite.



🎯 TRADEY AI - PRODUCT SPEC V1

1. ŠTA JE TRADEY (AI ugao)

Tradey je Tinder za garderobu sa AI rangiranjem.

AI ima dva zadatka:

Personalizovani feed - pokazati svakom korisniku odeću koja će mu se najverovatnije svideti

Stilska detekcija - prepoznati stil korisnika iz ponašanja + slika

AI NE radi:

❌ Predikciju cena

❌ Predikciju transakcija

❌ Chat automatizaciju

❌ Fraud detekciju



2. KORISNIČKO ISKUSTVO (UXFlow)

2.1 PRVI DOLAZAK (Cold Start)

Korak 1: Kviz

Tea se registruje → dobija kviz o stilu

Pitanja: muški/ženski/unisex, casual/formal, omiljene boje, budžet...

Korak 2: Najpopularniji feed

Na osnovu kviza → AI pokazuje TOP iteme iz te kategorije

Cilj: brzo sakupiti 10-20 swipe-ova

Korak 3: Personalizacija kreće

Posle ~20 swipe-ova → AI počinje da rangira prema njenom stilu



2.2 FEED MEHANIKA (核心)

Ekran struktura:

┌─────────────────────────┐

│   [Slika proizvoda]     │

│                         │

│  🏷️ Jakna - M - Kao nova │

│  📍 Beograd             │

│  👤 [Vukasin avatar]    │  ← klik → profil

│                         │

│  [⬅️ Skip]  [❤️ Lajk]  │  ← uvek

│                         │

│  [💰 Ponudi cenu]       │  ← samo ako je prodaja

│  [🔄 Ponudi razmenu]    │  ← samo ako je razmena

└─────────────────────────┘

3 tipa interakcije:

Korisnik vidi

Dugmad

Značenje

Razmena

⬅️ Skip / ❤️ Lajk / 🔄 Razmenu

Lajk = "sviđa mi se stil"

Prodaja

⬅️ Skip / ❤️ Lajk / 💰 Cenu

Ponuda = "želim da kupim"

Samo browse

⬅️ Skip / ❤️ Lajk

Lajk = "prikaži mi slično"

BITNO:

Lajk ≠ kupovina

Lajk = signal AI-u ("sviđa mi se OVAKVA odeća")

Match = tek kada OBA korisnika lajkuju (ili neko ponudi + prodavac prihvati)



2.3 MATCH LOGIKA

Scenario 1: Obostrani lajk

Marija lajkuje Vukašinovu jaknu

Vukašin lajkuje Marijin zahtev/interest

→ MATCH → Chat se otvara

Scenario 2: Prodaja/Aukcija

Vukašin postavi jaknu (prodaja)

→ AI pokazuje samo ljudima kojima stilski odgovara

→ Marija ponudi cenu

→ Vukašin bira između ponuda

→ MATCH → Chat se otvara

AI NE ZNA:

Da li su nastavili razgovor

Da li je došlo do razmene → Za AI je "Match = success"



3. AI RANGIRANJE (Scoring System)

3.1 PRIORITETI (od najbitnijeg)

Feed se gradi ovako:

python

# Pseudokod

for item in available_items:

    score = 0

    

    # 1. STILSKA SLIČNOST (40%)

    score += style_similarity(user, item) * 0.40

    

    # 2. VELIČINA (30%)

    if item.size in [user.size, user.size±1]:

        score += 0.30

    

    # 3. POPULARNOST (15%)

    score += item.total_likes / max_likes * 0.15

    

    # 4. CENA (10%)

    if item.price <= user.budget:

        score += 0.10

    

    # 5. LOKACIJA (5%)

    if same_city(user, item.seller):

        score += 0.05

    

    # 6. AKTIVNOST PRODAVCA (bonus)

    if seller.active_last_24h:

        score += 0.05

        

ranked_feed = sort(items, by=score, descending=True)

```



**Raznolikost:**  

- 90% itema = visoki score  

- 10% itema = exploration (novi stilovi, boje, brendovi)



---



#### 3.2 COLD START STRATEGIJA



**0-10 swipe-ova:**  

→ Najpopularniji itemi iz kviza kategorija



**10-30 swipe-ova:**  

→ 70% kviz preference + 30% najpopularnije



**30+ swipe-ova:**  

→ Full AI personalizacija



---



### 4. DATA REQUIREMENTS (šta AI prima)



#### 4.1 ITEM (oglas)



**Obavezno (korisnik unosi):**

- ✅ Slika (min 1)

- ✅ Kategorija (jakna, pantalone, cipele...)

- ✅ Pol (M/Ž/Unisex)

- ✅ Veličina (S/M/L/XL ili brojevi)

- ✅ Stanje (novo/kao novo/nošeno/oštećeno)

- ✅ Grad/lokacija



**Opciono (korisnik može uneti ili AI generiše):**

- 🤖 Opis (AI piše ako korisnik ne želi)

- 🤖 Brend (AI detektuje iz slike)

- 🤖 Boja (AI detektuje iz slike)

- 💰 Cena (NE - korisnik ne unosi, ljudi nude!)



---



#### 4.2 AI AUTO-DETEKCIJA (iz slike)



**Prioritet za MVP:**

1. ✅ **Boja** (potrebno za stilsku preporuku)

2. ✅ **Kategorija** (jakna/majica/pantalone - validacija)

3. ✅ **Stil** (casual/formal/streetwear - core feature)

4. ⏳ **Brend** (nice to have - logo detection)



**NE radimo:**

- ❌ Kvalitet  

- ❌ Stanje (oštećenja)  

→ Prepuštamo korisniku



---



#### 4.3 AI OPIS (human-like text)



**Stil:**  

```

❌ Loše: "Crna kožna jakna, veličina M, odličnog stanja. Nošena 2 puta."

✅ Dobro: "Top kožna jakna, bukvalno kao nova 🖤 Nosila 2x max."

Pravila:

Casual ton (kao da piše mlad čovek)

Emoji (1-2 max)

Kratko (2-3 rečenice)

BEZ AI fraza ("savršeno", "odlično stanje")



5. SUCCESS METRICS (šta je uspeh?)

Primarna metrika: 🎯 Engagement (vreme u app-u)

Sekundarne metrike:

Broj matcheva (cilj: 1 match / 20 swipe-ova)

Conversion (cilj: 1 transakcija / 2 matcha)

Greška: ❌ Korisnik odustane od app-a ❌ Mnogo skip-ova zaredom (>30)



6. TIMELINE & MVP SCOPE

Timeline: 6+ meseci

MVP mora imati:

✅ Personalizovani feed (AI rangira)

✅ Cold start (kviz + popularni itemi)

✅ AI detekcija boje/kategorije/stila

⏳ AI opis (nice to have)

⏳ Pinterest similarity (later)



🚨 KRITIČNE NAPOMENE ZA AI DEVELOPMENT

❗️ NE TRENINRAŠ MODEL OD NULE

Zašto?

Nemaš dovoljno podataka (trebaš 100k+ slika)

Nemaš GPU infrastrukturu

Nemaš 6 meseci samo za trening

Umesto toga: ✅ Koristiš pre-trained modele (CLIP, ResNet) ✅ Koristiš embeddings (vektore) ✅ Eventualno fine-tuneš kasnije (kada imaš podatke)



❗️ FIREBASE JE OK ZA PODATKE, ALI NE ZA AI

Firebase:

Users, Items, Interactions, Matches ✅

Tvoj AI server:

Embeddings (vektori)

Similarity search

Ranking logika

Zašto? Firebase ne podržava vector search efikasno.



