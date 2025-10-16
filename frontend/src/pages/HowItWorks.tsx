import React from 'react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-tradey-black text-tradey-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-tradey-red mb-6">
            How TRADEY Works
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Discover the simple process of swapping clothes sustainably and building community connections.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-shrink-0 w-16 h-16 bg-tradey-red text-white rounded-full flex items-center justify-center text-2xl font-bold">
              1
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">Create Your Profile</h2>
              <p className="text-gray-300 mb-4">
                Sign up with your email and create a profile that showcases your style. Add a bio, location, and profile picture to connect with other fashion enthusiasts.
              </p>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">
                  💡 <strong>Pro tip:</strong> A great bio helps others understand your style and makes it easier to find perfect swap matches.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-shrink-0 w-16 h-16 bg-tradey-red text-white rounded-full flex items-center justify-center text-2xl font-bold">
              2
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">List Your Items</h2>
              <p className="text-gray-300 mb-4">
                Upload photos of clothes you want to swap. Add details like size, brand, condition, and style tags. Be honest about the item's condition for successful swaps.
              </p>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">
                  📸 <strong>Pro tip:</strong> Take photos in good lighting against a clean background. Multiple angles help others see the true condition.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-shrink-0 w-16 h-16 bg-tradey-red text-white rounded-full flex items-center justify-center text-2xl font-bold">
              3
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">Browse & Connect</h2>
              <p className="text-gray-300 mb-4">
                Explore the marketplace to find items you love. Use filters for size, style, and condition. When you find something perfect, start a chat with the owner.
              </p>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">
                  🔍 <strong>Pro tip:</strong> Save items you're interested in and check back regularly - popular items go fast!
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-shrink-0 w-16 h-16 bg-tradey-red text-white rounded-full flex items-center justify-center text-2xl font-bold">
              4
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">Make the Swap</h2>
              <p className="text-gray-300 mb-4">
                Arrange a meetup or shipping with your swap partner. Exchange items and enjoy your new-to-you pieces! Rate the experience to build trust in the community.
              </p>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">
                  🤝 <strong>Pro tip:</strong> Always meet in public places for local swaps, and consider using tracked shipping for long-distance exchanges.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-tradey-red text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Swapping?</h3>
            <p className="mb-6">Join thousands of fashion lovers already trading sustainably.</p>
            <button className="bg-tradey-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Get Started Now
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Common Questions</h2>
          <div className="space-y-6">
            <div className="border-b border-gray-700 pb-4">
              <h3 className="text-xl font-semibold mb-2">Is swapping really free?</h3>
              <p className="text-gray-300">Yes! TRADEY is built on the principle of free clothing swaps. No money changes hands - just clothes for clothes.</p>
            </div>
            <div className="border-b border-gray-700 pb-4">
              <h3 className="text-xl font-semibold mb-2">What if I receive an item in poor condition?</h3>
              <p className="text-gray-300">We encourage honest listings and community ratings. If you receive an item not as described, you can report it and we'll help resolve the issue.</p>
            </div>
            <div className="border-b border-gray-700 pb-4">
              <h3 className="text-xl font-semibold mb-2">How do I know items are genuine?</h3>
              <p className="text-gray-300">Community ratings and reviews help build trust. Start with local swaps to meet traders in person, and always ask questions before agreeing to a swap.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
