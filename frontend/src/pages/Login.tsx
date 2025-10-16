import { AuthLayout } from '../components/layout/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';

export function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to your TRADEY account"
    >
      <LoginForm />
    </AuthLayout>
  );
} 