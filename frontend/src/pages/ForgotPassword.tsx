import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/config';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email, {
        url: window.location.origin + '/login', // Redirect URL after reset
        handleCodeInApp: false,
      });
      setSent(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        default:
          setError('Failed to send reset email. Please try again.');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-tradey-white flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            {/* Success Icon */}
            <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="font-fayte text-4xl md:text-5xl text-tradey-black mb-4 tracking-tight uppercase">
              Check Your Email
            </h1>

            <p className="font-sans text-tradey-black/70 text-base md:text-lg mb-2">
              We've sent a password reset link to:
            </p>
            <p className="font-sans text-tradey-red font-semibold text-lg mb-6">
              {email}
            </p>

            <p className="font-sans text-tradey-black/60 text-sm leading-relaxed mb-8">
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>

            {/* Back to Login */}
            <Link
              to="/login"
              className="block w-full py-3 bg-tradey-red hover:bg-tradey-red/80 text-white font-sans text-base font-semibold rounded-full transition-colors"
            >
              Back to Login
            </Link>
          </div>

          {/* Tips */}
          <div className="bg-tradey-black/5 rounded-lg p-4 border border-tradey-black/10">
            <h3 className="font-sans font-semibold text-tradey-black mb-2 text-sm">
              Didn't receive the email?
            </h3>
            <ul className="font-sans text-tradey-black/70 text-xs space-y-1 list-disc list-inside">
              <li>Check your spam or junk folder</li>
              <li>Make sure the email address is correct</li>
              <li>Wait a few minutes before requesting another email</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tradey-white flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          {/* Lock Icon */}
          <div className="mx-auto w-20 h-20 bg-tradey-red/10 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-tradey-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h1 className="font-fayte text-4xl md:text-5xl text-tradey-black mb-4 tracking-tight uppercase">
            Reset Password
          </h1>

          <p className="font-sans text-tradey-black/60 text-sm mb-8">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

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
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-tradey-black/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-tradey-white text-tradey-black/60 font-sans">
                Remember your password?
              </span>
            </div>
          </div>

          {/* Back to Login */}
          <Link
            to="/login"
            className="block w-full py-3.5 text-center bg-white hover:bg-tradey-black/5 border border-tradey-black/20 text-tradey-black font-sans text-base font-semibold rounded-full transition-colors"
          >
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
}
