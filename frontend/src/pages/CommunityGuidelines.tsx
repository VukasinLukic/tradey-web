import React from 'react';

export const CommunityGuidelinesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-tradey-white">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-fayte text-7xl md:text-9xl text-tradey-black mb-2 tracking-tight uppercase">
            GUIDELINES
          </h1>
          <p className="font-sans text-tradey-black/60 text-sm max-w-2xl">
            Our community thrives on respect, honesty, and sustainability. These guidelines help us maintain a positive environment for everyone.
          </p>
        </div>

        {/* Guidelines Sections */}
        <div className="space-y-16">
          {/* Be Respectful */}
          <div className="border-b border-tradey-black/10 pb-16">
            <div className="flex items-start gap-8">
              <div className="flex-shrink-0 w-12 h-12 bg-tradey-red text-white flex items-center justify-center font-fayte text-lg">
                1
              </div>
              <div className="flex-1">
                <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">Be Respectful</h2>
                <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">
                  Treat every member of our community with kindness and respect. We're all here because we love fashion and sustainability.
                </p>
                <ul className="space-y-2">
                  <li className="font-sans text-tradey-black/60 text-xs">• Use friendly and constructive language in all communications</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Respect different styles, sizes, and fashion preferences</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Be understanding if someone needs to cancel or reschedule a swap</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Celebrate diversity in our community</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Be Honest */}
          <div className="border-b border-tradey-black/10 pb-16">
            <div className="flex items-start gap-8">
              <div className="flex-shrink-0 w-12 h-12 bg-tradey-red text-white flex items-center justify-center font-fayte text-lg">
                2
              </div>
              <div className="flex-1">
                <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">Be Honest</h2>
                <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">
                  Honesty builds trust in our community. Accurate listings help ensure successful swaps for everyone.
                </p>
                <ul className="space-y-2">
                  <li className="font-sans text-tradey-black/60 text-xs">• Accurately describe item condition, size, and any flaws</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Use clear, well-lit photos from multiple angles</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Be transparent about brands and authenticity</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Update item availability promptly</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Communicate Clearly */}
          <div className="border-b border-tradey-black/10 pb-16">
            <div className="flex items-start gap-8">
              <div className="flex-shrink-0 w-12 h-12 bg-tradey-red text-white flex items-center justify-center font-fayte text-lg">
                3
              </div>
              <div className="flex-1">
                <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">Communicate Clearly</h2>
                <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">
                  Good communication prevents misunderstandings and helps swaps go smoothly.
                </p>
                <ul className="space-y-2">
                  <li className="font-sans text-tradey-black/60 text-xs">• Respond to messages within 24-48 hours</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Clearly state your location and swap preferences</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Discuss swap details before meeting or shipping</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Be upfront about any concerns or questions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Safety First */}
          <div className="border-b border-tradey-black/10 pb-16">
            <div className="flex items-start gap-8">
              <div className="flex-shrink-0 w-12 h-12 bg-tradey-red text-white flex items-center justify-center font-fayte text-lg">
                4
              </div>
              <div className="flex-1">
                <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">Safety First</h2>
                <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">
                  Your safety is our top priority. Follow these guidelines to stay safe while swapping.
                </p>
                <ul className="space-y-2">
                  <li className="font-sans text-tradey-black/60 text-xs">• Meet in public places for local swaps</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Tell a friend or family member about your swap plans</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Use tracked shipping for long-distance exchanges</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Trust your instincts - if something feels off, walk away</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sustainability Focus */}
          <div className="pb-16">
            <div className="flex items-start gap-8">
              <div className="flex-shrink-0 w-12 h-12 bg-tradey-red text-white flex items-center justify-center font-fayte text-lg">
                5
              </div>
              <div className="flex-1">
                <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">Sustainability Focus</h2>
                <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">
                  Remember, we're here to reduce fashion waste and promote sustainable consumption.
                </p>
                <ul className="space-y-2">
                  <li className="font-sans text-tradey-black/60 text-xs">• Only list items you're genuinely willing to part with</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Consider quality over quantity in your listings</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Give items a second life before considering disposal</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Share sustainable fashion tips with the community</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Reporting */}
        <div className="mt-20 pt-16 border-t border-tradey-black/10">
          <h2 className="font-fayte text-4xl text-tradey-black mb-12 uppercase">Reporting Violations</h2>
          <div className="bg-tradey-black/5 p-8 border-l-4 border-tradey-red">
            <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">
              If you encounter behavior that violates these guidelines, please report it to our team. We review all reports and take appropriate action to maintain community standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-tradey-red text-white px-6 py-3 font-sans text-sm font-medium hover:bg-red-700 transition-colors">
                Report a User
              </button>
              <button className="bg-tradey-red text-white px-6 py-3 font-sans text-sm font-medium hover:bg-red-700 transition-colors">
                Report an Item
              </button>
            </div>
          </div>
        </div>

        {/* Community Values */}
        <div className="mt-20">
          <div className="bg-tradey-red text-white p-8">
            <h3 className="font-fayte text-3xl mb-4 uppercase">Our Community Values</h3>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <h4 className="font-fayte text-lg mb-2 uppercase">Trust</h4>
                <p className="font-sans text-sm opacity-90">Building lasting relationships through honest exchanges</p>
              </div>
              <div className="text-center">
                <h4 className="font-fayte text-lg mb-2 uppercase">Sustainability</h4>
                <p className="font-sans text-sm opacity-90">Reducing waste one swap at a time</p>
              </div>
              <div className="text-center">
                <h4 className="font-fayte text-lg mb-2 uppercase">Creativity</h4>
                <p className="font-sans text-sm opacity-90">Expressing unique styles through fashion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};