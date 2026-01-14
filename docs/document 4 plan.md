otvoren



📄 DOKUMENT 4: IMPLEMENTATION ROADMAP

NEDELJA PO NEDELJA PLAN

NEDELJA 1: Setup & Fundamentals

Cilj: Podigni server i basic API

Podigni server (gore objašnjeno)

Kreiraj FastAPI skeleton

Implementiraj /health endpoint

Implementiraj /api/process-item (bez ML, samo test)

Connect Firebase

Test: Upload item → vidi ga u Firebase

Učenje:

FastAPI basics

Firebase Admin SDK



NEDELJA 2: Image Embeddings

Cilj: CLIP radi

Implementiraj embeddings.py

Test: Slika → CLIP → vektor

Implementiraj color detection (basic, PIL)

Setup Qdrant/FAISS

Test: Store embedding u vector DB

Učenje:

CLIP basics

Vector similarity



NEDELJA 3: Recommendation Engine

Cilj: Feed radi

Implementiraj ranking.py

Implementiraj /api/recommend

Test: User swipe → update profile → novi feed

Implementiraj cold start

Učenje:

Cosine similarity

Weighted scoring



NEDELJA 4: Text & Description

Cilj: AI generiše opise

Implementiraj Sentence Transformer

Implementiraj /api/generate-description

Test: Slika → opis (human-like)

Učenje:

Text generation

Prompt engineering



NEDELJA 5-6: Integration & Testing

Cilj: Sve zajedno radi

Integriši sa backend-om (Firebase Functions)

End-to-end test (Frontend → Firebase → AI → Frontend)

Performance testing (1000 requests)

Bug fixing



🎯 MVP DEFINITION OF DONE

AI server je spreman kada:

✅ Korisnik postavi item → AI generiše embedding + opis ✅ Korisnik otvori feed → AI rangira 50 itema ✅ Korisnik swipe-uje → AI uči stil ✅ Cold start radi (novi korisnik dobija dobar feed) ✅ Latency < 500ms per request ✅ Server radi 24/7 (systemd)





