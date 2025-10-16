import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function CommunitySection() {
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
            Join the Movement
          </h2>
          
          <p className="font-garamond text-lg text-tradey-white leading-relaxed">
            Be part of a community that believes fashion is freedom, 
            and your wardrobe is a means of expression. 
            Don't throw it, tradey it.
          </p>
          
          <Link to="/signup" className="inline-block">
            <Button tone="tradey-white">
              Join Us
            </Button>
          </Link>
        </div>

        {/* Desktop Layout - Split */}
        <div className="hidden md:grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Text and Button */}
          <div className="space-y-8">
            <p className="font-garamond text-xl lg:text-2xl text-tradey-white leading-relaxed">
              Be part of a community that believes fashion is freedom, 
              and your wardrobe is a means of expression. 
              Don't throw it, tradey it.
            </p>
            
            <Link to="/signup" className="inline-block">
              <Button tone="tradey-white">
                Join Us
              </Button>
            </Link>
          </div>

          {/* Right Side - Title */}
          <div className="flex items-center justify-end">
            <h2 className="font-fayte text-6xl lg:text-7xl xl:text-8xl text-tradey-white leading-tight text-right">
              Join the Movement
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}

