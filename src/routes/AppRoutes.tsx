import { Route, Routes } from 'react-router-dom';
import { AuthWrapper } from '../components/layout/AuthWrapper';

// Import Pages
import { IndexPage } from '../pages/Index';
import { LoginPage } from '../pages/Login';
import { SignupPage } from '../pages/Signup';
import { ProfilePage } from '../pages/Profile';
import { ItemViewPage } from '../pages/ItemView';
import { ChatPage } from '../pages/Chat';
import { LikedPage } from '../pages/Liked';
import { FollowingPage } from '../pages/Following';
import { UserProfilePage } from '../pages/UserProfile';
import { NewPostPage } from '../pages/NewPost';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<IndexPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/item/:id" element={<ItemViewPage />} />
      <Route path="/user/:id" element={<UserProfilePage />} />

      {/* Protected Routes */}
      <Route element={<AuthWrapper />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/post/new" element={<NewPostPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/liked" element={<LikedPage />} />
        <Route path="/following" element={<FollowingPage />} />
      </Route>
    </Routes>
  );
} 