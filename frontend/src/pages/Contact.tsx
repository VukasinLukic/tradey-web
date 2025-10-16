import React from 'react';

export const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-tradey-white">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-fayte text-7xl md:text-9xl text-tradey-black mb-2 tracking-tight uppercase">
            CONTACT
          </h1>
          <p className="font-sans text-tradey-black/60 text-sm max-w-2xl">
            Have questions, feedback, or want to partner with us? We'd love to hear from you.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* Email */}
          <div className="bg-tradey-black/5 p-8 border-l-4 border-tradey-red">
            <h3 className="font-fayte text-xl text-tradey-black mb-3 uppercase">Email Us</h3>
            <p className="font-sans text-tradey-black/60 text-sm mb-4">For general inquiries and support</p>
            <a href="mailto:hello@tradey.com" className="font-sans text-tradey-red text-sm font-medium hover:underline">
              hello@tradey.com
            </a>
          </div>

          {/* Business Inquiries */}
          <div className="bg-tradey-black/5 p-8 border-l-4 border-tradey-red">
            <h3 className="font-fayte text-xl text-tradey-black mb-3 uppercase">Business Partnerships</h3>
            <p className="font-sans text-tradey-black/60 text-sm mb-4">For brands and collaboration opportunities</p>
            <a href="mailto:partnerships@tradey.com" className="font-sans text-tradey-red text-sm font-medium hover:underline">
              partnerships@tradey.com
            </a>
          </div>

          {/* Press */}
          <div className="bg-tradey-black/5 p-8 border-l-4 border-tradey-red">
            <h3 className="font-fayte text-xl text-tradey-black mb-3 uppercase">Press & Media</h3>
            <p className="font-sans text-tradey-black/60 text-sm mb-4">For media inquiries and press releases</p>
            <a href="mailto:press@tradey.com" className="font-sans text-tradey-red text-sm font-medium hover:underline">
              press@tradey.com
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-tradey-black/5 p-8 border-l-4 border-tradey-red mb-20">
          <h2 className="font-fayte text-4xl text-tradey-black mb-8 uppercase">Send us a Message</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-xs text-tradey-black/60 mb-2 uppercase tracking-wide">Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-tradey-black/20 focus:outline-none focus:border-tradey-red bg-white text-tradey-black font-sans text-sm"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block font-sans text-xs text-tradey-black/60 mb-2 uppercase tracking-wide">Email *</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-tradey-black/20 focus:outline-none focus:border-tradey-red bg-white text-tradey-black font-sans text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-xs text-tradey-black/60 mb-2 uppercase tracking-wide">Company</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-tradey-black/20 focus:outline-none focus:border-tradey-red bg-white text-tradey-black font-sans text-sm"
                  placeholder="Your company (optional)"
                />
              </div>
              <div>
                <label className="block font-sans text-xs text-tradey-black/60 mb-2 uppercase tracking-wide">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-tradey-black/20 focus:outline-none focus:border-tradey-red bg-white text-tradey-black font-sans text-sm"
                  placeholder="Your phone number (optional)"
                />
              </div>
            </div>
            <div>
              <label className="block font-sans text-xs text-tradey-black/60 mb-2 uppercase tracking-wide">Subject *</label>
              <select className="w-full px-4 py-3 border border-tradey-black/20 focus:outline-none focus:border-tradey-red bg-white text-tradey-black font-sans text-sm" required>
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
              <label className="block font-sans text-xs text-tradey-black/60 mb-2 uppercase tracking-wide">Message *</label>
              <textarea
                rows={8}
                required
                className="w-full px-4 py-3 border border-tradey-black/20 focus:outline-none focus:border-tradey-red bg-white text-tradey-black font-sans text-sm resize-none"
                placeholder="Tell us more about your inquiry..."
              ></textarea>
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="newsletter" className="mt-1" />
              <label htmlFor="newsletter" className="font-sans text-xs text-tradey-black/60">
                I'd like to receive updates about TRADEY and sustainable fashion tips
              </label>
            </div>
            <button
              type="submit"
              className="bg-tradey-red text-white px-8 py-3 font-sans text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Office Info */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="border-b border-tradey-black/10 pb-12">
            <h3 className="font-fayte text-2xl text-tradey-black mb-6 uppercase">Visit Us</h3>
            <div className="space-y-2">
              <p className="font-sans text-tradey-black/60 text-sm">TRADEY Headquarters</p>
              <p className="font-sans text-tradey-black/60 text-sm">123 Fashion Street</p>
              <p className="font-sans text-tradey-black/60 text-sm">Style District, NY 10001</p>
              <p className="font-sans text-tradey-black/60 text-sm">United States</p>
            </div>
            <div className="mt-6">
              <p className="font-sans text-xs text-tradey-black/40">Office Hours: Mon-Fri 9AM-6PM EST</p>
            </div>
          </div>

          <div className="border-b border-tradey-black/10 pb-12">
            <h3 className="font-fayte text-2xl text-tradey-black mb-6 uppercase">Follow Us</h3>
            <div className="flex gap-4 mb-6">
              <a href="#" className="w-10 h-10 bg-tradey-red text-white flex items-center justify-center hover:bg-red-700 transition-colors">
                <span className="font-sans text-xs">FB</span>
              </a>
              <a href="#" className="w-10 h-10 bg-tradey-red text-white flex items-center justify-center hover:bg-red-700 transition-colors">
                <span className="font-sans text-xs">TW</span>
              </a>
              <a href="#" className="w-10 h-10 bg-tradey-red text-white flex items-center justify-center hover:bg-red-700 transition-colors">
                <span className="font-sans text-xs">IG</span>
              </a>
              <a href="#" className="w-10 h-10 bg-tradey-red text-white flex items-center justify-center hover:bg-red-700 transition-colors">
                <span className="font-sans text-xs">PT</span>
              </a>
            </div>
            <p className="font-sans text-tradey-black/60 text-sm">
              Follow us for the latest in sustainable fashion and community stories.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="font-fayte text-4xl text-tradey-black mb-12 uppercase text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-tradey-black/5 p-6 border-l-4 border-tradey-red">
              <h3 className="font-fayte text-lg text-tradey-black mb-3 uppercase">How quickly do you respond?</h3>
              <p className="font-sans text-tradey-black/60 text-sm">We aim to respond to all inquiries within 24-48 hours during business days.</p>
            </div>
            <div className="bg-tradey-black/5 p-6 border-l-4 border-tradey-red">
              <h3 className="font-fayte text-lg text-tradey-black mb-3 uppercase">Do you offer phone support?</h3>
              <p className="font-sans text-tradey-black/60 text-sm">Currently, we provide support through email and our help center for the best assistance.</p>
            </div>
            <div className="bg-tradey-black/5 p-6 border-l-4 border-tradey-red">
              <h3 className="font-fayte text-lg text-tradey-black mb-3 uppercase">Can I suggest new features?</h3>
              <p className="font-sans text-tradey-black/60 text-sm">Absolutely! We love hearing from our community. Use the feature request option in the contact form.</p>
            </div>
            <div className="bg-tradey-black/5 p-6 border-l-4 border-tradey-red">
              <h3 className="font-fayte text-lg text-tradey-black mb-3 uppercase">How can I report an issue?</h3>
              <p className="font-sans text-tradey-black/60 text-sm">Use the "Bug Report" option in the contact form, or report issues directly in the app.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};