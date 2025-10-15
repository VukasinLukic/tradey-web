import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { Header } from './components/layout/Header';
import Footer from './components/layout/Footer';
import { Toast } from './components/ui/Toast';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-black text-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <AppRoutes />
        </main>
        <Toast />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
