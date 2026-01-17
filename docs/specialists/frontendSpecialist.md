# Frontend Specialist - React Guidelines

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **State**: Zustand (global), React Query (server state)
- **Auth**: Firebase Client SDK (Auth only)
- **HTTP**: Axios (via `services/api.ts`)

---

## File Locations

```
frontend/src/
├── components/       # Organized by domain
│   ├── auth/         # Login, Signup forms
│   ├── chat/         # Chat interface
│   ├── feed/         # Swipe cards (new)
│   ├── layout/       # Header, Footer, Sidebar
│   ├── post/         # Post creation, display
│   ├── ui/           # Reusable: Button, Input, Modal
│   └── user/         # Profile, Avatar
├── hooks/            # Custom hooks
├── pages/            # Route-level components
├── services/         # API client
├── store/            # Zustand stores
├── constants/        # App constants
├── types/            # TypeScript types
└── utils/            # Helper functions
```

---

## Key Patterns

### Component Structure
```typescript
// components/feature/FeatureCard.tsx
import { useState } from 'react';
import { Button } from '../ui/Button';
import { useFeature } from '../../hooks/useFeature';

interface FeatureCardProps {
  id: string;
  title: string;
  onAction?: () => void;
}

export function FeatureCard({ id, title, onAction }: FeatureCardProps) {
  const { data, isLoading, error } = useFeature(id);
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) return <FeatureCardSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="rounded-lg bg-surface p-4">
      <h3 className="text-lg font-bold">{title}</h3>
      {isExpanded && <p className="mt-2 text-secondary">{data.description}</p>}
      <Button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Less' : 'More'}
      </Button>
    </div>
  );
}
```

### Custom Hook
```typescript
// hooks/useFeature.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export function useFeature(id: string) {
  return useQuery({
    queryKey: ['feature', id],
    queryFn: () => api.get(`/features/${id}`).then(r => r.data),
  });
}

export function useCreateFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFeatureInput) =>
      api.post('/features', data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
    },
  });
}
```

### API Calls
```typescript
// services/api.ts handles auth automatically
import { api } from '../services/api';

// GET request
const response = await api.get('/posts/feed');

// POST request
const data = await api.post('/interactions/swipe', {
  itemId: '123',
  direction: 'right',
});

// With query params
const filtered = await api.get('/posts', {
  params: { category: 'shoes', size: 'M' },
});
```

### Zustand Store
```typescript
// store/uiStore.ts
import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  showToast: (message: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  showToast: (message) => {
    // Toast logic
  },
}));
```

---

## Styling Rules

### Tailwind CSS 4 Usage
```tsx
// Mobile-first responsive design
<div className="
  flex flex-col gap-2
  sm:flex-row sm:gap-4
  md:gap-6
  lg:max-w-4xl
">

// Brand colors (defined in tailwind config)
<button className="bg-primary-red hover:bg-primary-red/90">
<span className="text-secondary-blue">

// Dark theme (default)
<div className="bg-background text-white">
```

### Common Utility Classes
```tsx
// Layout
flex flex-col items-center justify-between gap-4

// Spacing
p-4 px-6 py-2 m-4 mx-auto my-8

// Typography
text-lg font-bold text-primary-red
text-sm text-gray-400

// Interactive
hover:bg-surface cursor-pointer transition-colors

// Borders & Shadows
rounded-lg border border-gray-700
shadow-lg shadow-primary-red/20
```

---

## Security Rules

- **NEVER** write directly to Firestore from frontend
- **NEVER** store sensitive data in localStorage
- **ALWAYS** use `api.ts` for HTTP requests (auto-adds JWT)
- **ALWAYS** sanitize user content before displaying
- **ALWAYS** handle loading and error states

---

## Form Handling

```typescript
// With React Hook Form + Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Title required').max(100),
  price: z.number().positive('Price must be positive'),
});

type FormData = z.infer<typeof schema>;

export function CreatePostForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await api.post('/posts', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
      {/* ... */}
    </form>
  );
}
```

---

## Adding New Pages

1. Create page: `pages/NewPage.tsx`
2. Add route in `routes/index.tsx`:
```typescript
{ path: '/new-page', element: <NewPage /> }
```
3. Add navigation link if needed

---

## Environment Variables

```env
# Frontend .env (safe for client)
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxx
```

Access via: `import.meta.env.VITE_API_URL`

---

## Testing

```bash
# Run linter
npm run lint

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Common Gotchas

1. **Hot reload** - May need restart after shared/ changes
2. **API errors** - Check browser Network tab first
3. **Auth state** - Use `useAuthStore()` for current user
4. **Images** - Always provide fallback/placeholder
5. **Forms** - Disable submit button while loading
