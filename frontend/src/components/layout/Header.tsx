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
    <header className="bg-tradey-black/80 backdrop-blur-sm border-b border-tradey-black sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-tradey-white font-fayte tracking-wider">
          TRADEY
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/profile" className="text-tradey-blue hover:text-tradey-white transition-colors font-garamond">
                Profile
              </Link>
              <Link to="/chat" className="text-tradey-blue hover:text-tradey-white transition-colors font-garamond">
                Messages
              </Link>
              <Link to="/liked" className="text-tradey-blue hover:text-tradey-white transition-colors font-garamond">
                Liked
              </Link>
              <div className="w-24">
                <Button onClick={handleLogout} variant="secondary" className="font-garamond">
                  Log Out
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-tradey-blue hover:text-tradey-white transition-colors font-garamond">
                Log In
              </Link>
              <Link to="/signup" className="bg-tradey-red text-tradey-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity font-garamond">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
