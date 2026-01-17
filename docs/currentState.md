Current State Analysis
What's Already Working:
✅ Full authentication with Firebase JWT
✅ Posts CRUD with image upload (1-5 images, validation, XSS protection)
✅ Social features (follow/unfollow, likes, saves, comments)
✅ Real-time chat with pagination
✅ User profiles with ratings/reviews
✅ Admin panel with ban/delete capabilities
✅ Report system for moderation
✅ Security (rate limiting, Helmet, CORS)
Critical Gaps (P0 - Must Fix):
No AI ranking - feed is chronological, not personalized
No credit system - monetization impossible
No swipe mechanics - core Tinder-like UX missing
No interactions tracking - can't learn user preferences
No match logic with credit consumption
The Plan Structure
Phase
Duration
Focus
Phase 1
Week 1-2
Backend: Credits (Supabase), Interactions, Feed endpoint
Phase 2
Week 3-5
AI Server: CLIP embeddings, FAISS, Ranking algorithm
Phase 3
Week 4-5
Frontend: Swipe UX, Quiz, Credit display
Phase 4
Week 6-8
Mobile: React Native foundation with swipe cards

Key Architecture Decisions
Credits in Supabase (not Firebase) - atomic transactions, free 500MB Postgres
FAISS for MVP (not Pinecone) - free, in-memory, fast enough for 50k items
Railway free tier for AI server - $5 credit, sufficient for testing
Shared hooks between web and mobile - 70% code reuse possible
Claude’s Plan
TRADEY - MASTER IMPLEMENTATION PLAN
Executive Summary
Current State: Solid MVP with working authentication, posts CRUD, chat, social features (follow/like), and admin panel. Backend is well-structured with proper security (JWT, XSS sanitization, rate limiting).
Critical Gaps:
❌ No AI ranking - Feed is not personalized (P0)
❌ No credit system - Monetization not implemented (P0)
❌ No swipe mechanics - Core UX missing (P0)
❌ No interactions tracking - Can't learn user preferences (P0)
❌ No mobile app - Target audience is mobile-first (P1)
Timeline: 8 weeks to functional MVP with AI + Credits + Mobile foundation

Architecture Overview
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React Web + RN Mobile)          │
└─────────────────────────────┬───────────────────────────────┘
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                 │
│  • Firebase Firestore (users, posts, chats, interactions)   │
│  • PostgreSQL via Supabase (credits, transactions) - NEW    │
└─────────────────────────────┬───────────────────────────────┘
                              │ HTTP API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    AI SERVER (Python/FastAPI)                │
│  • CLIP embeddings (512-dim)                                 │
│  • Sentence Transformers (384-dim)                          │
│  • FAISS vector search (in-memory for MVP)                  │
└─────────────────────────────────────────────────────────────┘


Phase 1: Backend Enhancements (Week 1-2)
TASK-001: Add Interactions Collection
Priority: P0 | Effort: 4 hours
Current State: No interactions tracking exists
Target State: Track every swipe for AI learning
Files to modify:
backend/src/shared/types/ - Add interaction types
backend/src/shared/constants/firebasePaths.ts - Add INTERACTIONS
backend/src/routes/ - Create interactions.routes.ts
backend/src/controllers/ - Create interactionController.ts
Schema:
interface Interaction {
  id: string;
  userId: string;
  itemId: string;
  type: 'swipe' | 'view' | 'match';
  direction?: 'left' | 'right';
  timestamp: Date;
  feedPosition?: number;
}

Acceptance Criteria:
 POST /api/interactions/swipe records swipe
 POST /api/interactions/view tracks item views
 GET /api/interactions/:userId returns user history (last 100)

