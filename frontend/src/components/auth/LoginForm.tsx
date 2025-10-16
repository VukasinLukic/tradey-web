import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { usersApi } from '../../services/api';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Step 1: Ensure persistence is set to LOCAL (persists across browser sessions)
      await setPersistence(auth, browserLocalPersistence);

      // Step 2: Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Step 3: Force token refresh to ensure it's cached
      await userCredential.user.getIdToken(true);

      // Step 4: Verify user profile exists in backend
      try {
        await usersApi.getById(userCredential.user.uid);
      } catch (profileError) {
        // If user profile doesn't exist in backend, log it but continue
        console.warn('User profile not found in backend:', profileError);
      }

      // Step 5: Navigate to profile page
      navigate('/profile');
    } catch (error) {
      // Map Firebase error codes to user-friendly messages
      const firebaseError = error as { code?: string; message?: string };
      switch (firebaseError.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Invalid email or password. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        default:
          setError(firebaseError.message || 'An unexpected error occurred. Please try again later.');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block font-sans text-sm font-medium mb-2 text-tradey-black">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full px-4 py-3 bg-tradey-white border border-tradey-black/20 rounded-lg text-tradey-black text-base font-sans placeholder-tradey-black/40 focus:outline-none focus:ring-2 focus:ring-tradey-red focus:border-transparent transition-all"
          placeholder="name@example.com"
        />
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="block font-sans text-sm font-medium mb-2 text-tradey-black">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full px-4 py-3 bg-tradey-white border border-tradey-black/20 rounded-lg text-tradey-black text-base font-sans placeholder-tradey-black/40 focus:outline-none focus:ring-2 focus:ring-tradey-red focus:border-transparent transition-all"
          placeholder="••••••••"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-tradey-red/10 border border-tradey-red rounded-lg p-3">
          <p className="text-tradey-red text-sm font-sans">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-tradey-red hover:bg-tradey-red/80 text-tradey-white font-sans text-base font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? 'Logging in...' : 'Log in'}
      </button>

      {/* Divider */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-tradey-black/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-tradey-white text-tradey-black/60 font-sans">
            New to TRADEY?
          </span>
        </div>
      </div>

      {/* Sign Up Link */}
      <a
        href="/signup"
        className="block w-full py-3.5 text-center bg-tradey-white hover:bg-tradey-black/5 border border-tradey-black/20 text-tradey-black font-sans text-base font-semibold rounded-full transition-colors"
      >
        Create account
      </a>
    </form>
  );
}
