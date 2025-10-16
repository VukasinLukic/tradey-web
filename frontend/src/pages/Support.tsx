import React from 'react';

export const SupportPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-tradey-white">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-fayte text-7xl md:text-9xl text-tradey-black mb-2 tracking-tight uppercase">
            SUPPORT
          </h1>
          <p className="font-sans text-tradey-black/60 text-sm max-w-2xl">
            We're here to help you make the most of your TRADEY experience. Find answers, get assistance, or share feedback.
          </p>
        </div>

        {/* Support Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* Help Center */}
          <div className="bg-tradey-black/5 p-8 border-l-4 border-tradey-red">
            <h3 className="font-fayte text-xl text-tradey-black mb-3 uppercase">Help Center</h3>
            <p className="font-sans text-tradey-black/60 text-sm mb-6">Browse our comprehensive guides and tutorials</p>
            <button className="bg-tradey-red text-white px-6 py-3 font-sans text-sm font-medium hover:bg-red-700 transition-colors">
              Browse Guides
            </button>
          </div>

          {/* Contact Us */}
          <div className="bg-tradey-black/5 p-8 border-l-4 border-tradey-red">
            <h3 className="font-fayte text-xl text-tradey-black mb-3 uppercase">Contact Us</h3>
            <p className="font-sans text-tradey-black/60 text-sm mb-6">Get in touch with our support team</p>
            <button className="bg-tradey-red text-white px-6 py-3 font-sans text-sm font-medium hover:bg-red-700 transition-colors">
              Send Message
            </button>
          </div>

          {/* Community Forum */}
          <div className="bg-tradey-black/5 p-8 border-l-4 border-tradey-red">
            <h3 className="font-fayte text-xl text-tradey-black mb-3 uppercase">Community Forum</h3>
            <p className="font-sans text-tradey-black/60 text-sm mb-6">Ask questions and share tips with other users</p>
            <button className="bg-tradey-red text-white px-6 py-3 font-sans text-sm font-medium hover:bg-red-700 transition-colors">
              Join Discussion
            </button>
          </div>
        </div>

        {/* Quick Help */}
        <div className="mb-20">
          <h2 className="font-fayte text-4xl text-tradey-black mb-12 uppercase">Quick Help</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Getting Started */}
            <div className="border-b border-tradey-black/10 pb-12">
              <h3 className="font-fayte text-2xl text-tradey-black mb-8 uppercase">Getting Started</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-tradey-red text-white flex items-center justify-center font-fayte text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-fayte text-sm text-tradey-black uppercase mb-1">Create your profile</h4>
                    <p className="font-sans text-tradey-black/60 text-xs">Add a photo and bio to showcase your style</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-tradey-red text-white flex items-center justify-center font-fayte text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-fayte text-sm text-tradey-black uppercase mb-1">List your first item</h4>
                    <p className="font-sans text-tradey-black/60 text-xs">Take clear photos and describe condition accurately</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-tradey-red text-white flex items-center justify-center font-fayte text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-fayte text-sm text-tradey-black uppercase mb-1">Start browsing and swapping</h4>
                    <p className="font-sans text-tradey-black/60 text-xs">Find items you love and connect with other traders</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Common Issues */}
            <div className="border-b border-tradey-black/10 pb-12">
              <h3 className="font-fayte text-2xl text-tradey-black mb-8 uppercase">Common Issues</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-fayte text-sm text-tradey-black uppercase mb-2">Can't find items to swap?</h4>
                  <p className="font-sans text-tradey-black/60 text-xs">Try adjusting your filters or browse different categories</p>
                </div>
                <div>
                  <h4 className="font-fayte text-sm text-tradey-black uppercase mb-2">Swap request not responded to?</h4>
                  <p className="font-sans text-tradey-black/60 text-xs">Users have 48 hours to respond. Feel free to send a friendly follow-up</p>
                </div>
                <div>
                  <h4 className="font-fayte text-sm text-tradey-black uppercase mb-2">Item not as described?</h4>
                  <p className="font-sans text-tradey-black/60 text-xs">Use the report feature and we'll help resolve the issue</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-tradey-black/5 p-8 border-l-4 border-tradey-red mb-20">
          <h2 className="font-fayte text-4xl text-tradey-black mb-8 uppercase">Send us a Message</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-xs text-tradey-black/60 mb-2 uppercase tracking-wide">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-tradey-black/20 focus:outline-none focus:border-tradey-red bg-white text-tradey-black font-sans text-sm"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block font-sans text-xs text-tradey-black/60 mb-2 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-tradey-black/20 focus:outline-none focus:border-tradey-red bg-white text-tradey-black font-sans text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block font-sans text-xs text-tradey-black/60 mb-2 uppercase tracking-wide">Subject</label>
              <select className="w-full px-4 py-3 border border-tradey-black/20 focus:outline-none focus:border-tradey-red bg-white text-tradey-black font-sans text-sm">
                <option>General Question</option>
                <option>Technical Issue</option>
                <option>Report User/Item</option>
                <option>Feature Request</option>
                <option>Account Help</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block font-sans text-xs text-tradey-black/60 mb-2 uppercase tracking-wide">Message</label>
              <textarea
                rows={6}
                className="w-full px-4 py-3 border border-tradey-black/20 focus:outline-none focus:border-tradey-red bg-white text-tradey-black font-sans text-sm resize-none"
                placeholder="Describe your issue or question in detail..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-tradey-red text-white px-8 py-3 font-sans text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Response Time */}
        <div className="text-center">
          <div className="bg-tradey-red text-white p-8 inline-block">
            <h3 className="font-fayte text-2xl mb-2 uppercase">Response Time</h3>
            <p className="font-sans text-sm opacity-90">We typically respond within 24-48 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};