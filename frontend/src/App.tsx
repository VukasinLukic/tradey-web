import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { Toast } from './components/ui/Toast';
import { BurgerMenu } from './components/navigation/BurgerMenu';

function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isLandingPage = location.pathname === '/';

  // Auth pages (login/signup) - fullscreen without any chrome
  if (isAuthPage) {
    return (
      <>
        <AppRoutes />
        <Toast />
      </>
    );
  }

  // Landing page - black background
  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-tradey-black">
        <BurgerMenu />
        <AppRoutes />
        <Toast />
      </div>
    );
  }

  // All other pages - white background, minimal, clean
  return (
    <div className="min-h-screen bg-tradey-white">
      <BurgerMenu />
      <AppRoutes />
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
