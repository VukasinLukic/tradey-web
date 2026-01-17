# Mobile App - TODO Lista

> **Note:** This is a NEW REPOSITORY (tradey-mobile)

## Quick Overview

- [ ] TASK-014: Setup React Native with Expo
- [ ] TASK-015: Implement Mobile Swipe Cards
- [ ] TASK-016: Mobile Auth Integration

---

## Repository Setup

```bash
# Create new Expo project
npx create-expo-app tradey-mobile --template blank-typescript
cd tradey-mobile

# Install core dependencies
npx expo install react-native-gesture-handler react-native-reanimated
npm install @react-navigation/native @react-navigation/stack
npm install axios @tanstack/react-query
npm install @react-native-async-storage/async-storage

# Install Firebase
npm install @react-native-firebase/app @react-native-firebase/auth
```

---

## Detailed Tasks

### TASK-014: Setup React Native with Expo

**Priority:** P1
**Effort:** 4 hours

#### Description
Initialize React Native project with Expo, configure navigation, and set up shared code structure.

#### Folder Structure to Create
```
tradey-mobile/
├── src/
│   ├── screens/
│   │   ├── FeedScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   └── PaywallScreen.tsx
│   ├── components/
│   │   ├── feed/
│   │   │   ├── SwipeCard.tsx
│   │   │   ├── SwipeStack.tsx
│   │   │   └── SwipeButtons.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── CreditBadge.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   └── layout/
│   │       ├── SafeArea.tsx
│   │       └── Header.tsx
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── types.ts
│   ├── services/
│   │   └── api.ts              # Shared with web (copy)
│   ├── hooks/
│   │   ├── useAuth.ts          # Shared with web (adapted)
│   │   ├── useFeed.ts          # Shared with web (copy)
│   │   ├── useCredits.ts       # Shared with web (copy)
│   │   └── useSwipeGesture.ts  # Mobile-specific
│   ├── constants/
│   │   ├── theme.ts
│   │   └── config.ts
│   ├── types/
│   │   └── index.ts            # Shared with web (copy)
│   └── utils/
│       └── storage.ts
├── App.tsx
├── app.json
├── babel.config.js
├── tsconfig.json
└── package.json
```

#### App.tsx
```typescript
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider } from './src/hooks/useAuth';

const queryClient = new QueryClient();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
```

#### navigation/AppNavigator.tsx
```typescript
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth';
import { AuthNavigator } from './AuthNavigator';
import { FeedScreen } from '../screens/FeedScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { PaywallScreen } from '../screens/PaywallScreen';

const Stack = createStackNavigator();

export function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="Feed" component={FeedScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Paywall" component={PaywallScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
```

#### app.json
```json
{
  "expo": {
    "name": "TRADEY",
    "slug": "tradey-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#000000"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.tradey.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#000000"
      },
      "package": "com.tradey.app"
    },
    "plugins": [
      "react-native-gesture-handler",
      [
        "react-native-reanimated",
        {
          "babelPresetExpoBabelPresetPath": false
        }
      ]
    ]
  }
}
```

#### constants/theme.ts
```typescript
export const COLORS = {
  primary: '#a61f1e',      // Brand red
  secondary: '#a2c8ff',    // Brand blue
  background: '#000000',   // Black background
  surface: '#1a1a1a',
  text: '#ffffff',
  textSecondary: '#888888',
  success: '#4CAF50',
  error: '#f44336',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const FONTS = {
  heading: 'Anton',
  body: 'System',
};
```

#### babel.config.js
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

#### Acceptance Criteria
- [ ] Expo project initializes without errors
- [ ] Navigation between screens works
- [ ] Auth state persists across app restarts
- [ ] API client connects to backend
- [ ] Theme constants defined

---

### TASK-015: Implement Mobile Swipe Cards

**Priority:** P1
**Effort:** 8 hours

#### Description
Create native swipe gesture cards using react-native-gesture-handler and react-native-reanimated for smooth 60fps animations.

#### Files to Create
- `src/components/feed/SwipeCard.tsx`
- `src/components/feed/SwipeStack.tsx`
- `src/components/feed/SwipeButtons.tsx`
- `src/hooks/useSwipeGesture.ts`

