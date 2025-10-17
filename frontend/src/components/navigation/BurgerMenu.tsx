import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import FlowingMenu from './FlowingMenu';

const menuItems = [
  {
    link: '/',
    text: 'Home',
    image: '/photos/real3.jpg'
  },
  {
    link: '/marketplace',
    text: 'Marketplace',
    image: '/photos/real.jpg'
  },
  {
    link: '/profile',
    text: 'Profile',
    image: '/photos/real2.jpg'
  },
  {
    link: '/chat',
    text: 'Messages',
    image: '/photos/tradey-real3.jpg'
  },
];

export function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Determine if we're on a dark background (landing page)
  const isDarkBg = location.pathname === '/';

  return (
    <>
      {/* Burger Button - Minimal, adapts to background */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-6 right-6 z-40 w-12 h-12 rounded-full flex flex-col items-center justify-center gap-1 hover:opacity-70 transition-all ${
          isDarkBg ? 'bg-tradey-white' : 'bg-tradey-black'
        }`}
        aria-label="Open menu"
      >
        <span className={`w-6 h-0.5 rounded-full ${isDarkBg ? 'bg-tradey-black' : 'bg-tradey-white'}`} />
        <span className={`w-6 h-0.5 rounded-full ${isDarkBg ? 'bg-tradey-black' : 'bg-tradey-white'}`} />
        <span className={`w-6 h-0.5 rounded-full ${isDarkBg ? 'bg-tradey-black' : 'bg-tradey-white'}`} />
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
