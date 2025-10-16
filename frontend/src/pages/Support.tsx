import React from 'react';

export const SupportPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-tradey-black text-tradey-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-tradey-red mb-6">
            Support Center
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            We're here to help you make the most of your TRADEY experience. Find answers, get assistance, or share feedback.
          </p>
        </div>

        {/* Support Options */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Help Center */}
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <div className="w-16 h-16 bg-tradey-red text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              📚
            </div>
            <h3 className="text-xl font-bold mb-3">Help Center</h3>
            <p className="text-gray-400 mb-4">Browse our comprehensive guides and tutorials</p>
            <button className="bg-tradey-red text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Browse Guides
            </button>
          </div>

          {/* Contact Us */}
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <div className="w-16 h-16 bg-tradey-red text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              💬
            </div>
            <h3 className="text-xl font-bold mb-3">Contact Us</h3>
            <p className="text-gray-400 mb-4">Get in touch with our support team</p>
            <button className="bg-tradey-red text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Send Message
            </button>
          </div>

          {/* Community Forum */}
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <div className="w-16 h-16 bg-tradey-red text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              👥
            </div>
            <h3 className="text-xl font-bold mb-3">Community Forum</h3>
            <p className="text-gray-400 mb-4">Ask questions and share tips with other users</p>
            <button className="bg-tradey-red text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Join Discussion
            </button>
          </div>
        </div>

        {/* Quick Help */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Quick Help</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Getting Started */}
            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Getting Started</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-tradey-red text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Create your profile</h4>
                    <p className="text-gray-400 text-sm">Add a photo and bio to showcase your style</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-tradey-red text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">List your first item</h4>
                    <p className="text-gray-400 text-sm">Take clear photos and describe condition accurately</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-tradey-red text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Start browsing and swapping</h4>
                    <p className="text-gray-400 text-sm">Find items you love and connect with other traders</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Common Issues */}
            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Common Issues</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Can't find items to swap?</h4>
                  <p className="text-gray-400 text-sm">Try adjusting your filters or browse different categories</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Swap request not responded to?</h4>
                  <p className="text-gray-400 text-sm">Users have 48 hours to respond. Feel free to send a friendly follow-up</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Item not as described?</h4>
                  <p className="text-gray-400 text-sm">Use the report feature and we'll help resolve the issue</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-tradey-red focus:border-transparent bg-gray-800 text-white"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-tradey-red focus:border-transparent bg-gray-800 text-white"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
                <select className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-tradey-red focus:border-transparent bg-gray-800 text-white">
                <option>General Question</option>
                <option>Technical Issue</option>
                <option>Report User/Item</option>
                <option>Feature Request</option>
                <option>Account Help</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                rows={6}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-tradey-red focus:border-transparent bg-gray-800 text-white"
                placeholder="Describe your issue or question in detail..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-tradey-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Response Time */}
        <div className="mt-12 text-center">
          <div className="bg-tradey-red text-white p-6 rounded-lg inline-block">
            <h3 className="text-xl font-bold mb-2">Response Time</h3>
            <p className="opacity-90">We typically respond within 24-48 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};
