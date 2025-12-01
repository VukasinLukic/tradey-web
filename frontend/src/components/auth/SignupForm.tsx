import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, setPersistence, browserLocalPersistence, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { usersApi } from '../../services/api';
import { CityAutocomplete } from '../ui/CityAutocomplete';

export function SignupForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
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

    // Remove all non-digit characters from phone
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 9 || cleanPhone.length > 15) {
      setError('Please enter a valid phone number (9-15 digits).');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Ensure persistence is set to LOCAL (persists across browser sessions)
      await setPersistence(auth, browserLocalPersistence);

      // Step 2: Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 3: Force token refresh to ensure it's cached
      await user.getIdToken(true);

      // Step 4: Create user profile in backend (which writes to Firestore)
      console.log('Creating user profile in backend for UID:', user.uid);
      const profileResponse = await usersApi.createProfile({
        uid: user.uid,
        username,
        email: user.email!,
        phone: cleanPhone, // Use cleaned phone number
        location,
      });
      console.log('User profile created successfully:', profileResponse.data);

      // Step 5: Try to send email verification (optional, don't block signup if it fails)
      try {
        await sendEmailVerification(user, {
          url: window.location.origin + '/profile',
          handleCodeInApp: false,
        });
        console.log('Email verification sent');
      } catch (emailError) {
        console.warn('Failed to send email verification:', emailError);
        // Continue anyway - user can verify later
      }

      // Step 6: Wait for Firestore replicas to sync (1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 7: Navigate to home page (profile may still be syncing)
      navigate('/');
    } catch (error) {
      // Handle Firebase Auth errors
      const firebaseError = error as { code?: string; response?: { data?: { error?: string; errors?: any[] } }; message?: string };

      console.error('Signup error:', error);

      if (firebaseError.code) {
        switch (firebaseError.code) {
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
            break;
        }
      }
      // Handle backend API errors
      else if (firebaseError.response) {
        const { data } = firebaseError.response;
        let message = data?.error || 'Failed to create user profile.';

        // If validation errors exist, show the first one
        if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          const firstError = data.errors[0];
          message = firstError.message || firstError.path?.[0] || message;
        }

        setError(message);
        console.error('Backend error:', data);
      }
      // Handle network errors
      else {
        setError('Network error. Please check if the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5">
      {/* Username Input */}
      <div>
        <label htmlFor="username" className="block font-sans text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 md:mb-1.5 text-tradey-black">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          className="w-full px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 bg-tradey-white border border-tradey-black/20 rounded-lg text-tradey-black text-xs sm:text-sm md:text-base font-sans placeholder-tradey-black/40 focus:outline-none focus:ring-2 focus:ring-tradey-red focus:border-transparent transition-all"
          placeholder="your_username"
        />
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block font-sans text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 md:mb-1.5 text-tradey-black">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 bg-tradey-white border border-tradey-black/20 rounded-lg text-tradey-black text-xs sm:text-sm md:text-base font-sans placeholder-tradey-black/40 focus:outline-none focus:ring-2 focus:ring-tradey-red focus:border-transparent transition-all"
          placeholder="name@example.com"
        />
      </div>

      {/* Phone and Location Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Phone Input */}
        <div>
          <label htmlFor="phone" className="block font-sans text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-tradey-black">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            autoComplete="tel"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-tradey-white border border-tradey-black/20 rounded-lg text-tradey-black text-sm sm:text-base font-sans placeholder-tradey-black/40 focus:outline-none focus:ring-2 focus:ring-tradey-red focus:border-transparent transition-all"
            placeholder="060 123 4567"
          />
        </div>

        {/* Location Autocomplete */}
        <div>
          <label htmlFor="location" className="block font-sans text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-tradey-black">
            City / Location
          </label>
          <CityAutocomplete
            value={location}
            onChange={setLocation}
            required
            placeholder="e.g. Beograd, Novi Sad..."
          />
        </div>
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="block font-sans text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-tradey-black">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-tradey-white border border-tradey-black/20 rounded-lg text-tradey-black text-sm sm:text-base font-sans placeholder-tradey-black/40 focus:outline-none focus:ring-2 focus:ring-tradey-red focus:border-transparent transition-all"
          placeholder="••••••••"
        />
        <p className="text-tradey-black/60 text-xs font-sans mt-1">Must be at least 6 characters</p>
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
        className="w-full py-2.5 sm:py-3 md:py-3.5 bg-tradey-red hover:bg-tradey-red/80 text-tradey-white font-sans text-sm sm:text-base font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm mt-3 sm:mt-4 md:mt-6"
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>

      {/* Divider */}
      <div className="relative py-2 sm:py-3 md:py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-tradey-black/10"></div>
        </div>
        <div className="relative flex justify-center text-xs sm:text-sm">
          <span className="px-3 sm:px-4 bg-tradey-white text-tradey-black/60 font-sans">
            Already have an account?
          </span>
        </div>
      </div>

      {/* Log In Link */}
      <a
        href="/login"
        className="block w-full py-2.5 sm:py-3 md:py-3.5 text-center bg-tradey-white hover:bg-tradey-black/5 border border-tradey-black/20 text-tradey-black font-sans text-sm sm:text-base font-semibold rounded-full transition-colors"
      >
        Log in
      </a>
    </form>
  );
} 