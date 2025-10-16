import { ReactNode } from 'react';
import { BurgerMenu } from '../navigation/BurgerMenu';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="fixed inset-0 w-screen h-screen flex overflow-hidden">
      {/* Burger Menu */}
      <BurgerMenu />

      {/* Left Side - Image */}
      <div className="hidden md:flex md:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/photos/login_form.jpg)',
          }}
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-tradey-white overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Title */}
          <h1 className="font-garamond text-tradey-black text-7xl md:text-8xl font-black mb-10 leading-none">
            {title}
          </h1>

          {/* Form Content */}
          <div className="text-tradey-black">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