#### hooks/useSwipeGesture.ts
```typescript
import { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface UseSwipeGestureProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function useSwipeGesture({ onSwipeLeft, onSwipeRight }: UseSwipeGestureProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.5; // Dampened vertical
      rotation.value = (event.translationX / SCREEN_WIDTH) * 15;
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        // Swipe right - animate off screen then callback
        translateX.value = withSpring(SCREEN_WIDTH * 1.5, { damping: 15 }, () => {
          runOnJS(onSwipeRight)();
        });
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        // Swipe left
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5, { damping: 15 }, () => {
          runOnJS(onSwipeLeft)();
        });
      } else {
        // Snap back
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotation.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const likeOpacity = useAnimatedStyle(() => ({
    opacity: Math.min(translateX.value / SWIPE_THRESHOLD, 1),
  }));

  const nopeOpacity = useAnimatedStyle(() => ({
    opacity: Math.min(-translateX.value / SWIPE_THRESHOLD, 1),
  }));

  const resetPosition = () => {
    translateX.value = 0;
    translateY.value = 0;
    rotation.value = 0;
  };

  return {
    panGesture,
    cardStyle,
    likeOpacity,
    nopeOpacity,
    resetPosition,
    translateX,
  };
}
```

#### components/feed/SwipeCard.tsx
```typescript
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { useSwipeGesture } from '../../hooks/useSwipeGesture';
import { COLORS, SPACING } from '../../constants/theme';
import { Post } from '../../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.65;

interface SwipeCardProps {
  item: Post;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isActive: boolean;
}

export function SwipeCard({ item, onSwipeLeft, onSwipeRight, isActive }: SwipeCardProps) {
  const { panGesture, cardStyle, likeOpacity, nopeOpacity } = useSwipeGesture({
    onSwipeLeft,
    onSwipeRight,
  });

  if (!isActive) {
    return (
      <View style={[styles.card, styles.inactiveCard]}>
        <Image source={{ uri: item.images[0] }} style={styles.image} />
      </View>
    );
  }

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Image source={{ uri: item.images[0] }} style={styles.image} />

        {/* Like overlay */}
        <Animated.View style={[styles.overlay, styles.likeOverlay, likeOpacity]}>
          <Text style={styles.overlayText}>LIKE</Text>
        </Animated.View>

        {/* Nope overlay */}
        <Animated.View style={[styles.overlay, styles.nopeOverlay, nopeOpacity]}>
          <Text style={styles.overlayText}>NOPE</Text>
        </Animated.View>

        {/* Item info */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.price}>{item.price} RSD</Text>
          <Text style={styles.size}>Size: {item.size}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    position: 'absolute',
  },
  inactiveCard: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  image: {
    width: '100%',
    height: '75%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 50,
    padding: SPACING.md,
    borderWidth: 4,
    borderRadius: 10,
  },
  likeOverlay: {
    right: 20,
    borderColor: COLORS.success,
    transform: [{ rotate: '15deg' }],
  },
  nopeOverlay: {
    left: 20,
    borderColor: COLORS.error,
    transform: [{ rotate: '-15deg' }],
  },
  overlayText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  info: {
    padding: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  price: {
    fontSize: 18,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  size: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});
```

#### components/feed/SwipeStack.tsx
```typescript
import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { SwipeCard } from './SwipeCard';
import { Post } from '../../types';

interface SwipeStackProps {
  items: Post[];
  onSwipe: (itemId: string, direction: 'left' | 'right') => void;
}

export function SwipeStack({ items, onSwipe }: SwipeStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    const item = items[currentIndex];
    onSwipe(item.id, direction);
    setCurrentIndex(i => i + 1);
  }, [currentIndex, items, onSwipe]);

  // Render 3 cards: current + 2 behind
  const visibleCards = items.slice(currentIndex, currentIndex + 3);

  return (
    <View style={styles.container}>
      {visibleCards.map((item, index) => (
        <SwipeCard
          key={item.id}
          item={item}
          isActive={index === 0}
          onSwipeLeft={() => handleSwipe('left')}
          onSwipeRight={() => handleSwipe('right')}
        />
      )).reverse()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

#### components/feed/SwipeButtons.tsx
```typescript
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../../constants/theme';

interface SwipeButtonsProps {
  onSkip: () => void;
  onLike: () => void;
}

