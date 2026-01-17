# TRADEY AI Specialist - Claude Code Guidelines

## Your Role

You are an AI assistant helping build **TRADEY** - a Tinder-style second-hand clothing trading platform for the Serbian market. Your job is to write clean, secure, and maintainable code following the established patterns.

---

## Workflow (Follow This Order)

### 1. Understand Before Acting
- **Always read relevant files** before making changes
- Check existing patterns in the codebase
- Look at similar implementations for reference
- Ask clarifying questions if requirements are unclear

### 2. Plan Before Implementing
- Break complex tasks into smaller steps
- Identify ALL files that need modification
- Consider edge cases and error handling
- Check if similar code already exists to reuse

### 3. Implement Incrementally
- Make one logical change at a time
- Test after each significant change
- Keep commits focused and atomic
- Don't over-engineer - solve the current problem

### 4. Verify Before Moving On
- Run linters: `npm run lint` (frontend/backend)
- Test locally before committing
- Check that existing functionality still works
- Verify API responses match expected format

---

## Project Context

### Architecture Overview
```
tradey-web/           # Main monorepo
├── frontend/         # React 19 + Vite + Tailwind CSS 4
├── backend/          # Node.js + Express + Firebase Admin
└── shared/           # TypeScript types (shared between FE/BE)

tradey-ai-server/     # Separate repo - Python/FastAPI
tradey-mobile/        # Separate repo - React Native/Expo
```

### Data Flow
```
Frontend (React)
    ↓ HTTP + JWT
Backend (Express)
    ↓ Firebase Admin SDK
Firestore + Storage

Backend (Express)
    ↓ HTTP
AI Server (FastAPI)
    ↓
FAISS Vector Store
```

### Database Strategy
- **Firestore**: Users, Posts, Chat, Social (real-time)
- **Supabase PostgreSQL**: Credits, Transactions (atomic)
- **FAISS**: Item embeddings (in-memory, persisted)

---

## Critical Rules (MUST Follow)

### 1. Data Access
- Frontend **NEVER** writes directly to Firestore
- ALL data mutations go through backend API
- Backend validates ownership before updates/deletes

### 2. Authentication
- All protected routes require `Authorization: Bearer <token>`
- Backend uses `authMiddleware` to verify JWT
- Access `req.user.uid` for authenticated user ID

### 3. Security
- Validate ALL inputs with Zod schemas
- Sanitize user content to prevent XSS
- Never commit `.env` or `firebase-service-account.json`
- Use constants from `shared/` - never hardcode paths

### 4. Code Style
- Named exports (not default exports)
- Function declarations for React components
- Early returns for better readability
- Descriptive names: `hasLiked`, `isLoading`, `handleSubmit`

---

## Current Phase Focus

Check `docs/plans/` for current TODO items:
- `backend-todo.md` - Backend tasks
- `frontend-todo.md` - Frontend tasks
- `ai-server-todo.md` - AI Server tasks
- `mobile-todo.md` - Mobile app tasks

Priority order: P0 > P1 > P2

---

## Common Patterns

### Backend Controller
```typescript
export async function methodName(req: Request, res: Response) {
  try {
    const userId = req.user?.uid;
    // Validate input
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.message });
    }
    // Business logic
    const result = await service.doSomething(parsed.data);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

### Frontend Component
```typescript
export function ComponentName({ prop }: Props) {
  const { data, isLoading, error } = useQuery(...);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="flex flex-col gap-4">
      {/* Content */}
    </div>
  );
}
```

### API Call (Frontend)
```typescript
import { api } from '../services/api';

// api.ts automatically adds JWT token
const response = await api.get('/posts/feed');
const data = await api.post('/interactions/swipe', { itemId, direction });
```

---

## File Locations Quick Reference

### Backend
| Type | Location |
|------|----------|
| Routes | `backend/src/routes/*.routes.ts` |
| Controllers | `backend/src/controllers/*Controller.ts` |
| Services | `backend/src/services/*.service.ts` |
| Middleware | `backend/src/middleware/*.ts` |
| Config | `backend/src/config/*.ts` |

### Frontend
| Type | Location |
|------|----------|
| Pages | `frontend/src/pages/*.tsx` |
| Components | `frontend/src/components/{domain}/*.tsx` |
| Hooks | `frontend/src/hooks/use*.ts` |
| Services | `frontend/src/services/*.ts` |
| Store | `frontend/src/store/*.ts` |

---

## Common Mistakes to Avoid

1. **Don't commit secrets** - `.env`, `firebase-service-account.json`
2. **Don't skip auth middleware** on protected routes
3. **Don't forget loading/error states** in components
4. **Don't create new files** when editing existing ones works
5. **Don't over-engineer** - solve the current problem only
6. **Don't hardcode Firebase paths** - use `shared/constants`
7. **Don't make breaking API changes** without updating frontend

---

## Testing Commands

```bash
# Backend
cd backend
npm run lint
npm run dev          # http://localhost:5000

# Frontend
cd frontend
npm run lint
npm run dev          # http://localhost:5173
npm run build        # Verify production build

# Full stack
docker-compose up --build
```

---

## Brand Guidelines (for UI work)

### Colors
- Primary Red: `#a61f1e`
- Secondary Blue: `#a2c8ff`
- Background: `#000000`

### Typography
- Headings: Anton font (bold, geometric)
- Body: Serif (EB Garamond / Cormorant Garamond)

### Tone
- Direct but friendly
- Modern rebel against overconsumption
- "Mi ne kupujemo stil. Mi ga stvaramo."
