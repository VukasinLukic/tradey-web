import { Link } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white font-serif tracking-wider">TRADEY</h1>
          <p className="text-gray-400 mt-2">Log in to start trading.</p>
        </div>
        
        <div className="bg-gray-900/50 p-8 rounded-lg shadow-lg backdrop-blur-sm border border-gray-800">
          <LoginForm />
        </div>

        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-red-500 hover:text-red-400 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
} 