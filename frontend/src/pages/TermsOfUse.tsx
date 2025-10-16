import React from 'react';

export const TermsOfUsePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-tradey-black text-tradey-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-tradey-red mb-6">
            Terms of Use
          </h1>
          <p className="text-lg text-gray-300">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-gray-300 mt-4">
            Please read these Terms of Use carefully before using TRADEY. By accessing or using our service, you agree to be bound by these terms.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-12">
          {/* Acceptance of Terms */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300">
              By creating an account or using TRADEY, you agree to these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use our service.
            </p>
          </div>

          {/* Description of Service */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p className="text-gray-300 mb-4">
              TRADEY is a platform that facilitates clothing swaps between users. We provide:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>A marketplace for listing and browsing clothing items</li>
              <li>Messaging system for coordinating swaps</li>
              <li>Community features for building trust and connections</li>
              <li>Tools for managing your profile and swap history</li>
            </ul>
            <p className="text-gray-300 mt-4">
              TRADEY does not handle payments, shipping logistics, or act as an intermediary in swap transactions.
            </p>
          </div>

          {/* User Accounts */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
            <div className="space-y-4 text-gray-300">
              <p>To use TRADEY, you must:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Be at least 13 years old</li>
                <li>Create an account with accurate information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
              <p>You are responsible for:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>All activities that occur under your account</li>
                <li>Maintaining accurate profile information</li>
                <li>Complying with these terms and community guidelines</li>
              </ul>
            </div>
          </div>

          {/* User Conduct */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">4. User Conduct</h2>
            <p className="text-gray-300 mb-4">
              You agree to use TRADEY responsibly and respect other users:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-600">✅ Allowed</h3>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>List genuine clothing items for swap</li>
                  <li>Communicate respectfully with other users</li>
                  <li>Accurately describe item condition</li>
                  <li>Use clear, appropriate photos</li>
                  <li>Complete swaps as agreed</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-red-600">❌ Not Allowed</h3>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>List counterfeit or stolen items</li>
                  <li>Use offensive or harassing language</li>
                  <li>Misrepresent item condition or authenticity</li>
                  <li>Spam other users with unwanted messages</li>
                  <li>Attempt to sell items instead of swapping</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Item Listings */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">5. Item Listings</h2>
            <p className="text-gray-300 mb-4">
              When listing items for swap, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Only list clothing, shoes, and accessories in swappable condition</li>
              <li>Provide accurate descriptions and clear photos</li>
              <li>Indicate item size, brand, and condition honestly</li>
              <li>Update item availability promptly</li>
              <li>Remove listings for items that are no longer available</li>
              <li>Not list prohibited items (see Community Guidelines)</li>
            </ul>
          </div>

          {/* Swaps and Transactions */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">6. Swaps and Transactions</h2>
            <p className="text-gray-300 mb-4">
              TRADEY facilitates connections but does not participate in swap transactions:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>You are responsible for arranging swap details with other users</li>
              <li>Complete swaps as agreed upon with your swap partner</li>
              <li>Use tracked shipping for long-distance swaps when possible</li>
              <li>Meet in public places for local swaps</li>
              <li>Resolve disputes directly with your swap partner first</li>
              <li>Report issues through our support system if needed</li>
            </ul>
          </div>

          {/* Intellectual Property */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">7. Intellectual Property</h2>
            <p className="text-gray-300 mb-4">
              The TRADEY platform and its original content are protected by intellectual property laws:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>You retain ownership of photos and descriptions you upload</li>
              <li>You grant TRADEY a license to display your content on our platform</li>
              <li>You may not copy or use TRADEY's trademarks without permission</li>
              <li>Respect other users' intellectual property rights</li>
              <li>Report suspected copyright infringement to our team</li>
            </ul>
          </div>

          {/* Privacy and Data */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">8. Privacy and Data</h2>
            <p className="text-gray-300">
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms of Use by reference.
            </p>
          </div>

          {/* Disclaimers and Limitations */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">9. Disclaimers and Limitations</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                TRADEY is provided "as is" without warranties of any kind. We do not guarantee:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Uninterrupted or error-free service</li>
                <li>Accuracy of item descriptions or user information</li>
                <li>Successful completion of swaps</li>
                <li>Quality or condition of swapped items</li>
              </ul>
              <p>
                To the maximum extent permitted by law, TRADEY's liability is limited to the amount you paid us (which is $0 since our service is free).
              </p>
            </div>
          </div>

          {/* Termination */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">10. Termination</h2>
            <p className="text-gray-300 mb-4">
              We may terminate or suspend your account at our discretion for violations of these terms:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>You can delete your account at any time</li>
              <li>We may terminate accounts that violate our policies</li>
              <li>Terminated accounts lose access to all TRADEY features</li>
              <li>Some data may be retained for legal and safety purposes</li>
            </ul>
          </div>

          {/* Changes to Terms */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
            <p className="text-gray-300">
              We may update these Terms of Use from time to time. We will notify users of material changes through the app or by email. Your continued use of TRADEY after changes take effect constitutes acceptance of the updated terms.
            </p>
          </div>

          {/* Governing Law */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">12. Governing Law</h2>
            <p className="text-gray-300">
              These Terms of Use are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved through binding arbitration in [Your City, State/Country].
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">13. Contact Information</h2>
            <p className="text-gray-300 mb-4">
              If you have questions about these Terms of Use, please contact us:
            </p>
            <div className="space-y-2 text-gray-400">
              <p>📧 Email: legal@tradey.com</p>
              <p>📮 Mail: TRADEY Legal Department</p>
              <p>123 Fashion Street</p>
              <p>Style District, NY 10001</p>
              <p>United States</p>
            </div>
          </div>
        </div>

        {/* Agreement */}
        <div className="mt-16 text-center">
          <div className="bg-tradey-red text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Agreement to Terms</h3>
            <p className="mb-6 opacity-90">
              By using TRADEY, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.
            </p>
            <p className="text-sm opacity-75">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
