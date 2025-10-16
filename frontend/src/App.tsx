import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { Header } from './components/layout/Header';
import { Toast } from './components/ui/Toast';
import { BurgerMenu } from './components/navigation/BurgerMenu';

function AppLayout() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isStaticPage = ['/how-it-works', '/community-guidelines', '/support', '/contact', '/faq', '/privacy', '/terms'].includes(location.pathname);
  const isProfilePage = location.pathname === '/profile';

  // Auth pages (login/signup) - fullscreen without any chrome
  if (isAuthPage) {
    return (
      <>
        <AppRoutes />
        <Toast />
      </>
    );
  }

  // Static pages - burger menu only, full screen
  if (isStaticPage) {
    return (
      <>
        <BurgerMenu />
        <AppRoutes />
        <Toast />
      </>
    );
  }

  // Landing page - burger menu only
  if (isLandingPage) {
    return (
      <>
        <BurgerMenu />
        <AppRoutes />
        <Toast />
      </>
    );
  }

  // Profile page - burger menu only, no header, no footer
  if (isProfilePage) {
    return (
      <div className="flex flex-col min-h-screen bg-tradey-black text-tradey-white">
        <BurgerMenu />
        <main className="flex-grow container mx-auto px-4 py-8">
          <AppRoutes />
        </main>
        <Toast />
      </div>
    );
  }

  // Chat and Liked pages - burger menu only, no header, no footer
  if (location.pathname === '/chat' || location.pathname === '/liked') {
    return (
      <div className="flex flex-col min-h-screen bg-tradey-black text-tradey-white">
        <BurgerMenu />
        <main className="flex-grow container mx-auto px-4 py-8">
          <AppRoutes />
        </main>
        <Toast />
      </div>
    );
  }

  // Other pages - full layout with header only
  return (
    <div className="flex flex-col min-h-screen bg-tradey-black text-tradey-white">
      <BurgerMenu />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <AppRoutes />
      </main>
      <Toast />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
