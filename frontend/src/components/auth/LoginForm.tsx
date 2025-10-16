import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { usersApi } from '../../services/api';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

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
      // Step 1: Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Step 2: Verify user profile exists in backend
      try {
        await usersApi.getById(userCredential.user.uid);
      } catch (profileError: any) {
        // If user profile doesn't exist in backend, log it but continue
        console.warn('User profile not found in backend:', profileError);
      }

      // Step 3: Navigate to profile page
      navigate('/profile');
    } catch (error: any) {
      // Map Firebase error codes to user-friendly messages
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Invalid email or password. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        default:
          setError('An unexpected error occurred. Please try again later.');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        id="email"
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <Button type="submit" disabled={loading} tone="tradey-red">
          {loading ? 'Logging in...' : 'Log In'}
        </Button>
      </div>
    </form>
  );
}
