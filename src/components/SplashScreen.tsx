import React, { useState, useEffect } from 'react';

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const images = [
    '/photos/1.png',
    '/photos/2.png'
  ];

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % images.length);
    }, 500);

    const splashTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
      }, 300);
    }, 2000);

    return () => {
      clearInterval(imageInterval);
      clearTimeout(splashTimer);
    };
  }, [onComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 z-50 transition-opacity duration-300 opacity-0 pointer-events-none" />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <img
            key={image}
            src={image}
            alt={`Tradey ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              currentImage === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SplashScreen; 