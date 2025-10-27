import { Route, Routes } from 'react-router-dom';
import { AuthWrapper } from '../components/layout/AuthWrapper';

// Import Pages
import { IndexPage } from '../pages/Index';
import { LoginPage } from '../pages/Login';
import { SignupPage } from '../pages/Signup';
import { ProfilePage } from '../pages/Profile';
import { MarketplacePage } from '../pages/Marketplace';
import { ItemViewPage } from '../pages/ItemView';
import { ChatPage } from '../pages/Chat';
import { LikedPage } from '../pages/Liked';
import { FollowingPage } from '../pages/Following';
import { ReviewsPage } from '../pages/Reviews';
import { UserProfilePage } from '../pages/UserProfile';
import { NewPostPage } from '../pages/NewPost';
import { EditPostPage } from '../pages/EditPost';
import { AboutUsPage } from '../pages/AboutUs';
import { HowItWorksPage } from '../pages/HowItWorks';
import { CommunityGuidelinesPage } from '../pages/CommunityGuidelines';
import { SupportPage } from '../pages/Support';
import { ContactPage } from '../pages/Contact';
import { FAQPage } from '../pages/FAQ';
import { PrivacyPage } from '../pages/Privacy';
import { TermsOfUsePage } from '../pages/TermsOfUse';
import { NotFoundPage } from '../pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<IndexPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/marketplace" element={<MarketplacePage />} />
      <Route path="/item/:id" element={<ItemViewPage />} />
      <Route path="/user/:id" element={<UserProfilePage />} />

      {/* Static Pages */}
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/community-guidelines" element={<CommunityGuidelinesPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsOfUsePage />} />

      {/* Protected Routes */}
      <Route element={<AuthWrapper />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/post/new" element={<NewPostPage />} />
        <Route path="/edit-post/:id" element={<EditPostPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/liked" element={<LikedPage />} />
        <Route path="/following" element={<FollowingPage />} />
        <Route path="/following/:id" element={<FollowingPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
      </Route>

      {/* 404 - Catch all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
} 