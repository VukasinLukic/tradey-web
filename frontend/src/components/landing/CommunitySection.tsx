export function CommunitySection() {
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
        <h2 className="font-fayte text-4xl md:text-6xl text-tradey-white mb-8">
          Join the Movement
        </h2>
        
        <p className="font-garamond text-lg md:text-xl text-tradey-white leading-relaxed max-w-2xl mx-auto">
          Be part of a community that believes fashion is freedom, 
          and your wardrobe is a means of expression. 
          Don't throw it, tradey it.
        </p>
      </div>
    </section>
  );
}

