import { type ComponentProps, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface StickyFooterProps extends ComponentProps<'div'> {
  children: ReactNode;
  className?: string;
  heightValue?: string;
}

export function StickyFooter({
  children,
  className = '',
  heightValue = '100dvh',
  ...props
}: StickyFooterProps) {
  return (
    <div
      className="relative"
      style={{ 
        height: heightValue,
        clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' 
      }}
      {...props}
    >
      <div 
        className={`fixed bottom-0 w-full ${className}`}
        style={{ height: heightValue }}
      >
        {children}
      </div>
    </div>
  );
}

export function FooterContent() {
  return (
    <div className="py-8 px-6 md:px-12 h-full w-full flex flex-col justify-between bg-tradey-black">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 shrink-0 gap-8 md:gap-12">
        <div className="flex flex-col gap-2">
          <h3 className="mb-2 uppercase text-tradey-blue font-garamond text-sm font-bold">
            About
          </h3>
          <Link to="/" className="text-tradey-blue font-garamond hover:opacity-70 transition-opacity">
            Home
          </Link>
          <Link to="/profile" className="text-tradey-blue font-garamond hover:opacity-70 transition-opacity">
            Profile
          </Link>
          <Link to="/chat" className="text-tradey-blue font-garamond hover:opacity-70 transition-opacity">
            Messages
          </Link>
          <Link to="/contact" className="text-tradey-blue font-garamond hover:opacity-70 transition-opacity">
            Contact Us
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="mb-2 uppercase text-tradey-blue font-garamond text-sm font-bold">
            Community
          </h3>
          <Link to="/how-it-works" className="text-tradey-blue font-garamond hover:opacity-70 transition-opacity">
            How it works
          </Link>
          <Link to="/community-guidelines" className="text-tradey-blue font-garamond hover:opacity-70 transition-opacity">
            Guidelines
          </Link>
          <Link to="/support" className="text-tradey-blue font-garamond hover:opacity-70 transition-opacity">
            Support
          </Link>
          <Link to="/faq" className="text-tradey-blue font-garamond hover:opacity-70 transition-opacity">
            FAQ
          </Link>
          <Link to="/privacy" className="text-tradey-blue font-garamond hover:opacity-70 transition-opacity">
            Privacy
          </Link>
          <Link to="/terms" className="text-tradey-blue font-garamond hover:opacity-70 transition-opacity">
            Terms of use
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="mb-2 uppercase text-tradey-blue font-garamond text-sm font-bold">
            Social Media
          </h3>
          <a href="#" className="text-tradey-blue font-garamond hover:opacity-70 transition-opacity">
            Facebook
          </a>
          <a href="#" className="text-tradey-blue font-garamond hover:opacity-70 transition-opacity">
            Instagram
          </a>
          <a href="#" className="text-tradey-blue font-garamond hover:opacity-70 transition-opacity">
            Twitter
          </a>
        </div>
      </div>

      {/* Logo and Copyright */}
      <div className="mt-8 flex flex-col items-center gap-6">
        <img 
          src="/photos/svg logo.svg" 
          alt="TRADEY" 
          className="w-48 md:w-64 h-auto"
        />
        <p className="text-tradey-blue font-garamond text-sm text-center">
          ©2024 TRADEY. All rights reserved.
        </p>
      </div>
    </div>
  );
}

