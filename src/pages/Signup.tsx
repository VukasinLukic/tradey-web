import { Link } from 'react-router-dom';
import { SignupForm } from '../components/auth/SignupForm';

export function SignupPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white font-serif tracking-wider">TRADEY</h1>
          <p className="text-gray-400 mt-2">Create an account to join the community.</p>
        </div>

        <div className="bg-gray-900/50 p-8 rounded-lg shadow-lg backdrop-blur-sm border border-gray-800">
          <SignupForm />
        </div>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-red-500 hover:text-red-400 font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
} 