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
    <div className="min-h-screen bg-tradey-white">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-fayte text-7xl md:text-9xl text-tradey-black mb-2 tracking-tight uppercase">
            FAQ
          </h1>
          <p className="font-sans text-tradey-black/60 text-sm max-w-2xl">
            Find answers to common questions about using TRADEY for sustainable fashion swaps.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-16">
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full px-4 py-3 border border-tradey-black/20 focus:outline-none focus:border-tradey-red bg-white text-tradey-black font-sans text-sm"
            />
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-20">
          {faqData.map((item) => (
            <div key={item.id} className="border-b border-tradey-black/10">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full py-6 text-left flex items-center justify-between hover:bg-tradey-black/5 transition-colors"
              >
                <h3 className="font-fayte text-lg text-tradey-black uppercase pr-4">{item.question}</h3>
                <span className={`text-2xl text-tradey-red transition-transform ${openItems.has(item.id) ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {openItems.has(item.id) && (
                <div className="pb-6">
                  <p className="font-sans text-tradey-black/70 text-sm leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="bg-tradey-red text-white p-8 mb-20">
          <h2 className="font-fayte text-3xl mb-4 uppercase">Still Need Help?</h2>
          <p className="font-sans text-sm mb-6 opacity-90">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-white text-tradey-red px-6 py-3 font-sans text-sm font-medium hover:bg-gray-100 transition-colors">
              Contact Support
            </button>
            <button className="bg-white text-tradey-red px-6 py-3 font-sans text-sm font-medium hover:bg-gray-100 transition-colors">
              Browse Community Forum
            </button>
          </div>
        </div>

        {/* Quick Tips */}
        <div>
          <h2 className="font-fayte text-4xl text-tradey-black mb-12 uppercase text-center">Quick Tips for Successful Swaps</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="font-fayte text-xl text-tradey-black mb-3 uppercase">Great Photos</h3>
              <p className="font-sans text-tradey-black/60 text-sm">
                Clear, well-lit photos from multiple angles help others see exactly what you're offering.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-fayte text-xl text-tradey-black mb-3 uppercase">Clear Communication</h3>
              <p className="font-sans text-tradey-black/60 text-sm">
                Be responsive and clear about item details, swap preferences, and meeting arrangements.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-fayte text-xl text-tradey-black mb-3 uppercase">Honest Reviews</h3>
              <p className="font-sans text-tradey-black/60 text-sm">
                Leave fair reviews after swaps to help build trust and improve the community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};