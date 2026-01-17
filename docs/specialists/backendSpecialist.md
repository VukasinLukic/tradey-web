# Backend Specialist - Node.js/Express Guidelines

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js + TypeScript
- **Database**: Firebase Admin SDK (Firestore, Storage)
- **Credits DB**: Supabase (PostgreSQL)
- **Auth**: Firebase Auth (JWT verification)
- **Validation**: Zod schemas

---

## File Locations

```
backend/src/
├── config/           # Firebase, Supabase, CORS config
├── middleware/       # Auth, rate limiting, error handling
├── routes/           # Express route definitions
├── controllers/      # Business logic
├── services/         # Firestore, Storage abstractions
├── utils/            # Sanitization, helpers
└── server.ts         # Entry point
```

---

## Key Patterns

### Route Definition
```typescript
// routes/example.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as controller from '../controllers/exampleController';

const router = Router();

// Public routes
router.get('/public', controller.getPublic);

// Protected routes
router.get('/protected', authMiddleware, controller.getProtected);
router.post('/create', authMiddleware, controller.create);

export default router;
```

### Controller Pattern
```typescript
// controllers/exampleController.ts
import { Request, Response } from 'express';
import { z } from 'zod';
import { firestoreService } from '../services/firestore.service';

const createSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
});

export async function create(req: Request, res: Response) {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate input
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    // Business logic
    const result = await firestoreService.createDocument('collection', {
      ...parsed.data,
      userId,
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

### Firestore Service Usage
```typescript
import { firestoreService } from '../services/firestore.service';

// Get document
const doc = await firestoreService.getDocument('users', 'userId');

// Create document
const newDoc = await firestoreService.createDocument('posts', data);

// Update document
await firestoreService.updateDocument('posts', 'postId', { title: 'New' });

// Query documents
const posts = await firestoreService.queryDocuments('posts', [
  { field: 'userId', operator: '==', value: userId },
  { field: 'status', operator: '==', value: 'active' },
]);
```

### Supabase for Credits
```typescript
// config/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// services/creditService.ts
export async function consumeCredit(userId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('consume_credit', {
    p_user_id: userId,
  });

  if (error) throw error;
  return data.success;
}
```

---

## Security Checklist

Before submitting code, verify:

- [ ] Auth middleware on ALL protected routes
- [ ] Input validation with Zod for ALL endpoints
- [ ] XSS sanitization on user-generated content
- [ ] Rate limiting on public/sensitive endpoints
- [ ] No hardcoded secrets or API keys
- [ ] Error messages don't leak sensitive info
- [ ] Ownership check before update/delete operations

---

## API Response Format

### Success Response
```typescript
res.json({
  success: true,
  data: { /* result */ },
  meta: { /* pagination, etc */ }
});
```

### Error Response
```typescript
res.status(400).json({
  error: 'Validation failed',
  details: { /* field errors */ }
});

res.status(401).json({ error: 'Unauthorized' });
res.status(403).json({ error: 'Forbidden' });
res.status(404).json({ error: 'Not found' });
res.status(500).json({ error: 'Internal server error' });
```

---

## Adding New Routes

1. Create route file: `routes/feature.routes.ts`
2. Create controller: `controllers/featureController.ts`
3. Register in `routes/index.ts`:
```typescript
import featureRoutes from './feature.routes';
router.use('/feature', featureRoutes);
```

---

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Firebase (via service account JSON)
GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...

# AI Server
AI_SERVER_URL=http://localhost:8000

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## Testing

```bash
# Run linter
npm run lint

# Start dev server
npm run dev

# Test endpoints
curl http://localhost:5000/api/health
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/posts
```

---

## Common Gotchas

1. **Firebase paths** - Use constants from `shared/constants/firebasePaths.ts`
2. **req.user** - Only available after `authMiddleware`
3. **Async errors** - Always wrap in try/catch or use error middleware
4. **Timestamps** - Use `new Date()` for Firestore, it converts to Timestamp
5. **File uploads** - Use `multer` with `fileValidation` middleware
