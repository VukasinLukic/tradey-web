<!-- 17074444-ba19-4567-9ae1-255e363938c5 e7772fbe-d109-4e67-bb7b-1ec85b899f5a -->
# Social Features Complete Fix Plan

## Problem Analysis

Based on the codebase review, I identified these issues:

1. **Follow/Unfollow**: Backend API works, but frontend doesn't update UI state after toggling
2. **Contact Seller (Create Chat)**: Frontend sends `recipientId` but backend expects `participantId`
3. **Like Post**: Backend API works, but frontend doesn't refetch data or update UI
4. **Share Button**: No handler implemented in `ItemView.tsx` (modal exists but share button doesn't trigger it)
5. **Following/Followers Pages**: `Following.tsx` is empty placeholder, no way to view who you follow

## Files to Modify

### 1. Fix Contact Seller - Chat Creation Bug

**File**: `frontend/src/hooks/useCreateChat.ts` (lines 16-18)

- **Current**: Sends `{ recipientId }` 
- **Fix**: Change to `{ participantId: recipientId }` to match backend schema

### 2. Fix Follow/Unfollow UI Updates

**File**: `frontend/src/pages/UserProfile.tsx`

- **Current**: `isFollowing` hardcoded to `false` (line 20)
- **Fix**: 
- Calculate `isFollowing` from current user's `following` array
- Add `refetch` to `useUserProfile` hook call
- Call `refetch()` after `toggleFollow` succeeds to update UI

**File**: `frontend/src/hooks/useUserProfile.ts`

- Already has `refetch` function, just need to use it

### 3. Fix Like Post UI Updates

**File**: `frontend/src/pages/ItemView.tsx`

- **Current**: `isLiked` and `likesCount` hardcoded (lines 22-23)
- **Fix**:
- Fetch current user's profile to get `likedPosts` array
- Calculate `isLiked` from `likedPosts.includes(post.id)`
- Refetch user profile after `toggleLike()` to update UI
- Add visual feedback (optimistic update or loading state)

**File**: `frontend/src/pages/Marketplace.tsx` (ProductCard component, line 183)

- **Current**: `isLiked` hardcoded to `false`
- **Fix**: Same as ItemView - fetch user profile and check `likedPosts`

### 4. Fix Share Button

**File**: `frontend/src/pages/ItemView.tsx`

- **Current**: `handleShare` function exists (lines 43-55), `showShareModal` state exists, modal renders (lines 283-315)
- **Issue**: Share button at line 236 calls `handleShare()` but likely doesn't work as expected
- **Fix**: Verify share button onClick is properly wired (should work actually, might be navigator.share browser support issue)

### 5. Implement Following/Followers Pages

**File**: `frontend/src/pages/Following.tsx`

- **Current**: Empty placeholder (7 lines)
- **Fix**: Implement full page with:
- Tabs: "Following" and "Followers"
- Fetch following list from `GET /api/users/:id/following`
- Fetch followers list needs new backend endpoint `GET /api/users/:id/followers`
- Display user cards with avatar, username, unfollow button

**File**: `frontend/src/pages/Profile.tsx`

- Add clickable links to following/followers counts that navigate to `/following` page with tab pre-selected

### 6. Implement Liked Posts Page Fixes

**File**: `frontend/src/pages/Liked.tsx`

- Already implemented but needs to verify `useLikedPosts` refetch after unlike

### 7. Create New Hook for Followers

**File**: `frontend/src/hooks/useFollowers.ts` (NEW)

- Create hook to fetch users who follow a specific user
- Needs new backend endpoint first

### 8. Backend - Add Followers Endpoint

**File**: `backend/src/controllers/userController.ts`

- Add new endpoint: `GET /api/users/:id/followers`
- Query all users where `following` array contains the target user ID
- Return list of user profiles

**File**: `backend/src/routes/users.routes.ts`

- Add route for `GET /:id/followers`

## Implementation Steps

1. Fix critical bugs first (Contact Seller, Follow UI, Like UI)
2. Implement Following/Followers page
3. Add backend followers endpoint
4. Connect frontend to new endpoints
5. Test all social features end-to-end

### To-dos

- [ ] Fix Contact Seller chat creation by changing recipientId to participantId in useCreateChat.ts
- [ ] Fix Follow/Unfollow UI updates in UserProfile.tsx by calculating isFollowing from user data and calling refetch after toggle
- [ ] Fix Like post UI updates in ItemView.tsx and Marketplace.tsx by fetching user likedPosts and updating after toggle
- [ ] Implement Following.tsx page with Following/Followers tabs and user lists
- [ ] Add GET /api/users/:id/followers backend endpoint to query users who follow target user
- [ ] Create useFollowers.ts hook to fetch followers list from backend
- [ ] Make followers/following counts clickable in Profile.tsx and UserProfile.tsx to navigate to Following page