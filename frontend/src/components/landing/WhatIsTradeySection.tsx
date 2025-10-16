import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function WhatIsTradeySection() {
  return (
    <section
      className="relative py-20 px-4 md:px-8 lg:px-16 overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url(/photos/pozadina-tekstura-tamnija.jpg)"
      }}
    >
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Mobile Layout - Stacked */}
        <div className="flex flex-col md:hidden space-y-8">
          <h2 className="font-fayte text-5xl sm:text-6xl text-tradey-white leading-tight">
            What is TRADEY?
          </h2>
          
          <p className="font-garamond text-lg text-tradey-white leading-relaxed">
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

        {/* Desktop Layout - Split (reversed: title left, text+button right) */}
        <div className="hidden md:grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Title */}
          <div className="flex items-center justify-start">
            <h2 className="font-fayte text-6xl lg:text-7xl xl:text-8xl text-tradey-white leading-tight text-left">
              What is TRADEY?
            </h2>
          </div>

          {/* Right Side - Text and Button */}
          <div className="space-y-8">
            <p className="font-garamond text-xl lg:text-2xl text-tradey-white leading-relaxed">
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
        </div>
      </div>
    </section>
  );
}

