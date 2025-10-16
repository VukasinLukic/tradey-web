import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-tradey-white">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-fayte text-7xl md:text-9xl text-tradey-black mb-2 tracking-tight uppercase">
            PRIVACY
          </h1>
          <p className="font-sans text-tradey-black/60 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="font-sans text-tradey-black/60 text-sm mt-4 max-w-2xl">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-16">
          {/* Information We Collect */}
          <div className="border-b border-tradey-black/10 pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-8 uppercase">Information We Collect</h2>
            <div className="space-y-8">
              <div>
                <h3 className="font-fayte text-lg text-tradey-black mb-4 uppercase">Personal Information</h3>
                <p className="font-sans text-tradey-black/70 text-sm mb-4 leading-relaxed">When you create an account, we collect:</p>
                <ul className="space-y-2">
                  <li className="font-sans text-tradey-black/60 text-xs">• Email address</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Username and display name</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Profile picture (optional)</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Bio and location (optional)</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Profile preferences and settings</li>
                </ul>
              </div>
              <div>
                <h3 className="font-fayte text-lg text-tradey-black mb-4 uppercase">Usage Information</h3>
                <p className="font-sans text-tradey-black/70 text-sm mb-4 leading-relaxed">We automatically collect information about how you use TRADEY:</p>
                <ul className="space-y-2">
                  <li className="font-sans text-tradey-black/60 text-xs">• Items you've viewed, liked, or saved</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Swap requests and messages sent</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Time spent on the platform</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Device and browser information</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• IP address and location data</li>
                </ul>
              </div>
              <div>
                <h3 className="font-fayte text-lg text-tradey-black mb-4 uppercase">Item Listings</h3>
                <p className="font-sans text-tradey-black/70 text-sm mb-4 leading-relaxed">When you list items for swap:</p>
                <ul className="space-y-2">
                  <li className="font-sans text-tradey-black/60 text-xs">• Photos and descriptions you provide</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Item details (size, condition, brand)</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Swap preferences and availability</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="border-b border-tradey-black/10 pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-8 uppercase">How We Use Your Information</h2>
            <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">We use the information we collect to:</p>
            <ul className="space-y-3">
              <li className="font-sans text-tradey-black/60 text-xs"><strong className="text-tradey-black">Provide our services:</strong> Connect you with other users for clothing swaps</li>
              <li className="font-sans text-tradey-black/60 text-xs"><strong className="text-tradey-black">Improve the platform:</strong> Analyze usage patterns to enhance features</li>
              <li className="font-sans text-tradey-black/60 text-xs"><strong className="text-tradey-black">Communicate with you:</strong> Send swap notifications and important updates</li>
              <li className="font-sans text-tradey-black/60 text-xs"><strong className="text-tradey-black">Ensure safety:</strong> Prevent fraud and maintain community standards</li>
              <li className="font-sans text-tradey-black/60 text-xs"><strong className="text-tradey-black">Personalize experience:</strong> Show relevant items and recommendations</li>
              <li className="font-sans text-tradey-black/60 text-xs"><strong className="text-tradey-black">Provide support:</strong> Respond to your questions and concerns</li>
            </ul>
          </div>

          {/* Information Sharing */}
          <div className="border-b border-tradey-black/10 pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-8 uppercase">Information Sharing</h2>
            <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">We do not sell your personal information. We may share information in these limited circumstances:</p>
            <ul className="space-y-3">
              <li className="font-sans text-tradey-black/60 text-xs"><strong className="text-tradey-black">With other users:</strong> Profile information and item listings are visible to other TRADEY users</li>
              <li className="font-sans text-tradey-black/60 text-xs"><strong className="text-tradey-black">Service providers:</strong> We use trusted third-party services for hosting, analytics, and communications</li>
              <li className="font-sans text-tradey-black/60 text-xs"><strong className="text-tradey-black">Legal requirements:</strong> When required by law or to protect our rights</li>
              <li className="font-sans text-tradey-black/60 text-xs"><strong className="text-tradey-black">Business transfers:</strong> In case of acquisition or merger</li>
            </ul>
          </div>

          {/* Data Security */}
          <div className="border-b border-tradey-black/10 pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-8 uppercase">Data Security</h2>
            <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul className="space-y-2">
              <li className="font-sans text-tradey-black/60 text-xs">• Encryption of data in transit and at rest</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Regular security audits and updates</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Access controls and authentication requirements</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Secure hosting with industry-standard protections</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Regular backups and disaster recovery procedures</li>
            </ul>
          </div>

          {/* Your Rights */}
          <div className="border-b border-tradey-black/10 pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-8 uppercase">Your Privacy Rights</h2>
            <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">You have control over your data:</p>
            <ul className="space-y-3">
              <li className="font-sans text-tradey-black/60 text-xs"><strong className="text-tradey-black">Access:</strong> Request a copy of your personal data</li>
              <li className="font-sans text-tradey-black/60 text-xs"><strong className="text-tradey-black">Correction:</strong> Update or correct inaccurate information</li>
              <li className="font-sans text-tradey-black/60 text-xs"><strong className="text-tradey-black">Deletion:</strong> Request deletion of your account and associated data</li>
              <li className="font-sans text-tradey-black/60 text-xs"><strong className="text-tradey-black">Portability:</strong> Export your data in a machine-readable format</li>
              <li className="font-sans text-tradey-black/60 text-xs"><strong className="text-tradey-black">Restriction:</strong> Limit how we use your information</li>
              <li className="font-sans text-tradey-black/60 text-xs"><strong className="text-tradey-black">Objection:</strong> Object to certain data processing activities</li>
            </ul>
            <p className="font-sans text-tradey-black/70 text-sm mt-6 leading-relaxed">
              To exercise these rights, contact us at <a href="mailto:privacy@tradey.com" className="text-tradey-red hover:underline">privacy@tradey.com</a>
            </p>
          </div>

          {/* Cookies and Tracking */}
          <div className="border-b border-tradey-black/10 pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-8 uppercase">Cookies and Tracking</h2>
            <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">
              We use cookies and similar technologies to improve your experience:
            </p>
            <ul className="space-y-3">
              <li className="font-sans text-tradey-black/60 text-xs"><strong className="text-tradey-black">Essential cookies:</strong> Required for basic platform functionality</li>
              <li className="font-sans text-tradey-black/60 text-xs"><strong className="text-tradey-black">Analytics cookies:</strong> Help us understand how you use TRADEY</li>
              <li className="font-sans text-tradey-black/60 text-xs"><strong className="text-tradey-black">Preference cookies:</strong> Remember your settings and preferences</li>
              <li className="font-sans text-tradey-black/60 text-xs"><strong className="text-tradey-black">Marketing cookies:</strong> Used to show relevant content (with your consent)</li>
            </ul>
            <p className="font-sans text-tradey-black/70 text-sm mt-6 leading-relaxed">
              You can manage cookie preferences in your browser settings or through our cookie banner.
            </p>
          </div>

          {/* Data Retention */}
          <div className="border-b border-tradey-black/10 pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-8 uppercase">Data Retention</h2>
            <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">
              We retain your information for as long as necessary to provide our services:
            </p>
            <ul className="space-y-2">
              <li className="font-sans text-tradey-black/60 text-xs">• Account data is kept while your account is active</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Item listings remain visible until you delete them</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Messages are retained for the duration of your account</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Analytics data is aggregated and anonymized after 2 years</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Legal and security logs are kept for 7 years as required</li>
            </ul>
          </div>

          {/* International Users */}
          <div className="border-b border-tradey-black/10 pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-8 uppercase">International Data Transfers</h2>
            <p className="font-sans text-tradey-black/70 text-sm leading-relaxed">
              TRADEY operates globally, so your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during international transfers, including standard contractual clauses and adequacy decisions where applicable.
            </p>
          </div>

          {/* Children's Privacy */}
          <div className="border-b border-tradey-black/10 pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-8 uppercase">Children's Privacy</h2>
            <p className="font-sans text-tradey-black/70 text-sm leading-relaxed">
              TRADEY is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will promptly delete it.
            </p>
          </div>

          {/* Changes to Policy */}
          <div className="pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-8 uppercase">Changes to This Policy</h2>
            <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by:
            </p>
            <ul className="space-y-2">
              <li className="font-sans text-tradey-black/60 text-xs">• Posting the updated policy on our website</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Sending you an email notification</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Displaying a notice in the app</li>
            </ul>
            <p className="font-sans text-tradey-black/70 text-sm mt-6 leading-relaxed">
              Your continued use of TRADEY after changes become effective constitutes acceptance of the updated policy.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-20 pt-16 border-t border-tradey-black/10">
          <div className="bg-tradey-red text-white p-8">
            <h3 className="font-fayte text-3xl mb-4 uppercase">Questions About Your Privacy?</h3>
            <p className="font-sans text-sm mb-6 opacity-90">
              Our privacy team is here to help with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="mailto:privacy@tradey.com" className="bg-white text-tradey-red px-6 py-3 font-sans text-sm font-medium hover:bg-gray-100 transition-colors text-center">
                Email Privacy Team
              </a>
              <a href="/contact" className="bg-white text-tradey-red px-6 py-3 font-sans text-sm font-medium hover:bg-gray-100 transition-colors text-center">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};