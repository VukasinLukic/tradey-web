import { ImageTrailEffect } from '../components/ui/ImageTrailEffect';
import { StickyFooter, FooterContent } from '../components/navigation/StickyFooter';

export function AboutUsPage() {
  return (
    <>
      <ImageTrailEffect
        images={[
          '/photos/home_page_photos/image_trail/2.png',
          '/photos/home_page_photos/image_trail/3.png',
          '/photos/home_page_photos/image_trail/4.png',
          '/photos/home_page_photos/image_trail/home_4.png',
        ]}
        config={{
          mouseThreshold: 100,
          imageLifespan: 400,
          minImageSize: 150,
          maxImageSize: 220,
          minMovementForImage: 15,
        }}
        className="min-h-screen"
      >
        {/* First Section - Split Layout */}
        <section className="min-h-screen bg-tradey-white">
          {/* Mobile Layout - Stacked */}
          <div className="flex flex-col md:hidden">
            {/* Image */}
            <div className="w-full h-[50vh] relative overflow-hidden">
              <img
                src="/photos/aboutUS_1.jpg"
                alt="About Us"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="px-4 py-12 space-y-8">
              {/* Title */}
              <h1 className="font-fayte text-6xl sm:text-7xl text-tradey-red leading-none">
                About Us
              </h1>

              {/* Description */}
              <div className="space-y-6">
                <p className="font-garamond text-lg text-tradey-black leading-relaxed">
                  TRADEY is a platform for direct clothing exchange without money.
                  Our mission is to create a community that supports sustainable fashion
                  and reduces waste through creative exchange.
                </p>

                <p className="font-garamond text-lg text-tradey-black leading-relaxed italic">
                  We don't buy style. We create it.
                </p>

                <p className="font-garamond text-lg text-tradey-black leading-relaxed">
                  We believe in freedom of expression through clothing, in the power of community,
                  and in the rebellious nature against consumerism. Every piece has its story,
                  every exchange is a new adventure.
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Split 50/50 Full Height */}
          <div className="hidden md:flex md:h-screen">
            {/* Left Side - Image (Full Height, 50% Width) */}
            <div className="w-1/2 h-full relative bg-tradey-white flex items-center justify-center p-8">
              <img
                src="/photos/aboutUS_1.jpg"
                alt="About Us"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Right Side - Content (50% Width) */}
            <div className="w-1/2 h-full flex items-center">
              <div className="px-12 lg:px-16 xl:px-20 space-y-8">
                <h1 className="font-fayte text-7xl lg:text-8xl xl:text-9xl text-tradey-red leading-none">
                  About Us
                </h1>

                <div className="space-y-6">
                  <p className="font-garamond text-xl lg:text-2xl text-tradey-black leading-relaxed">
                    TRADEY is a platform for direct clothing exchange without money.
                    Our mission is to create a community that supports sustainable fashion
                    and reduces waste through creative exchange.
                  </p>

                  <p className="font-garamond text-xl lg:text-2xl text-tradey-black leading-relaxed italic">
                    We don't buy style. We create it.
                  </p>

                  <p className="font-garamond text-xl lg:text-2xl text-tradey-black leading-relaxed">
                    We believe in freedom of expression through clothing, in the power of community,
                    and in the rebellious nature against consumerism. Every piece has its story,
                    every exchange is a new adventure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Second Section - Our Values */}
        <section className="min-h-screen bg-tradey-white flex items-center py-20">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="space-y-12">
              <h2 className="font-fayte text-5xl md:text-6xl lg:text-7xl text-tradey-red leading-none">
                Our Values
              </h2>

              <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                {/* Value 1 */}
                <div className="space-y-4">
                  <h3 className="font-fayte text-3xl md:text-4xl text-tradey-black">
                    Sustainability
                  </h3>
                  <p className="font-garamond text-lg text-tradey-black/80 leading-relaxed">
                    Every piece that is exchanged is a step towards a more sustainable future.
                    We believe in circular fashion and reducing textile waste.
                  </p>
                </div>

                {/* Value 2 */}
                <div className="space-y-4">
                  <h3 className="font-fayte text-3xl md:text-4xl text-tradey-black">
                    Community
                  </h3>
                  <p className="font-garamond text-lg text-tradey-black/80 leading-relaxed">
                    TRADEY is more than a platform - it's a community of people
                    who share the same vision and passion for unique style.
                  </p>
                </div>

                {/* Value 3 */}
                <div className="space-y-4">
                  <h3 className="font-fayte text-3xl md:text-4xl text-tradey-black">
                    Authenticity
                  </h3>
                  <p className="font-garamond text-lg text-tradey-black/80 leading-relaxed">
                    Be yourself. Express yourself. TRADEY is a space where every
                    style is welcome and authenticity reigns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Third Section - Join Us */}
        <section className="min-h-[60vh] bg-tradey-white flex items-center py-20">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="text-center space-y-8">
              <h2 className="font-fayte text-5xl md:text-6xl lg:text-7xl text-tradey-red leading-none">
                Join the Movement
              </h2>
              <p className="font-garamond text-xl md:text-2xl text-tradey-black leading-relaxed max-w-3xl mx-auto">
                Be part of the fashion revolution. Exchange, create, inspire.
              </p>
              <div className="pt-4">
                <a
                  href="/signup"
                  className="inline-block bg-tradey-red text-tradey-white font-fayte text-xl md:text-2xl px-12 py-4 hover:bg-tradey-red/90 transition-colors"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </section>
      </ImageTrailEffect>

      <StickyFooter heightValue="100dvh">
        <FooterContent />
      </StickyFooter>
    </>
  );
}
