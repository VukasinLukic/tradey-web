import React from 'react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-tradey-white">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header - Minimal clean */}
        <div className="mb-12">
          <h1 className="font-fayte text-7xl md:text-9xl text-tradey-black mb-2 tracking-tight uppercase">
            HOW IT WORKS
          </h1>
          <p className="font-sans text-tradey-black/60 text-sm max-w-2xl">
            Simple steps to start swapping clothes sustainably
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-16">
          {/* Step 1 */}
          <div className="border-b border-tradey-black/10 pb-16">
            <div className="flex items-start gap-8">
              <div className="flex-shrink-0 w-12 h-12 bg-tradey-red text-white flex items-center justify-center font-fayte text-lg">
                1
              </div>
              <div className="flex-1">
                <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">Create Your Profile</h2>
                <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">
                  Sign up with your email and create a profile that showcases your style. Add a bio, location, and profile picture to connect with other fashion enthusiasts.
                </p>
                <div className="bg-tradey-black/5 p-4 border-l-4 border-tradey-red">
                  <p className="font-sans text-xs text-tradey-black/60">
                    <strong>Pro tip:</strong> A great bio helps others understand your style and makes it easier to find perfect swap matches.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="border-b border-tradey-black/10 pb-16">
            <div className="flex items-start gap-8">
              <div className="flex-shrink-0 w-12 h-12 bg-tradey-red text-white flex items-center justify-center font-fayte text-lg">
                2
              </div>
              <div className="flex-1">
                <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">List Your Items</h2>
                <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">
                  Upload photos of clothes you want to swap. Add details like size, brand, condition, and style tags. Be honest about the item's condition for successful swaps.
                </p>
                <div className="bg-tradey-black/5 p-4 border-l-4 border-tradey-red">
                  <p className="font-sans text-xs text-tradey-black/60">
                    <strong>Pro tip:</strong> Take photos in good lighting against a clean background. Multiple angles help others see the true condition.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="border-b border-tradey-black/10 pb-16">
            <div className="flex items-start gap-8">
              <div className="flex-shrink-0 w-12 h-12 bg-tradey-red text-white flex items-center justify-center font-fayte text-lg">
                3
              </div>
              <div className="flex-1">
                <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">Browse & Connect</h2>
                <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">
                  Explore the marketplace to find items you love. Use filters for size, style, and condition. When you find something perfect, start a chat with the owner.
                </p>
                <div className="bg-tradey-black/5 p-4 border-l-4 border-tradey-red">
                  <p className="font-sans text-xs text-tradey-black/60">
                    <strong>Pro tip:</strong> Save items you're interested in and check back regularly - popular items go fast!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="pb-16">
            <div className="flex items-start gap-8">
              <div className="flex-shrink-0 w-12 h-12 bg-tradey-red text-white flex items-center justify-center font-fayte text-lg">
                4
              </div>
              <div className="flex-1">
                <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">Make the Swap</h2>
                <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">
                  Arrange a meetup or shipping with your swap partner. Exchange items and enjoy your new-to-you pieces! Rate the experience to build trust in the community.
                </p>
                <div className="bg-tradey-black/5 p-4 border-l-4 border-tradey-red">
                  <p className="font-sans text-xs text-tradey-black/60">
                    <strong>Pro tip:</strong> Always meet in public places for local swaps, and consider using tracked shipping for long-distance exchanges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 pt-16 border-t border-tradey-black/10">
          <div className="bg-tradey-red text-white p-8">
            <h3 className="font-fayte text-3xl mb-4 uppercase">Ready to Start Swapping?</h3>
            <p className="font-sans text-sm mb-6 opacity-90">Join thousands of fashion lovers already trading sustainably.</p>
            <button className="bg-white text-tradey-red px-8 py-3 font-sans text-sm font-medium hover:bg-gray-100 transition-colors">
              Get Started Now
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="font-fayte text-4xl text-tradey-black mb-12 uppercase">Common Questions</h2>
          <div className="space-y-8">
            <div className="border-b border-tradey-black/10 pb-8">
              <h3 className="font-fayte text-lg text-tradey-black mb-3 uppercase">Is swapping really free?</h3>
              <p className="font-sans text-tradey-black/70 text-sm leading-relaxed">Yes! TRADEY is built on the principle of free clothing swaps. No money changes hands - just clothes for clothes.</p>
            </div>
            <div className="border-b border-tradey-black/10 pb-8">
              <h3 className="font-fayte text-lg text-tradey-black mb-3 uppercase">What if I receive an item in poor condition?</h3>
              <p className="font-sans text-tradey-black/70 text-sm leading-relaxed">We encourage honest listings and community ratings. If you receive an item not as described, you can report it and we'll help resolve the issue.</p>
            </div>
            <div className="pb-8">
              <h3 className="font-fayte text-lg text-tradey-black mb-3 uppercase">How do I know items are genuine?</h3>
              <p className="font-sans text-tradey-black/70 text-sm leading-relaxed">Community ratings and reviews help build trust. Start with local swaps to meet traders in person, and always ask questions before agreeing to a swap.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
