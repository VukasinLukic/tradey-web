import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { BELGRADE_MUNICIPALITIES } from '../../constants/locations';
import type { UserProfile } from '../../types/entities';

export function SignupForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState(BELGRADE_MUNICIPALITIES[0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!/^\d{9,10}$/.test(phone.replace(/\s+/g, ''))) {
      setError('Please enter a valid phone number (9-10 digits).');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const newUserProfile: Omit<UserProfile, 'following' | 'likes'> = {
        uid: user.uid,
        username,
        email: user.email!,
        phone,
        location,
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'users', user.uid), newUserProfile);

      navigate('/profile');
    } catch (error: any) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email address is already in use.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('The password is too weak. Please choose a stronger one.');
          break;
        default:
          setError('An unexpected error occurred. Please try again.');
          console.error(error);
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="username"
        label="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        autoComplete="username"
      />
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
        id="phone"
        label="Phone Number"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        autoComplete="tel"
      />
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
          Location (Belgrade)
        </label>
        <select
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          {BELGRADE_MUNICIPALITIES.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>
      <Input
        id="password"
        label="Password (min. 6 characters)"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="new-password"
      />
      {error && <p className="text-red-500 text-sm py-2">{error}</p>}
      <div className="pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </div>
    </form>
  );
} 