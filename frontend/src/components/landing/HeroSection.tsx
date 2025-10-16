import { useEffect, useState } from 'react';

const GRID_COLS = 5;
const GRID_ROWS = 3;
const TOTAL_IMAGES = GRID_COLS * GRID_ROWS;

// Array of image paths - you can replace these with different images
const IMAGE_PATHS = [
  "/photos/home_page_photos/mjauuuuu.jpeg",  
  "/photos/home_page_photos/download (2).jpeg",
  "/photos/home_page_photos/download (14).jpeg",
  "/photos/home_page_photos/home_2.jpeg",
  "/photos/home_page_photos/download (13).jpeg",
  "/photos/home_page_photos/download (13).jpeg",
  "/photos/home_page_photos/download (2).jpeg",
  "/photos/home_page_photos/home_3.jpeg",  
  "/photos/home_page_photos/download (14).jpeg",
  "/photos/home_page_photos/home_2.jpeg",
  "/photos/home_page_photos/home_2.jpeg",
  "/photos/home_page_photos/download (13).jpeg",
  "/photos/home_page_photos/mjauuuuu.jpeg",  
  "/photos/home_page_photos/download (2).jpeg",
  "/photos/home_page_photos/download (14).jpeg",
  "/photos/home_page_photos/home_2.jpeg",
];

export function HeroSection() {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [showLogo, setShowLogo] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Check if animation has already run
    const animationCompleted = sessionStorage.getItem('heroAnimationCompleted');
    
    if (animationCompleted) {
      // If already animated in this session, show everything immediately
      setShowLogo(true);
      const allIndices = Array.from({ length: TOTAL_IMAGES }, (_, i) => i);
      setLoadedImages(new Set(allIndices));
      setHasAnimated(true);
      return;
    }

    // First time animation
    // Wait 2 seconds, then show logo
    setTimeout(() => {
      setShowLogo(true);
    }, 2000);

    // Create random loading order
    const indices = Array.from({ length: TOTAL_IMAGES }, (_, i) => i);
    const shuffled = indices.sort(() => Math.random() - 0.5);

    // Wait 3 seconds total (2s empty + 1s logo alone), then load images
    shuffled.forEach((index, i) => {
      setTimeout(() => {
        setLoadedImages(prev => new Set([...prev, index]));
        
        // Mark animation as completed after last image loads
        if (index === shuffled[shuffled.length - 1]) {
          sessionStorage.setItem('heroAnimationCompleted', 'true');
          setHasAnimated(true);
        }
      }, 3000 + i * 150); // Start after 3s, then 150ms delay between each image
    });
  }, []);

  return (
    <section className="relative w-screen h-screen overflow-hidden bg-tradey-white">
      {/* Image Grid - 5 columns x 3 rows for more square-like cells */}
      <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-5 grid-rows-3">
        {Array.from({ length: TOTAL_IMAGES }).map((_, index) => (
          <div
            key={index}
            className="relative w-full h-full overflow-hidden"
          >
            <img
              src={IMAGE_PATHS[index] || IMAGE_PATHS[0]}
              alt=""
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Logo Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <img
          src="/photos/tradey tekst logo.svg"
          alt="TRADEY"
          className={`w-[60%] md:w-[40%] max-w-2xl h-auto transition-opacity duration-1000 ${
            showLogo ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </section>
  );
}

