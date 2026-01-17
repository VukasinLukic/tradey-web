# Mobile App Specialist - React Native Guidelines

## Tech Stack

- **Framework**: React Native + Expo (managed workflow)
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack)
- **State**: React Query (server), Context (auth)
- **Gestures**: react-native-gesture-handler + reanimated
- **Auth**: @react-native-firebase/auth

---

## File Locations

```
tradey-mobile/src/
├── screens/          # Screen components
├── components/       # Organized by domain
│   ├── feed/         # SwipeCard, SwipeStack
│   ├── ui/           # Button, Input, CreditBadge
│   └── layout/       # Header, SafeArea
├── navigation/       # Navigator configs
├── hooks/            # Custom hooks
├── services/         # API client
├── constants/        # Theme, config
├── types/            # TypeScript types
└── utils/            # Helpers, storage
```

---

## Key Patterns

### Screen Component
```typescript
// screens/FeedScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeStack } from '../components/feed/SwipeStack';
import { SwipeButtons } from '../components/feed/SwipeButtons';
import { useFeed } from '../hooks/useFeed';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { COLORS } from '../constants/theme';

export function FeedScreen() {
  const { items, isLoading, recordSwipe } = useFeed();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SwipeStack items={items} onSwipe={recordSwipe} />
      <SwipeButtons
        onSkip={() => recordSwipe(items[0].id, 'left')}
        onLike={() => recordSwipe(items[0].id, 'right')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
```

### Gesture Handling with Reanimated
```typescript
// hooks/useSwipeGesture.ts
import { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export function useSwipeGesture({ onSwipeLeft, onSwipeRight }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.5;
    })
    .onEnd((e) => {
      if (e.translationX > SWIPE_THRESHOLD) {
        translateX.value = withSpring(SCREEN_WIDTH * 1.5, {}, () => {
          runOnJS(onSwipeRight)();
        });
      } else if (e.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5, {}, () => {
          runOnJS(onSwipeLeft)();
        });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return { panGesture, cardStyle };
}
```

### Animated Component
```typescript
// components/feed/SwipeCard.tsx
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';

export function SwipeCard({ item, onSwipeLeft, onSwipeRight }) {
  const { panGesture, cardStyle } = useSwipeGesture({
    onSwipeLeft,
    onSwipeRight,
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, cardStyle]}>
        {/* Card content */}
      </Animated.View>
    </GestureDetector>
  );
}
```

### API Client
```typescript
// services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/config';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Shared Code Strategy

### Copy from Web (minimal changes)
| File | Changes Needed |
|------|----------------|
| `services/api.ts` | AsyncStorage instead of localStorage |
| `hooks/useFeed.ts` | None |
| `hooks/useCredits.ts` | None |
| `types/index.ts` | None |

### Adapt for Mobile
| File | Changes |
|------|---------|
| `hooks/useAuth.ts` | Use @react-native-firebase/auth |
| All components | StyleSheet instead of Tailwind |

### Mobile-Specific
- `hooks/useSwipeGesture.ts` - Native gestures
- All UI components - React Native primitives

---

## Styling

### StyleSheet Pattern
```typescript
import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
  },
});
```

### Theme Constants
```typescript
// constants/theme.ts
export const COLORS = {
  primary: '#a61f1e',
  secondary: '#a2c8ff',
  background: '#000000',
  surface: '#1a1a1a',
  text: '#ffffff',
  textSecondary: '#888888',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
```

---

## Navigation

### Stack Navigator Setup
```typescript
// navigation/AppNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="Feed" component={FeedScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
```

### Navigation Types
```typescript
// navigation/types.ts
export type RootStackParamList = {
  Feed: undefined;
  Chat: { chatId: string };
  Profile: { userId?: string };
  Paywall: undefined;
};
```

---

## Performance Tips

1. **Use FlatList** for long lists, not ScrollView + map
2. **Memoize components** with React.memo when needed
3. **Use useCallback** for gesture handlers
4. **Preload images** for swipe cards (next 2-3)
5. **Avoid inline styles** in render - use StyleSheet
6. **Use Reanimated worklets** for 60fps animations

---

## Firebase Setup

### Android
1. Download `google-services.json` from Firebase Console
2. Place in `android/app/`
3. Add to `android/build.gradle`:
```gradle
apply plugin: 'com.google.gms.google-services'
```

### iOS
1. Download `GoogleService-Info.plist` from Firebase Console
2. Place in `ios/` folder
3. Add to Xcode project

---

## Testing

```bash
# Start development
npx expo start

# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android

# Clear cache
npx expo start --clear

# Build preview
eas build --profile preview
```

---

## Common Gotchas

1. **Reanimated** - Add plugin to babel.config.js
2. **Gesture Handler** - Wrap app in GestureHandlerRootView
3. **Safe Area** - Use SafeAreaView for notch handling
4. **Images** - Use `{ uri: url }` not just url string
5. **Keyboard** - Use KeyboardAvoidingView for forms
6. **Android back** - Handle hardware back button
