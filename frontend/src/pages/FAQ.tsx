import React, { useState } from 'react';

export const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([1])); // First item open by default

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const faqData = [
    {
      id: 1,
      question: "How does TRADEY work?",
      answer: "TRADEY is a platform for swapping clothes with other fashion enthusiasts. Create a profile, list items you want to swap, browse the marketplace for items you love, and connect with other users to arrange swaps. It's completely free - no money changes hands!"
    },
    {
      id: 2,
      question: "Is swapping really free?",
      answer: "Yes! TRADEY is built on the principle of free clothing swaps. Our platform facilitates connections between users who want to exchange clothes directly. No payment processing or fees involved."
    },
    {
      id: 3,
      question: "How do I know items are in good condition?",
      answer: "Sellers are required to accurately describe item condition, size, and any flaws. We also have a community rating system where you can see reviews from other users who've swapped with them. Start with local swaps to meet traders in person if you're concerned."
    },
    {
      id: 4,
      question: "What should I do if I receive an item not as described?",
      answer: "Contact the seller first to try to resolve the issue. If that doesn't work, use our report feature and our team will investigate. We take item misrepresentation seriously and will help facilitate a resolution."
    },
    {
      id: 5,
      question: "How do I ship items for long-distance swaps?",
      answer: "For long-distance swaps, discuss shipping arrangements with your swap partner. We recommend using tracked shipping services. Consider the environmental impact and try to combine multiple items when possible to reduce carbon footprint."
    },
    {
      id: 6,
      question: "Can I sell items instead of swapping?",
      answer: "Currently, TRADEY focuses exclusively on clothing swaps to promote sustainability and reduce fashion waste. We're committed to the swap model and don't plan to introduce selling features."
    },
    {
      id: 7,
      question: "What types of items can I list?",
      answer: "You can list clothing, shoes, and accessories in good, swappable condition. We focus on fashion items only. Please ensure items are clean and accurately described. No counterfeit items allowed."
    },
    {
      id: 8,
      question: "How do I take good photos for my listings?",
      answer: "Take photos in good lighting against a clean, neutral background. Include multiple angles and close-ups of any details or flaws. Natural light is best, and try to show the true color and fit of the item."
    },
    {
      id: 9,
      question: "Can I swap with people in other countries?",
      answer: "Absolutely! International swaps are welcome, but be mindful of shipping costs and customs regulations. Discuss these details with your swap partner beforehand. We recommend starting with local swaps to build confidence."
    },
    {
      id: 10,
      question: "What if someone doesn't respond to my swap request?",
      answer: "Users have up to 48 hours to respond to swap requests. If you don't hear back, feel free to send a friendly follow-up message. If they continue to be unresponsive, you can cancel the request and look for other items."
    },
    {
      id: 11,
      question: "How do I build trust in the community?",
      answer: "Complete your profile with a clear photo and bio, respond promptly to messages, accurately describe your items, and leave honest reviews after swaps. Building a good reputation takes time but leads to more successful swaps."
    },
    {
      id: 12,
      question: "Can I list multiple sizes of the same item?",
      answer: "Yes! If you have the same item in multiple sizes, you can create separate listings for each. This helps other users find exactly what they're looking for and increases your chances of successful swaps."
    },
    {
      id: 13,
      question: "What should I do if I change my mind about a swap?",
      answer: "Life happens! If you need to cancel a swap, communicate this to your swap partner as soon as possible. Be understanding if others need to cancel too - it's part of building a positive community."
    },
    {
      id: 14,
      question: "Are there any fees or hidden costs?",
      answer: "No fees whatsoever! TRADEY is completely free to use. The only costs you might incur are for shipping (if doing long-distance swaps) or transportation to meet someone locally."
    },
    {
      id: 15,
      question: "How do I report inappropriate behavior?",
      answer: "Use the report feature on user profiles or item listings. You can also contact our support team directly. We review all reports and take appropriate action to maintain a safe, respectful community."
    }
  ];

  return (
    <div className="min-h-screen bg-tradey-black text-tradey-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-tradey-red mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about using TRADEY for sustainable fashion swaps.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search FAQs..."
                className="w-full px-4 py-3 pl-12 border border-gray-600 rounded-lg focus:ring-2 focus:ring-tradey-red focus:border-transparent bg-gray-800 text-white"
              />
              <div className="absolute left-4 top-3.5 text-gray-400">
                🔍
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-16">
          {faqData.map((item) => (
            <div key={item.id} className="bg-gray-800 rounded-lg">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-lg font-semibold pr-4">{item.question}</h3>
                <span className={`text-2xl transition-transform ${openItems.has(item.id) ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {openItems.has(item.id) && (
                <div className="px-6 pb-4">
                  <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="bg-tradey-red text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="mb-6 opacity-90">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-tradey-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Contact Support
            </button>
            <button className="bg-tradey-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Browse Community Forum
            </button>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Quick Tips for Successful Swaps</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-tradey-red text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                📸
              </div>
              <h3 className="text-xl font-bold mb-3">Great Photos</h3>
              <p className="text-gray-600">
                Clear, well-lit photos from multiple angles help others see exactly what you're offering.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-tradey-red text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                💬
              </div>
              <h3 className="text-xl font-bold mb-3">Clear Communication</h3>
              <p className="text-gray-600">
                Be responsive and clear about item details, swap preferences, and meeting arrangements.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-tradey-red text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                ⭐
              </div>
              <h3 className="text-xl font-bold mb-3">Honest Reviews</h3>
              <p className="text-gray-600">
                Leave fair reviews after swaps to help build trust and improve the community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