export function SwipeButtons({ onSkip, onLike }: SwipeButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, styles.skipButton]} onPress={onSkip}>
        <Ionicons name="close" size={32} color={COLORS.error} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.likeButton]} onPress={onLike}>
        <Ionicons name="heart" size={32} color={COLORS.success} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  skipButton: {
    borderColor: COLORS.error,
    backgroundColor: `${COLORS.error}20`,
  },
  likeButton: {
    borderColor: COLORS.success,
    backgroundColor: `${COLORS.success}20`,
  },
});
```

#### Performance Requirements
- 60fps animations
- No frame drops during swipe
- Smooth snap-back animation
- Preload next 2 images

#### Acceptance Criteria
- [ ] Swipe gestures work smoothly
- [ ] Like/Nope overlays appear during swipe
- [ ] Cards stack visually (3 visible)
- [ ] Buttons work as swipe alternatives
- [ ] Animation runs at 60fps
- [ ] Swipe callbacks fire correctly

---

### TASK-016: Mobile Auth Integration

**Priority:** P1
**Effort:** 4 hours

#### Description
Integrate Firebase Auth for mobile using @react-native-firebase/auth. Share authentication state with API client.

#### Files to Create/Modify
- `src/hooks/useAuth.ts` - Auth hook adapted for mobile
- `src/services/api.ts` - API client with token injection
- `src/utils/storage.ts` - AsyncStorage wrapper

#### hooks/useAuth.ts
```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        await AsyncStorage.setItem('authToken', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        await AsyncStorage.removeItem('authToken');
        delete api.defaults.headers.common['Authorization'];
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await auth().signInWithEmailAndPassword(email, password);
  };

  const signup = async (email: string, password: string) => {
    await auth().createUserWithEmailAndPassword(email, password);
  };

  const logout = async () => {
    await auth().signOut();
  };

  const getToken = async () => {
    if (user) {
      return user.getIdToken();
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      getToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

#### services/api.ts
```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/config';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Token refresh interceptor
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, trigger re-auth
      await AsyncStorage.removeItem('authToken');
      // Navigate to login (handled by auth state change)
    }
    return Promise.reject(error);
  }
);
```

#### constants/config.ts
```typescript
export const API_URL = __DEV__
  ? 'http://localhost:5000/api'
  : 'https://tradey-api.railway.app/api';

export const FIREBASE_CONFIG = {
  // Add your Firebase config here
  // These are already in google-services.json (Android) and GoogleService-Info.plist (iOS)
};
```

#### Firebase Setup Notes
```
# iOS Setup
1. Download GoogleService-Info.plist from Firebase Console
2. Add to ios/ folder
3. Update ios/Podfile with Firebase pods

# Android Setup
1. Download google-services.json from Firebase Console
2. Add to android/app/ folder
3. Update android/build.gradle with Firebase plugin
```

#### Acceptance Criteria
- [ ] Firebase Auth initializes on app start
- [ ] Login/Signup work with email/password
- [ ] Token stored in AsyncStorage
- [ ] API client automatically includes token
- [ ] Logout clears token and state
- [ ] Auth state persists across app restarts

---

## Shared Code Strategy

### Copy from Web (minimal changes)
- `services/api.ts` - Change import for AsyncStorage
- `hooks/useFeed.ts` - Same logic
- `hooks/useCredits.ts` - Same logic
- `types/index.ts` - Same types

### Adapt for Mobile
- `hooks/useAuth.ts` - Use @react-native-firebase/auth
- Components - Rewrite with React Native components

### Mobile-Specific
- `hooks/useSwipeGesture.ts` - Native gestures
- All UI components - StyleSheet instead of Tailwind

## Dependencies

```json
{
  "dependencies": {
    "@react-native-async-storage/async-storage": "^1.21.0",
    "@react-native-firebase/app": "^19.0.0",
    "@react-native-firebase/auth": "^19.0.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "@tanstack/react-query": "^5.17.0",
    "axios": "^1.6.0",
    "expo": "~50.0.0",
    "react-native-gesture-handler": "~2.14.0",
    "react-native-reanimated": "~3.6.0"
  }
}
```

## Testing

```bash
# Start development
npx expo start

# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android

# Build for testing
eas build --profile preview
```
