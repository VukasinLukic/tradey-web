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
    <div className="py-8 px-6 md:px-12 h-full w-full flex flex-col justify-between bg-tradey-blue">
      <div className="grid sm:grid-cols-2 grid-cols-1 shrink-0 gap-12 md:gap-20">
        <div className="flex flex-col gap-2">
          <h3 className="mb-2 uppercase text-tradey-black font-garamond text-sm font-bold">
            About
          </h3>
          <Link to="/" className="text-tradey-black font-garamond hover:opacity-70 transition-opacity">
            Home
          </Link>
          <Link to="/profile" className="text-tradey-black font-garamond hover:opacity-70 transition-opacity">
            Profile
          </Link>
          <Link to="/chat" className="text-tradey-black font-garamond hover:opacity-70 transition-opacity">
            Messages
          </Link>
          <a href="#" className="text-tradey-black font-garamond hover:opacity-70 transition-opacity">
            Contact Us
          </a>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="mb-2 uppercase text-tradey-black font-garamond text-sm font-bold">
            Community
          </h3>
          <a href="#" className="text-tradey-black font-garamond hover:opacity-70 transition-opacity">
            How it works
          </a>
          <a href="#" className="text-tradey-black font-garamond hover:opacity-70 transition-opacity">
            Guidelines
          </a>
          <a href="#" className="text-tradey-black font-garamond hover:opacity-70 transition-opacity">
            Support
          </a>
          <a href="#" className="text-tradey-black font-garamond hover:opacity-70 transition-opacity">
            Privacy
          </a>
        </div>
      </div>

      <div className="flex justify-between flex-col gap-4 sm:flex-row items-end mt-10">
        <div className="w-full sm:w-auto max-w-2xl">
          <img
            src="/photos/tradey tekst logo.svg"
            alt="TRADEY"
            className="w-full h-auto"
            style={{ maxHeight: '200px', objectFit: 'contain' }}
          />
        </div>
        <p className="text-tradey-black font-garamond text-sm whitespace-nowrap">
          ©2024 TRADEY
        </p>
      </div>
    </div>
  );
}

