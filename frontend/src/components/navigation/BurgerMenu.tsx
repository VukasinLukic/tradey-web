import { useState } from 'react';
import FlowingMenu from './FlowingMenu';
  
const menuItems = [
  { 
    link: '/', 
    text: 'Home', 
    image: '/photos/slika%20za%20landing%201.jpg' 
  },
  { 
    link: '/profile', 
    text: 'Profile', 
    image: '/photos/real.jpg' 
  },
  { 
    link: '/chat', 
    text: 'Messages', 
    image: '/photos/real2.jpg' 
  },
  { 
    link: '/liked', 
    text: 'Liked', 
    image: '/photos/tradey-real3.jpg' 
  },
];

export function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Burger Button - Sticky */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-40 w-14 h-14 bg-tradey-white rounded-lg flex flex-col items-center justify-center gap-1.5 hover:opacity-90 transition-opacity shadow-lg"
        aria-label="Open menu"
      >
        <span className="w-8 h-0.5 bg-tradey-red rounded-full" />
        <span className="w-8 h-0.5 bg-tradey-red rounded-full" />
        <span className="w-8 h-0.5 bg-tradey-red rounded-full" />
      </button>

      {/* Flowing Menu */}
      {isOpen && (
        <FlowingMenu 
          items={menuItems} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  );
}

