import React from 'react';

export const CommunityGuidelinesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-tradey-black text-tradey-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-tradey-red mb-6">
            Community Guidelines
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Our community thrives on respect, honesty, and sustainability. These guidelines help us maintain a positive environment for everyone.
          </p>
        </div>

        {/* Guidelines Sections */}
        <div className="space-y-12">
          {/* Be Respectful */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-tradey-red text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                ❤️
              </div>
              <h2 className="text-2xl font-bold">Be Respectful</h2>
            </div>
            <p className="text-gray-300 mb-4">
              Treat every member of our community with kindness and respect. We're all here because we love fashion and sustainability.
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Use friendly and constructive language in all communications</li>
              <li>Respect different styles, sizes, and fashion preferences</li>
              <li>Be understanding if someone needs to cancel or reschedule a swap</li>
              <li>Celebrate diversity in our community</li>
            </ul>
          </div>

          {/* Be Honest */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-tradey-red text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                🤝
              </div>
              <h2 className="text-2xl font-bold">Be Honest</h2>
            </div>
            <p className="text-gray-300 mb-4">
              Honesty builds trust in our community. Accurate listings help ensure successful swaps for everyone.
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Accurately describe item condition, size, and any flaws</li>
              <li>Use clear, well-lit photos from multiple angles</li>
              <li>Be transparent about brands and authenticity</li>
              <li>Update item availability promptly</li>
            </ul>
          </div>

          {/* Communicate Clearly */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-tradey-red text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                💬
              </div>
              <h2 className="text-2xl font-bold">Communicate Clearly</h2>
            </div>
            <p className="text-gray-300 mb-4">
              Good communication prevents misunderstandings and helps swaps go smoothly.
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Respond to messages within 24-48 hours</li>
              <li>Clearly state your location and swap preferences</li>
              <li>Discuss swap details before meeting or shipping</li>
              <li>Be upfront about any concerns or questions</li>
            </ul>
          </div>

          {/* Safety First */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-tradey-red text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                🛡️
              </div>
              <h2 className="text-2xl font-bold">Safety First</h2>
            </div>
            <p className="text-gray-300 mb-4">
              Your safety is our top priority. Follow these guidelines to stay safe while swapping.
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Meet in public places for local swaps</li>
              <li>Tell a friend or family member about your swap plans</li>
              <li>Use tracked shipping for long-distance exchanges</li>
              <li>Trust your instincts - if something feels off, walk away</li>
            </ul>
          </div>

          {/* Sustainability Focus */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-tradey-red text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                🌱
              </div>
              <h2 className="text-2xl font-bold">Sustainability Focus</h2>
            </div>
            <p className="text-gray-300 mb-4">
              Remember, we're here to reduce fashion waste and promote sustainable consumption.
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Only list items you're genuinely willing to part with</li>
              <li>Consider quality over quantity in your listings</li>
              <li>Give items a second life before considering disposal</li>
              <li>Share sustainable fashion tips with the community</li>
            </ul>
          </div>
        </div>

        {/* Reporting */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Reporting Violations</h2>
          <div className="bg-gray-800 p-8 rounded-lg">
            <p className="text-gray-300 mb-4">
              If you encounter behavior that violates these guidelines, please report it to our team. We review all reports and take appropriate action to maintain community standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-tradey-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                Report a User
              </button>
              <button className="bg-tradey-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                Report an Item
              </button>
            </div>
          </div>
        </div>

        {/* Community Values */}
        <div className="mt-16 text-center">
          <div className="bg-tradey-red text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Our Community Values</h3>
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="text-4xl mb-2">🤝</div>
                <h4 className="font-semibold mb-2">Trust</h4>
                <p className="text-sm opacity-90">Building lasting relationships through honest exchanges</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🌱</div>
                <h4 className="font-semibold mb-2">Sustainability</h4>
                <p className="text-sm opacity-90">Reducing waste one swap at a time</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🎨</div>
                <h4 className="font-semibold mb-2">Creativity</h4>
                <p className="text-sm opacity-90">Expressing unique styles through fashion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
