import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { Button } from '../ui/Button';

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <header className="bg-black/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white font-serif tracking-wider">
          TRADEY
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">
                Profile
              </Link>
              <Link to="/chat" className="text-gray-300 hover:text-white transition-colors">
                Messages
              </Link>
              <Link to="/liked" className="text-gray-300 hover:text-white transition-colors">
                Liked
              </Link>
              <div className="w-24">
                <Button onClick={handleLogout} variant="secondary">
                  Log Out
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                Log In
              </Link>
              <Link to="/signup" className="bg-[#a61f1e] text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
