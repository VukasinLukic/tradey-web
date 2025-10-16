import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function WhatIsTradeySection() {
  return (
    <section className="relative py-20 px-4 md:px-8 bg-tradey-red overflow-hidden">
      {/* Fabric Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: 'url(/photos/tradey fabric 3.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="font-garamond text-3xl md:text-5xl text-tradey-white mb-6">
          What is TRADEY?
        </h2>
        
        <p className="font-garamond text-lg md:text-xl text-tradey-white mb-8 leading-relaxed max-w-2xl mx-auto">
          TRADEY is a platform for direct clothing exchange without money. 
          Our goal is to create a community that supports sustainable fashion 
          and reduces waste through creative exchange.
        </p>
        
        <Link to="/signup">
          <Button className="bg-tradey-white hover:opacity-90 text-tradey-black font-garamond text-lg md:text-xl px-8 py-4 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300">
            Join Us
          </Button>
        </Link>
      </div>
    </section>
  );
}