TASK-002: Implement Credit System with Supabase
Priority: P0 | Effort: 8 hours
Why Supabase: Free tier (500MB Postgres), atomic transactions, easy setup
Files to create:
backend/src/config/supabase.ts - Supabase client init
backend/src/services/creditService.ts - Credit business logic
backend/src/routes/credits.routes.ts - Credit endpoints
Database Schema (in Supabase):
-- users_credits
CREATE TABLE users_credits (
  user_id TEXT PRIMARY KEY,
  credits_available INTEGER DEFAULT 3,
  plan_type TEXT DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'match_consume', 'purchase', 'bonus'
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for fast lookups
CREATE INDEX idx_transactions_user ON transactions(user_id, created_at DESC);

Endpoints:
GET /api/credits/balance - Get current credits
POST /api/credits/consume - Consume 1 credit (for match)
POST /api/credits/add - Add credits (after purchase)
Critical: Credit consumption MUST be atomic with match creation

TASK-003: Add Feed Endpoint with AI Integration
Priority: P0 | Effort: 6 hours
Files to modify:
backend/src/routes/posts.routes.ts - Add /feed
backend/src/controllers/postController.ts - Add getFeed method
backend/src/services/aiClient.ts - Create AI server client
Logic:
1. Check user swipe count (cold start threshold: 30)
2. If cold start → return popular items + quiz preferences
3. If personalized → call AI server /api/recommend
4. Enrich with Firebase item details
5. Return ranked feed

Acceptance Criteria:
 GET /api/posts/feed?limit=50 returns AI-ranked items
 Cold start fallback works when AI server unavailable
 Response includes coldStart: boolean flag

TASK-004: Add User Preferences Endpoint
Priority: P1 | Effort: 3 hours
Current State: preferences endpoint exists but incomplete
Target: Store quiz answers for cold start
Schema additions to UserProfile:
preferences: {
  styles: string[];        // ['casual', 'streetwear', 'vintage']
  sizes: string[];         // ['S', 'M']
  interestedIn: string[];  // ['female', 'unisex']
  budgetMax?: number;      // In RSD
  favoriteColors?: string[];
}


Phase 2: AI Server MVP (Week 3-5)
TASK-005: Setup AI Server Structure
Priority: P0 | Effort: 4 hours
Folder structure:
tradey-ai-server/
├── app/
│   ├── main.py              # FastAPI app
│   ├── config.py            # Settings
│   ├── api/
│   │   ├── process_item.py  # POST /api/process-item
│   │   ├── recommend.py     # POST /api/recommend
│   │   └── health.py        # GET /health
│   ├── ml/
│   │   ├── embeddings.py    # CLIP + Sentence Transformers
│   │   ├── ranking.py       # Scoring algorithm
│   │   └── cold_start.py    # Cold start strategy
│   └── db/
│       └── vector_store.py  # FAISS wrapper
├── data/
│   └── faiss_index/         # Persisted index
├── requirements.txt
└── Dockerfile

Deployment: Railway free tier ($5 credit) or Render free tier

TASK-006: Implement Image Embeddings (CLIP)
Priority: P0 | Effort: 6 hours
Model: openai/clip-vit-base-patch32 (300ms/image on CPU)
Implementation:
# ml/embeddings.py
from transformers import CLIPModel, CLIPProcessor
import torch

class ImageEmbedder:
    def __init__(self):
        self.model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        self.processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

    def embed_image(self, image) -> np.ndarray:
        inputs = self.processor(images=image, return_tensors="pt")
        with torch.no_grad():
            features = self.model.get_image_features(**inputs)
        normalized = features / features.norm(dim=-1, keepdim=True)
        return normalized.cpu().numpy()[0]  # Shape: (512,)

Acceptance Criteria:
 Image URL → 512-dim vector
 Processing time < 500ms
 Works without GPU

TASK-007: Implement Vector Store (FAISS)
Priority: P0 | Effort: 4 hours
Why FAISS for MVP: In-memory, fast, simple. Migrate to Qdrant/Pinecone later.
Implementation:
# db/vector_store.py
import faiss
import numpy as np
import json

class VectorStore:
    def __init__(self, dimension=512):
        self.index = faiss.IndexFlatIP(dimension)  # Inner product = cosine on normalized
        self.item_ids = []  # Mapping index → item_id

    def add(self, item_id: str, embedding: np.ndarray):
        self.index.add(embedding.reshape(1, -1))
        self.item_ids.append(item_id)

    def search(self, query: np.ndarray, k=50) -> list[tuple[str, float]]:
        scores, indices = self.index.search(query.reshape(1, -1), k)
        return [(self.item_ids[i], scores[0][j])
                for j, i in enumerate(indices[0]) if i < len(self.item_ids)]


TASK-008: Implement Feed Ranking Algorithm
Priority: P0 | Effort: 8 hours
Scoring formula (from requirements):
score = (
    0.40 * style_similarity(user_vector, item_embedding) +
    0.30 * size_match(user_sizes, item_size) +
    0.15 * popularity_score(item_likes / max_likes) +
    0.10 * budget_match(item_price, user_budget) +
    0.05 * location_match(user_city, item_location)
)

Diversity: 90% ranked + 10% exploration (random from remaining)
Endpoint: POST /api/recommend
{
  "userId": "abc123",
  "userPreferences": {"sizes": ["M"], "city": "Beograd"},
  "userStyleVector": [0.1, -0.3, ...],  // Computed from liked items
  "excludeItems": ["item1", "item2"],
  "count": 50
}


TASK-009: Implement Cold Start Strategy
Priority: P0 | Effort: 4 hours
Strategy:
0-10 swipes: Top 50 popular items matching quiz preferences
10-30 swipes: 70% quiz-based + 30% from early likes
30+ swipes: Full personalization
Implementation:
def get_feed(user_id, user_data, swipe_count):
    if swipe_count < 10:
        return get_popular_by_quiz(user_data['preferences'])
    elif swipe_count < 30:
        quiz_items = get_popular_by_quiz(user_data['preferences'], limit=35)
        behavioral = get_from_early_likes(user_id, limit=15)
        return shuffle(quiz_items + behavioral)
    else:
        return get_personalized(user_id, user_data)


TASK-010: Implement User Style Vector Computation
Priority: P0 | Effort: 4 hours
Logic: Average embedding of liked items = user style
def compute_user_style(user_id, liked_item_ids):
    embeddings = [vector_store.get(item_id) for item_id in liked_item_ids]
    if not embeddings:
        return None  # Use cold start

    style_vector = np.mean(embeddings, axis=0)
    style_vector = style_vector / np.linalg.norm(style_vector)
    return style_vector

Cache: Store in user_profiles.json, refresh on new likes

Phase 3: Frontend Swipe UX (Week 4-5)
TASK-011: Add Swipe Feed Component
Priority: P0 | Effort: 8 hours
Files to create:
frontend/src/pages/Feed.tsx - Swipe feed page
frontend/src/components/feed/SwipeCard.tsx - Card component
frontend/src/components/feed/SwipeButtons.tsx - Skip/Like buttons
frontend/src/hooks/useFeed.ts - Feed data fetching
UX Requirements:
Cards stack (show current + next preview)
Swipe left = skip, right = like
Button alternatives for accessibility
Loading state while fetching more

TASK-012: Add Onboarding Quiz
Priority: P1 | Effort: 6 hours
Files to create:
frontend/src/pages/Onboarding.tsx
frontend/src/components/onboarding/QuizStep.tsx
frontend/src/components/onboarding/StyleSelector.tsx
Questions:
Gender preference (M/F/Unisex)
Sizes (S/M/L/XL - multi-select)
Styles (Casual/Streetwear/Vintage/Formal - multi-select)
Favorite colors (visual picker)

TASK-013: Add Credit Display & Paywall
Priority: P0 | Effort: 4 hours
Files:
frontend/src/components/ui/CreditBadge.tsx
frontend/src/pages/Paywall.tsx
frontend/src/hooks/useCredits.ts
Logic:
Display credits in header
When match occurs:
Check credits > 0
If no → show paywall
If yes → consume credit → open chat

Phase 4: Mobile Foundation (Week 6-8)
TASK-014: Setup React Native with Expo
Priority: P1 | Effort: 4 hours
npx create-expo-app tradey-mobile --template blank-typescript
cd tradey-mobile
npx expo install react-native-gesture-handler react-native-reanimated
npm install @react-navigation/native @react-navigation/stack
npm install axios react-query

Folder structure:
tradey-mobile/
├── src/
│   ├── screens/
│   ├── components/
│   ├── services/api.ts    # Reuse from web
│   ├── hooks/             # Reuse from web
│   └── navigation/
├── App.tsx
└── app.json


TASK-015: Implement Mobile Swipe Cards
Priority: P1 | Effort: 8 hours
Tech: react-native-gesture-handler + react-native-reanimated
Key component: SwipeCard with gesture handling
Pan gesture for swipe
Spring animation for snap back
Opacity change based on direction

TASK-016: Mobile Auth Integration
Priority: P1 | Effort: 4 hours
Approach: Use Firebase Auth React Native SDK
Same Firebase project as web
Token passed to backend in same way

Deployment Strategy
Backend (Current)
Platform: Railway or Render
Cost: Free tier sufficient for MVP
AI Server (New)
Platform: Railway ($5 free credit) or Render
Note: First request will be slow (model loading ~30s), then cached
Alternative: If budget tight, run batch processing 1x/day
Database
Firebase Firestore: Keep for real-time (chat, posts)
Supabase: Add for credits (free 500MB Postgres)

Risk Mitigation
Risk
Likelihood
Impact
Mitigation
AI server too slow
Medium
High
Cache popular items, cold start fallback
FAISS data loss on restart
High
Medium
Persist to disk, rebuild from Firebase on startup
Credits bypassed
Low
Critical
All credit logic server-side, atomic transactions
Railway free tier exceeded
Medium
Medium
Monitor usage, upgrade if needed ($5/mo)


Success Metrics
Week 2: Backend with credits + interactions working
Week 4: AI server returning ranked feed
Week 6: Web app with swipe UX complete
Week 8: Mobile app in TestFlight/Play Console
Technical KPIs:
Feed latency < 500ms (including AI)
Cold start working for 0 swipes
Credit transactions 100% atomic

Testing Strategy
Backend
 Integration tests for credit consumption
 API tests for all new endpoints
AI Server
 Unit tests for embedding generation
 Test ranking with mock data
End-to-End
 Swipe → AI update → new feed reflects change
 Match → credit consumed → chat opens

Verification Steps
After implementation, verify:
Create account → Quiz appears → Preferences saved
Open feed → Popular items shown (cold start)
Swipe 30+ items → Feed becomes personalized
Like item mutually → Match created → Credit consumed → Chat opens
Credits = 0 → Paywall shown → Can't open chat until purchase

Files to Modify (Summary)
Backend (Existing)
backend/src/routes/index.ts - Add new routes
backend/src/shared/constants/firebasePaths.ts - Add INTERACTIONS
backend/src/shared/types/ - Add new types
Backend (New)
backend/src/config/supabase.ts
backend/src/services/creditService.ts
backend/src/services/aiClient.ts
backend/src/routes/credits.routes.ts
backend/src/routes/interactions.routes.ts
backend/src/controllers/interactionController.ts
backend/src/controllers/creditController.ts
Frontend (New)
frontend/src/pages/Feed.tsx
frontend/src/pages/Onboarding.tsx
frontend/src/pages/Paywall.tsx
frontend/src/components/feed/*
frontend/src/components/onboarding/*
frontend/src/hooks/useFeed.ts
frontend/src/hooks/useCredits.ts
AI Server (New Repo)
tradey-ai-server/ (entire new project)

Next Steps
Approve this plan → I'll start with TASK-001 (Interactions Collection)
Setup Supabase account → Create project for credits
Create tradey-ai-server repo → I'll help structure it
Questions to resolve during implementation:
Stripe or local payment for Serbia? (affects credit purchase flow)
App name for stores? (needed for Expo config)
Stayed in plan mode

