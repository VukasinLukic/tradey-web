import { useEffect, useState } from 'react';

const GRID_COLS = 5;
const GRID_ROWS = 4;
const TOTAL_IMAGES = GRID_COLS * GRID_ROWS;

export function HeroSection() {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Create random loading order
    const indices = Array.from({ length: TOTAL_IMAGES }, (_, i) => i);
    const shuffled = indices.sort(() => Math.random() - 0.5);

    // Load images with random delays
    shuffled.forEach((index, i) => {
      setTimeout(() => {
        setLoadedImages(prev => new Set([...prev, index]));
      }, i * 50); // 50ms delay between each image
    });
  }, []);

  return (
    <section className="relative w-screen h-screen overflow-hidden bg-tradey-white">
      {/* Image Grid */}
      <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-5 grid-rows-5 md:grid-rows-4">
        {Array.from({ length: TOTAL_IMAGES }).map((_, index) => (
          <div
            key={index}
            className="relative w-full h-full overflow-hidden"
          >
            <img
              src="/photos/slika za landing 1.jpg"
              alt=""
              className={`w-full h-full object-cover transition-opacity duration-0 ${
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
          className="w-[60%] md:w-[40%] max-w-2xl h-auto"
        />
      </div>
    </section>
  );
}

