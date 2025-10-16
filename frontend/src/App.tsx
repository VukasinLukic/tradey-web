import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { Header } from './components/layout/Header';
import Footer from './components/layout/Footer';
import { Toast } from './components/ui/Toast';
import { BurgerMenu } from './components/navigation/BurgerMenu';

function AppLayout() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return (
      <>
        <BurgerMenu />
        <AppRoutes />
        <Toast />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-tradey-black text-tradey-white">
      <BurgerMenu />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <AppRoutes />
      </main>
      <Toast />
      <Footer />
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
