import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { BurgerMenu } from './components/navigation/BurgerMenu';
import { BackButton } from './components/navigation/BackButton';
import { PageTransition } from './components/ui/PageTransition';
import { useScrollToTop } from './hooks/useScrollToTop';

function AppLayout() {
  const location = useLocation();
  useScrollToTop(); // Automatically scroll to top on route change
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isLandingPage = location.pathname === '/';

  // Auth pages (login/signup) - fullscreen without any chrome
  if (isAuthPage) {
    return (
      <PageTransition>
        <AppRoutes />
      </PageTransition>
    );
  }

  // Landing page - black background
  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-tradey-black">
        <BurgerMenu />
        <PageTransition>
          <AppRoutes />
        </PageTransition>
      </div>
    );
  }

  // All other pages - white background, minimal, clean
  return (
    <div className="min-h-screen bg-tradey-white">
      <BurgerMenu />
      <BackButton />
      <PageTransition>
        <AppRoutes />
      </PageTransition>
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
