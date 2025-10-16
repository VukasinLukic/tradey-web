import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-tradey-black text-tradey-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-tradey-red mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-300">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-gray-300 mt-4">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-12">
          {/* Information We Collect */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                <p className="text-gray-300 mb-3">When you create an account, we collect:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>Email address</li>
                  <li>Username and display name</li>
                  <li>Profile picture (optional)</li>
                  <li>Bio and location (optional)</li>
                  <li>Profile preferences and settings</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Usage Information</h3>
                <p className="text-gray-300 mb-3">We automatically collect information about how you use TRADEY:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>Items you've viewed, liked, or saved</li>
                  <li>Swap requests and messages sent</li>
                  <li>Time spent on the platform</li>
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Item Listings</h3>
                <p className="text-gray-300 mb-3">When you list items for swap:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>Photos and descriptions you provide</li>
                  <li>Item details (size, condition, brand)</li>
                  <li>Swap preferences and availability</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
            <div className="space-y-4 text-gray-300">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Provide our services:</strong> Connect you with other users for clothing swaps</li>
                <li><strong>Improve the platform:</strong> Analyze usage patterns to enhance features</li>
                <li><strong>Communicate with you:</strong> Send swap notifications and important updates</li>
                <li><strong>Ensure safety:</strong> Prevent fraud and maintain community standards</li>
                <li><strong>Personalize experience:</strong> Show relevant items and recommendations</li>
                <li><strong>Provide support:</strong> Respond to your questions and concerns</li>
              </ul>
            </div>
          </div>

          {/* Information Sharing */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Information Sharing</h2>
            <div className="space-y-4 text-gray-300">
              <p>We do not sell your personal information. We may share information in these limited circumstances:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>With other users:</strong> Profile information and item listings are visible to other TRADEY users</li>
                <li><strong>Service providers:</strong> We use trusted third-party services for hosting, analytics, and communications</li>
                <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business transfers:</strong> In case of acquisition or merger</li>
              </ul>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Data Security</h2>
            <p className="text-gray-300 mb-4">
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication requirements</li>
              <li>Secure hosting with industry-standard protections</li>
              <li>Regular backups and disaster recovery procedures</li>
            </ul>
          </div>

          {/* Your Rights */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Your Privacy Rights</h2>
            <p className="text-gray-300 mb-4">You have control over your data:</p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
              <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
              <li><strong>Restriction:</strong> Limit how we use your information</li>
              <li><strong>Objection:</strong> Object to certain data processing activities</li>
            </ul>
            <p className="text-gray-300 mt-4">
              To exercise these rights, contact us at <a href="mailto:privacy@tradey.com" className="text-tradey-red hover:underline">privacy@tradey.com</a>
            </p>
          </div>

          {/* Cookies and Tracking */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Cookies and Tracking</h2>
            <p className="text-gray-300 mb-4">
              We use cookies and similar technologies to improve your experience:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li><strong>Essential cookies:</strong> Required for basic platform functionality</li>
              <li><strong>Analytics cookies:</strong> Help us understand how you use TRADEY</li>
              <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing cookies:</strong> Used to show relevant content (with your consent)</li>
            </ul>
            <p className="text-gray-300 mt-4">
              You can manage cookie preferences in your browser settings or through our cookie banner.
            </p>
          </div>

          {/* Data Retention */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
            <p className="text-gray-300 mb-4">
              We retain your information for as long as necessary to provide our services:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Account data is kept while your account is active</li>
              <li>Item listings remain visible until you delete them</li>
              <li>Messages are retained for the duration of your account</li>
              <li>Analytics data is aggregated and anonymized after 2 years</li>
              <li>Legal and security logs are kept for 7 years as required</li>
            </ul>
          </div>

          {/* International Users */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">International Data Transfers</h2>
            <p className="text-gray-300">
              TRADEY operates globally, so your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during international transfers, including standard contractual clauses and adequacy decisions where applicable.
            </p>
          </div>

          {/* Children's Privacy */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
            <p className="text-gray-300">
              TRADEY is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will promptly delete it.
            </p>
          </div>

          {/* Changes to Policy */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
            <p className="text-gray-300 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Posting the updated policy on our website</li>
              <li>Sending you an email notification</li>
              <li>Displaying a notice in the app</li>
            </ul>
            <p className="text-gray-300 mt-4">
              Your continued use of TRADEY after changes become effective constitutes acceptance of the updated policy.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-16 text-center">
          <div className="bg-tradey-red text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h3>
            <p className="mb-6 opacity-90">
              Our privacy team is here to help with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:privacy@tradey.com" className="bg-white text-tradey-red px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Email Privacy Team
              </a>
              <a href="/contact" className="bg-white text-tradey-red px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
