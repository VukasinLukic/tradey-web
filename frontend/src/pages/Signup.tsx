import { AuthLayout } from '../components/layout/AuthLayout';
import { SignupForm } from '../components/auth/SignupForm';

export function SignupPage() {
  return (
    <AuthLayout
      title="Create account"
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