# Backend - TODO Lista

## Quick Overview

- [ ] TASK-001: Add Interactions Collection
- [ ] TASK-002: Implement Credit System with Supabase
- [ ] TASK-003: Add Feed Endpoint with AI Integration
- [ ] TASK-004: Add User Preferences Endpoint

---

## Detailed Tasks

### TASK-001: Add Interactions Collection

**Priority:** P0
**Effort:** 4 hours

#### Description
Track every swipe, view, and match for AI learning. Currently no interactions tracking exists in the system.

#### Files to Create
- `backend/src/shared/types/interaction.ts` - Interaction types
- `backend/src/routes/interactions.routes.ts` - Interaction endpoints
- `backend/src/controllers/interactionController.ts` - Business logic

#### Files to Modify
- `backend/src/shared/constants/firebasePaths.ts` - Add INTERACTIONS path
- `backend/src/routes/index.ts` - Register new routes

#### Schema
```typescript
interface Interaction {
  id: string;
  userId: string;
  itemId: string;
  type: 'swipe' | 'view' | 'match';
  direction?: 'left' | 'right';
  timestamp: Date;
  feedPosition?: number;
}
```

#### Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interactions/swipe` | Record a swipe action |
| POST | `/api/interactions/view` | Track item view |
| GET | `/api/interactions/:userId` | Get user history (last 100) |

#### Acceptance Criteria
- [ ] POST /api/interactions/swipe records swipe with direction
- [ ] POST /api/interactions/view tracks item views with timestamp
- [ ] GET /api/interactions/:userId returns paginated history
- [ ] All endpoints protected with authMiddleware
- [ ] Input validation with Zod schemas

---

### TASK-002: Implement Credit System with Supabase

**Priority:** P0
**Effort:** 8 hours

#### Description
Implement a credit system using Supabase PostgreSQL for atomic transactions. Credits are consumed when users match with items.

#### Why Supabase
- Free tier (500MB Postgres)
- Atomic transactions (critical for credits)
- Easy setup and good TypeScript support

#### Files to Create
- `backend/src/config/supabase.ts` - Supabase client initialization
- `backend/src/services/creditService.ts` - Credit business logic
- `backend/src/routes/credits.routes.ts` - Credit endpoints
- `backend/src/controllers/creditController.ts` - Controller logic

#### Files to Modify
- `backend/src/routes/index.ts` - Register credit routes
- `backend/.env` - Add SUPABASE_URL and SUPABASE_ANON_KEY

#### Database Schema (Create in Supabase Dashboard)
```sql
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
```

#### Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/credits/balance` | Get current credit balance |
| POST | `/api/credits/consume` | Consume 1 credit (for match) |
| POST | `/api/credits/add` | Add credits (after purchase) |
| GET | `/api/credits/history` | Get transaction history |

#### Critical Requirements
- Credit consumption MUST be atomic with match creation
- Use database transactions for all credit operations
- Never allow negative credit balance

#### Acceptance Criteria
- [ ] Supabase client properly initialized
- [ ] GET /api/credits/balance returns current credits
- [ ] POST /api/credits/consume atomically decrements credits
- [ ] Consuming with 0 credits returns 402 Payment Required
- [ ] Transaction history logged for all operations
- [ ] New users initialized with 3 free credits

---

### TASK-003: Add Feed Endpoint with AI Integration

**Priority:** P0
**Effort:** 6 hours

#### Description
Create a feed endpoint that integrates with the AI server for personalized recommendations, with fallback to popular items for cold start.

#### Files to Create
- `backend/src/services/aiClient.ts` - AI server HTTP client

#### Files to Modify
- `backend/src/routes/posts.routes.ts` - Add /feed route
- `backend/src/controllers/postController.ts` - Add getFeed method
- `backend/.env` - Add AI_SERVER_URL

#### Logic Flow
```
1. Check user swipe count
2. If swipe_count < 30 (cold start):
   → Return popular items + quiz preferences
3. If swipe_count >= 30 (personalized):
   → Call AI server POST /api/recommend
   → Enrich response with Firebase item details
4. Return ranked feed with coldStart flag
```

#### AI Client Implementation
```typescript
// services/aiClient.ts
import axios from 'axios';

const AI_SERVER_URL = process.env.AI_SERVER_URL || 'http://localhost:8000';

export async function getRecommendations(params: {
  userId: string;
  userPreferences: object;
  userStyleVector?: number[];
  excludeItems: string[];
  count: number;
}): Promise<string[]> {
  try {
    const response = await axios.post(`${AI_SERVER_URL}/api/recommend`, params, {
      timeout: 5000
    });
    return response.data.itemIds;
  } catch (error) {
    console.error('AI server unavailable, using fallback');
    return []; // Fallback handled in controller
  }
}
```

#### Endpoint
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts/feed` | Get personalized feed |

#### Query Parameters
- `limit` (optional): Number of items (default: 50)
- `offset` (optional): Pagination offset

#### Response Format
```typescript
{
  success: true,
  data: {
    items: Post[],
    coldStart: boolean,
    nextOffset: number
  }
}
```

#### Acceptance Criteria
- [ ] GET /api/posts/feed?limit=50 returns ranked items
- [ ] Cold start fallback works when AI server unavailable
- [ ] Response includes coldStart: boolean flag
- [ ] Excluded items (already swiped) not returned
- [ ] Items enriched with full Firebase data

---

### TASK-004: Add User Preferences Endpoint

**Priority:** P1
**Effort:** 3 hours

#### Description
Store quiz answers for cold start recommendations. Extend existing user profile with preferences object.

#### Files to Modify
- `backend/src/controllers/userController.ts` - Add preferences methods
- `backend/src/routes/users.routes.ts` - Add preferences routes
- `shared/src/types/user.ts` - Extend UserProfile type

#### Schema Addition to UserProfile
```typescript
interface UserProfile {
  // ... existing fields
  preferences?: {
    styles: string[];        // ['casual', 'streetwear', 'vintage']
    sizes: string[];         // ['S', 'M']
    interestedIn: string[];  // ['female', 'unisex']
    budgetMax?: number;      // In RSD
    favoriteColors?: string[];
  };
  onboardingCompleted?: boolean;
}
```

#### Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me/preferences` | Get current preferences |
| PUT | `/api/users/me/preferences` | Update preferences |
| POST | `/api/users/me/onboarding` | Complete onboarding quiz |

#### Validation Schema
```typescript
const preferencesSchema = z.object({
  styles: z.array(z.string()).min(1).max(5),
  sizes: z.array(z.string()).min(1),
  interestedIn: z.array(z.enum(['male', 'female', 'unisex'])),
  budgetMax: z.number().positive().optional(),
  favoriteColors: z.array(z.string()).optional()
});
```

#### Acceptance Criteria
- [ ] GET /api/users/me/preferences returns saved preferences
- [ ] PUT /api/users/me/preferences validates and saves
- [ ] POST /api/users/me/onboarding marks onboarding complete
- [ ] All fields validated with Zod
- [ ] Preferences used by feed endpoint for cold start

---

## Dependencies

```
npm install @supabase/supabase-js
```

## Environment Variables to Add

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# AI Server
AI_SERVER_URL=http://localhost:8000
```
