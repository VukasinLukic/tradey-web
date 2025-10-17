import type { ReactNode } from 'react';
import { BurgerMenu } from '../navigation/BurgerMenu';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  imagePath?: string;
  imageMode?: 'cover' | 'contain';
  contentAlign?: 'center' | 'left';
}

export function AuthLayout({ children, title, imagePath = '/photos/login_form.jpg', imageMode = 'cover', contentAlign = 'center' }: AuthLayoutProps) {
  return (
    <div className="fixed inset-0 w-screen h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Burger Menu */}
      <BurgerMenu />

      {/* Container for centering content when contentAlign is left */}
      <div className={`w-full h-full flex bg-tradey-white ${contentAlign === 'left' ? 'justify-center items-center' : ''}`}>
        <div className={`flex flex-col md:flex-row h-full bg-tradey-white ${contentAlign === 'left' ? 'w-full max-w-[1600px]' : 'w-full'}`}>
          {/* Left Side - Image */}
          <div className="hidden md:flex md:w-1/2 relative bg-tradey-white">
            {imageMode === 'cover' ? (
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${imagePath})`,
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <img
                  src={imagePath}
                  alt="Auth"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          {/* Right Side - Form */}
          <div className={`w-full md:w-1/2 flex items-center bg-tradey-white overflow-y-auto min-h-screen md:min-h-0 ${
            contentAlign === 'center'
              ? 'justify-center p-6 sm:p-8'
              : 'justify-center md:justify-start p-6 sm:p-8 md:pl-12 lg:pl-16 md:pr-8'
          }`}>
            <div className="w-full max-w-md py-8 md:py-0">
              {/* Title */}
              <h1 className={`font-garamond text-tradey-black font-black leading-none ${
                contentAlign === 'center'
                  ? 'text-6xl md:text-7xl lg:text-8xl mb-8 md:mb-10'
                  : 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 sm:mb-8 md:mb-10'
              }`}>
                {title}
              </h1>

              {/* Form Content */}
              <div className="text-tradey-black">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
