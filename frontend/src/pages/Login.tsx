import { AuthLayout } from '../components/layout/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export function LoginPage() {
  const { user, loading } = useAuth();

  // Redirect to profile if already logged in
  if (loading) {
    return null; // Or a loading spinner
  }

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <AuthLayout title="Welcome back">
      <LoginForm />
    </AuthLayout>
  );
} 