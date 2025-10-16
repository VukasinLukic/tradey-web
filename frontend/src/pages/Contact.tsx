import React from 'react';

export const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-tradey-black text-tradey-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-tradey-red mb-6">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Have questions, feedback, or want to partner with us? We'd love to hear from you.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Email */}
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <div className="w-16 h-16 bg-tradey-red text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              ✉️
            </div>
            <h3 className="text-xl font-bold mb-3">Email Us</h3>
            <p className="text-gray-400 mb-4">For general inquiries and support</p>
            <a href="mailto:hello@tradey.com" className="text-tradey-red font-semibold hover:underline">
              hello@tradey.com
            </a>
          </div>

          {/* Business Inquiries */}
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <div className="w-16 h-16 bg-tradey-red text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              🤝
            </div>
            <h3 className="text-xl font-bold mb-3">Business Partnerships</h3>
            <p className="text-gray-400 mb-4">For brands and collaboration opportunities</p>
            <a href="mailto:partnerships@tradey.com" className="text-tradey-red font-semibold hover:underline">
              partnerships@tradey.com
            </a>
          </div>

          {/* Press */}
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <div className="w-16 h-16 bg-tradey-red text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              📰
            </div>
            <h3 className="text-xl font-bold mb-3">Press & Media</h3>
            <p className="text-gray-400 mb-4">For media inquiries and press releases</p>
            <a href="mailto:press@tradey.com" className="text-tradey-red font-semibold hover:underline">
              press@tradey.com
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 p-8 rounded-lg mb-16">
          <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-tradey-red focus:border-transparent bg-gray-800 text-white"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-tradey-red focus:border-transparent bg-gray-800 text-white"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-tradey-red focus:border-transparent bg-gray-800 text-white"
                  placeholder="Your company (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-tradey-red focus:border-transparent bg-gray-800 text-white"
                  placeholder="Your phone number (optional)"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subject *</label>
                <select className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-tradey-red focus:border-transparent bg-gray-800 text-white" required>
                <option value="">Select a topic</option>
                <option>General Question</option>
                <option>Technical Support</option>
                <option>Business Partnership</option>
                <option>Press Inquiry</option>
                <option>Feature Request</option>
                <option>Bug Report</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message *</label>
              <textarea
                rows={8}
                required
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-tradey-red focus:border-transparent bg-gray-800 text-white"
                placeholder="Tell us more about your inquiry..."
              ></textarea>
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="newsletter" className="mt-1" />
              <label htmlFor="newsletter" className="text-sm text-gray-600">
                I'd like to receive updates about TRADEY and sustainable fashion tips
              </label>
            </div>
            <button
              type="submit"
              className="bg-tradey-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Office Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-800 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Visit Us</h3>
            <div className="space-y-2 text-gray-600">
              <p>📍 TRADEY Headquarters</p>
              <p>123 Fashion Street</p>
              <p>Style District, NY 10001</p>
              <p>United States</p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Office Hours: Mon-Fri 9AM-6PM EST</p>
            </div>
          </div>

          <div className="bg-gray-800 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-tradey-red text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                📘
              </a>
              <a href="#" className="w-10 h-10 bg-tradey-red text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                🐦
              </a>
              <a href="#" className="w-10 h-10 bg-tradey-red text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                📷
              </a>
              <a href="#" className="w-10 h-10 bg-tradey-red text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                📌
              </a>
            </div>
            <p className="mt-4 text-gray-600">
              Follow us for the latest in sustainable fashion and community stories.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">How quickly do you respond?</h3>
              <p className="text-gray-600">We aim to respond to all inquiries within 24-48 hours during business days.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Do you offer phone support?</h3>
              <p className="text-gray-600">Currently, we provide support through email and our help center for the best assistance.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Can I suggest new features?</h3>
              <p className="text-gray-600">Absolutely! We love hearing from our community. Use the feature request option in the contact form.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">How can I report an issue?</h3>
              <p className="text-gray-600">Use the "Bug Report" option in the contact form, or report issues directly in the app.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
