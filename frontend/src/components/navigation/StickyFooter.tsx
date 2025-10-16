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
    <div className="py-4 px-4 sm:py-6 sm:px-6 md:py-8 md:px-8 lg:px-12 h-full w-full flex flex-col justify-between bg-tradey-black">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 shrink-0 gap-6 md:gap-8 lg:gap-12">
        <div className="flex flex-col gap-2">
          <h3 className="mb-2 md:mb-4 uppercase text-tradey-blue font-garamond text-2xl sm:text-3xl md:text-4xl font-bold">
            About
          </h3>
          <Link to="/" className="text-tradey-blue font-sans text-sm md:text-base lg:text-lg hover:opacity-70 transition-opacity">
            Home
          </Link>
          <Link to="/profile" className="text-tradey-blue font-sans text-sm md:text-base lg:text-lg hover:opacity-70 transition-opacity">
            Profile
          </Link>
          <Link to="/chat" className="text-tradey-blue font-sans text-sm md:text-base lg:text-lg hover:opacity-70 transition-opacity">
            Messages
          </Link>
          <Link to="/contact" className="text-tradey-blue font-sans text-sm md:text-base lg:text-lg hover:opacity-70 transition-opacity">
            Contact Us
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="mb-2 md:mb-4 uppercase text-tradey-blue font-garamond text-2xl sm:text-3xl md:text-4xl font-bold">
            Community
          </h3>
          <Link to="/how-it-works" className="text-tradey-blue font-sans text-sm md:text-base lg:text-lg hover:opacity-70 transition-opacity">
            How it works
          </Link>
          <Link to="/community-guidelines" className="text-tradey-blue font-sans text-sm md:text-base lg:text-lg hover:opacity-70 transition-opacity">
            Guidelines
          </Link>
          <Link to="/support" className="text-tradey-blue font-sans text-sm md:text-base lg:text-lg hover:opacity-70 transition-opacity">
            Support
          </Link>
          <Link to="/faq" className="text-tradey-blue font-sans text-sm md:text-base lg:text-lg hover:opacity-70 transition-opacity">
            FAQ
          </Link>
          <Link to="/privacy" className="text-tradey-blue font-sans text-sm md:text-base lg:text-lg hover:opacity-70 transition-opacity">
            Privacy
          </Link>
          <Link to="/terms" className="text-tradey-blue font-sans text-sm md:text-base lg:text-lg hover:opacity-70 transition-opacity">
            Terms of use
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="mb-2 md:mb-4 uppercase text-tradey-blue font-garamond text-2xl sm:text-3xl md:text-4xl font-bold">
            Social Media
          </h3>
          <a href="#" className="text-tradey-blue font-sans text-sm md:text-base lg:text-lg hover:opacity-70 transition-opacity">
            Facebook
          </a>
          <a href="#" className="text-tradey-blue font-sans text-sm md:text-base lg:text-lg hover:opacity-70 transition-opacity">
            Instagram
          </a>
          <a href="#" className="text-tradey-blue font-sans text-sm md:text-base lg:text-lg hover:opacity-70 transition-opacity">
            Twitter
          </a>
        </div>
      </div>

      {/* Logo and Copyright */}
      <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4 md:gap-6">
        <img 
          src="/photos/svg logo.svg" 
          alt="TRADEY" 
          className="w-full max-w-[280px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] h-auto mx-auto md:mx-0"
        />
        <p className="text-tradey-blue font-sans text-xs sm:text-sm md:text-base text-center md:text-right whitespace-nowrap">
          ©2024 TRADEY. All rights reserved.
        </p>
      </div>
    </div>
  );
}

