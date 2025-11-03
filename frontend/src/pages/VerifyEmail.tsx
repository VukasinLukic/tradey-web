import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase/config';

export function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const email = location.state?.email || user?.email;

  useEffect(() => {
    // Check if user is already verified
    if (user && user.emailVerified) {
      navigate('/profile');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Poll for email verification status every 3 seconds
    const interval = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          navigate('/profile');
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleResendEmail = async () => {
    if (!auth.currentUser) {
      setError('No user found. Please sign up again.');
      return;
    }

    setResending(true);
    setError(null);

    try {
      await sendEmailVerification(auth.currentUser, {
        url: window.location.origin + '/profile',
        handleCodeInApp: false,
      });
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch (err) {
      console.error('Error resending verification email:', err);
      setError('Failed to resend email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-tradey-white flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          {/* Email Icon */}
          <div className="mx-auto w-20 h-20 bg-tradey-red/10 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-tradey-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="font-fayte text-4xl md:text-5xl text-tradey-black mb-4 tracking-tight uppercase">
            Verify Your Email
          </h1>

          <p className="font-sans text-tradey-black/70 text-base md:text-lg mb-2">
            We've sent a verification email to:
          </p>
          <p className="font-sans text-tradey-red font-semibold text-lg mb-6">
            {email}
          </p>

          <p className="font-sans text-tradey-black/60 text-sm leading-relaxed mb-8">
            Click the link in the email to verify your account. You'll be automatically redirected once verified, or you can refresh this page.
          </p>

          {/* Resend Email Button */}
          <button
            onClick={handleResendEmail}
            disabled={resending || resent}
            className="w-full py-3 bg-tradey-black hover:bg-tradey-black/80 text-white font-sans text-base font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {resending ? 'Sending...' : resent ? 'Email Sent!' : 'Resend Verification Email'}
          </button>

          {error && (
            <div className="bg-tradey-red/10 border border-tradey-red rounded-lg p-3 mb-4">
              <p className="text-tradey-red text-sm font-sans">{error}</p>
            </div>
          )}

          {resent && (
            <div className="bg-green-500/10 border border-green-500 rounded-lg p-3 mb-4">
              <p className="text-green-700 text-sm font-sans">Verification email sent! Check your inbox.</p>
            </div>
          )}

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-tradey-black/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-tradey-white text-tradey-black/60 font-sans">
                or
              </span>
            </div>
          </div>

          {/* Back to Login */}
          <Link
            to="/login"
            className="block w-full py-3 text-center bg-white hover:bg-tradey-black/5 border border-tradey-black/20 text-tradey-black font-sans text-base font-semibold rounded-full transition-colors"
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
            <li>Wait a few minutes and try resending</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
