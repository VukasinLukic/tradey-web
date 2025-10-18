import { AuthLayout } from '../components/layout/AuthLayout';
import { SignupForm } from '../components/auth/SignupForm';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export function SignupPage() {
  const { user, loading } = useAuth();

  // Redirect to profile if already logged in
  if (loading) {
    return null; // Or a loading spinner
  }

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <AuthLayout
      title="Create account"
      imagePath="/photos/signup_1.jpg"
      imageMode="contain"
      contentAlign="left"
    >
      <div className="mb-6">
        <p className="text-sm text-tradey-black/70 font-sans">
          Already have an account?{' '}
          <a href="/login" className="text-tradey-red font-semibold hover:underline">
            Sign in
          </a>
        </p>
      </div>
      <SignupForm />
    </AuthLayout>
  );
} 