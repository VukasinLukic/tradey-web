# Frontend - TODO Lista

## Quick Overview

- [ ] TASK-011: Add Swipe Feed Component
- [ ] TASK-012: Add Onboarding Quiz
- [ ] TASK-013: Add Credit Display & Paywall

---

## Detailed Tasks

### TASK-011: Add Swipe Feed Component

**Priority:** P0
**Effort:** 8 hours

#### Description
Create a Tinder-style swipe interface for browsing clothing items. This is the core UX of the application.

#### Files to Create
- `frontend/src/pages/Feed.tsx` - Main feed page
- `frontend/src/components/feed/SwipeCard.tsx` - Individual card component
- `frontend/src/components/feed/SwipeStack.tsx` - Card stack manager
- `frontend/src/components/feed/SwipeButtons.tsx` - Skip/Like buttons
- `frontend/src/hooks/useFeed.ts` - Feed data fetching hook
- `frontend/src/hooks/useSwipe.ts` - Swipe gesture logic

#### Files to Modify
- `frontend/src/routes/index.tsx` - Add /feed route
- `frontend/src/components/navigation/` - Add Feed link

#### Component Structure
```
Feed.tsx
├── SwipeStack
│   ├── SwipeCard (current)
│   ├── SwipeCard (next preview, blurred)
│   └── SwipeCard (third, hidden)
└── SwipeButtons
    ├── SkipButton (X)
    └── LikeButton (Heart)
```

#### SwipeCard Props
```typescript
interface SwipeCardProps {
  item: Post;
  onSwipe: (direction: 'left' | 'right') => void;
  isActive: boolean;
}
```

#### useFeed Hook
```typescript
export function useFeed() {
  const [items, setItems] = useState<Post[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [coldStart, setColdStart] = useState(false);

  const fetchFeed = async () => {
    const response = await api.get('/posts/feed?limit=50');
    setItems(response.data.items);
    setColdStart(response.data.coldStart);
  };

  const recordSwipe = async (itemId: string, direction: 'left' | 'right') => {
    await api.post('/interactions/swipe', { itemId, direction });
  };

  return { items, currentIndex, isLoading, coldStart, fetchFeed, recordSwipe };
}
```

#### UX Requirements
- Cards stack visually (show current + next preview)
- Swipe left = skip (X icon overlay)
- Swipe right = like (Heart icon overlay)
- Spring animation for snap back
- Button alternatives for accessibility
- Loading state while fetching more items
- Empty state when no more items

#### Animation Specs
```typescript
// Swipe threshold
const SWIPE_THRESHOLD = 100; // pixels

// Rotation based on swipe distance
const rotation = (translateX / screenWidth) * 15; // degrees

// Opacity for overlay icons
const likeOpacity = Math.min(translateX / SWIPE_THRESHOLD, 1);
const skipOpacity = Math.min(-translateX / SWIPE_THRESHOLD, 1);
```

#### Acceptance Criteria
- [ ] Swipe left dismisses card and records 'left' interaction
- [ ] Swipe right likes item and records 'right' interaction
- [ ] Cards animate smoothly during swipe
- [ ] Next card preview visible behind current
- [ ] Button clicks work same as swipes
- [ ] Loading spinner while fetching
- [ ] Empty state when feed exhausted

---

### TASK-012: Add Onboarding Quiz

**Priority:** P1
**Effort:** 6 hours

#### Description
Multi-step quiz shown to new users to collect preferences for cold start recommendations.

#### Files to Create
- `frontend/src/pages/Onboarding.tsx` - Quiz container
- `frontend/src/components/onboarding/QuizStep.tsx` - Step wrapper
- `frontend/src/components/onboarding/StyleSelector.tsx` - Style picker
- `frontend/src/components/onboarding/SizeSelector.tsx` - Size picker
- `frontend/src/components/onboarding/ColorPicker.tsx` - Color selection
- `frontend/src/hooks/useOnboarding.ts` - Quiz state management

#### Files to Modify
- `frontend/src/routes/index.tsx` - Add /onboarding route
- `frontend/src/App.tsx` - Redirect new users to onboarding

#### Quiz Steps
1. **Gender Preference** - Who do you shop for?
   - Male / Female / Unisex (multi-select)

2. **Sizes** - What sizes do you wear?
   - XS / S / M / L / XL / XXL (multi-select)

3. **Styles** - What's your style?
   - Casual / Streetwear / Vintage / Formal / Sporty (multi-select, max 3)

