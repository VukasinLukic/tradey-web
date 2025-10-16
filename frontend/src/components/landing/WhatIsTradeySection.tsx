import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function WhatIsTradeySection() {
  return (
    <section
      className="relative py-20 px-4 md:px-8 overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url(/photos/pozadina-tekstura-tamnija.jpg)"
      }}
    >
      
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
        
        <Link to="/signup" className="inline-block">
          <Button tone="tradey-white">
            Join Us
          </Button>
        </Link>
      </div>
    </section>
  );
}

