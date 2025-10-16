import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
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
      </>
    );
  }

  // Landing page - black background
  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-tradey-black">
        <BurgerMenu />
        <AppRoutes />
      </div>
    );
  }

  // All other pages - white background, minimal, clean
  return (
    <div className="min-h-screen bg-tradey-white">
      <BurgerMenu />
      <AppRoutes />
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