4. **Colors** - Favorite colors?
   - Visual color picker (optional step)

#### Quiz State
```typescript
interface OnboardingState {
  currentStep: number;
  preferences: {
    interestedIn: string[];
    sizes: string[];
    styles: string[];
    favoriteColors: string[];
  };
}
```

#### useOnboarding Hook
```typescript
export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>(initialState);
  const navigate = useNavigate();

  const nextStep = () => {
    if (state.currentStep < 4) {
      setState(s => ({ ...s, currentStep: s.currentStep + 1 }));
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    await api.post('/users/me/onboarding', state.preferences);
    navigate('/feed');
  };

  return { ...state, nextStep, updatePreferences };
}
```

#### UI Requirements
- Progress indicator (dots or bar)
- Skip option for optional steps
- Back button to previous step
- Smooth transitions between steps
- Validate minimum selections before next

#### Acceptance Criteria
- [ ] Quiz appears for users with !onboardingCompleted
- [ ] All 4 steps render correctly
- [ ] Multi-select works for all fields
- [ ] Progress indicator updates
- [ ] Can go back to previous steps
- [ ] Submit saves preferences to backend
- [ ] Redirects to /feed after completion

---

### TASK-013: Add Credit Display & Paywall

**Priority:** P0
**Effort:** 4 hours

#### Description
Display user's credit balance and show paywall when attempting to match with 0 credits.

#### Files to Create
- `frontend/src/components/ui/CreditBadge.tsx` - Header credit display
- `frontend/src/pages/Paywall.tsx` - Purchase credits page
- `frontend/src/hooks/useCredits.ts` - Credit state management
- `frontend/src/components/paywall/PricingCard.tsx` - Plan/price card

#### Files to Modify
- `frontend/src/components/layout/Header.tsx` - Add CreditBadge
- `frontend/src/hooks/useFeed.ts` - Check credits on match

#### CreditBadge Component
```typescript
export function CreditBadge() {
  const { credits, isLoading } = useCredits();

  if (isLoading) return <Skeleton className="w-16 h-8" />;

  return (
    <div className="flex items-center gap-2 bg-secondary-blue/20 px-3 py-1 rounded-full">
      <CoinIcon className="w-4 h-4 text-primary-red" />
      <span className="font-semibold">{credits}</span>
    </div>
  );
}
```

#### useCredits Hook
```typescript
export function useCredits() {
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCredits = async () => {
    const response = await api.get('/credits/balance');
    setCredits(response.data.credits);
    setIsLoading(false);
  };

  const consumeCredit = async (): Promise<boolean> => {
    try {
      await api.post('/credits/consume');
      setCredits(c => c - 1);
      return true;
    } catch (error) {
      if (error.response?.status === 402) {
        return false; // Insufficient credits
      }
      throw error;
    }
  };

  return { credits, isLoading, fetchCredits, consumeCredit };
}
```

#### Match Flow with Credits
```typescript
// In Feed component or useFeed hook
const handleMatch = async (itemId: string) => {
  const success = await consumeCredit();

  if (!success) {
    navigate('/paywall');
    return;
  }

  // Continue with match logic
  await createMatch(itemId);
  openChat(itemId);
};
```

#### Paywall Page Content
- Current credit balance
- Pricing tiers (if applicable)
- Purchase button (placeholder for now)
- "How credits work" explanation
- Back to feed button

#### Pricing Tiers (Placeholder)
```typescript
const PRICING_TIERS = [
  { credits: 10, price: 500, label: 'Starter' },
  { credits: 25, price: 1000, label: 'Popular', highlighted: true },
  { credits: 50, price: 1800, label: 'Best Value' },
];
```

#### Acceptance Criteria
- [ ] CreditBadge shows current balance in header
- [ ] Badge updates after credit consumption
- [ ] Paywall shown when matching with 0 credits
- [ ] Paywall displays pricing options
- [ ] Back button returns to feed
- [ ] Credits refresh on page load

---

## Dependencies

No new npm packages required. Uses existing:
- React Query for data fetching
- Zustand for state management
- Tailwind CSS for styling

## Routes to Add

```typescript
// routes/index.tsx
{ path: '/feed', element: <Feed /> },
{ path: '/onboarding', element: <Onboarding /> },
{ path: '/paywall', element: <Paywall /> },
```

## Navigation Flow

```
New User → /onboarding → /feed
Existing User → /feed
Match with 0 credits → /paywall → (purchase) → /feed
```
