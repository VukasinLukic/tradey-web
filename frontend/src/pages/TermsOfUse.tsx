import React from 'react';

export const TermsOfUsePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-tradey-white">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-fayte text-7xl md:text-9xl text-tradey-black mb-2 tracking-tight uppercase">
            TERMS
          </h1>
          <p className="font-sans text-tradey-black/60 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="font-sans text-tradey-black/60 text-sm mt-4 max-w-2xl">
            Please read these Terms of Use carefully before using TRADEY. By accessing or using our service, you agree to be bound by these terms.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-16">
          {/* Acceptance of Terms */}
          <div className="border-b border-tradey-black/10 pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">1. Acceptance of Terms</h2>
            <p className="font-sans text-tradey-black/70 text-sm leading-relaxed">
              By creating an account or using TRADEY, you agree to these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use our service.
            </p>
          </div>

          {/* Description of Service */}
          <div className="border-b border-tradey-black/10 pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">2. Description of Service</h2>
            <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">
              TRADEY is a platform that facilitates clothing swaps between users. We provide:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="font-sans text-tradey-black/60 text-xs">• A marketplace for listing and browsing clothing items</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Messaging system for coordinating swaps</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Community features for building trust and connections</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Tools for managing your profile and swap history</li>
            </ul>
            <p className="font-sans text-tradey-black/70 text-sm leading-relaxed">
              TRADEY does not handle payments, shipping logistics, or act as an intermediary in swap transactions.
            </p>
          </div>

          {/* User Accounts */}
          <div className="border-b border-tradey-black/10 pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">3. User Accounts</h2>
            <div className="space-y-6">
              <div>
                <p className="font-sans text-tradey-black/70 text-sm mb-4 leading-relaxed">To use TRADEY, you must:</p>
                <ul className="space-y-2">
                  <li className="font-sans text-tradey-black/60 text-xs">• Be at least 13 years old</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Create an account with accurate information</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Maintain the security of your account credentials</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Notify us immediately of any unauthorized access</li>
                </ul>
              </div>
              <div>
                <p className="font-sans text-tradey-black/70 text-sm mb-4 leading-relaxed">You are responsible for:</p>
                <ul className="space-y-2">
                  <li className="font-sans text-tradey-black/60 text-xs">• All activities that occur under your account</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Maintaining accurate profile information</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Complying with these terms and community guidelines</li>
                </ul>
              </div>
            </div>
          </div>

          {/* User Conduct */}
          <div className="border-b border-tradey-black/10 pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">4. User Conduct</h2>
            <p className="font-sans text-tradey-black/70 text-sm mb-8 leading-relaxed">
              You agree to use TRADEY responsibly and respect other users:
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-fayte text-lg text-tradey-black mb-4 uppercase">Allowed</h3>
                <ul className="space-y-2">
                  <li className="font-sans text-tradey-black/60 text-xs">• List genuine clothing items for swap</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Communicate respectfully with other users</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Accurately describe item condition</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Use clear, appropriate photos</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Complete swaps as agreed</li>
                </ul>
              </div>
              <div>
                <h3 className="font-fayte text-lg text-tradey-red mb-4 uppercase">Not Allowed</h3>
                <ul className="space-y-2">
                  <li className="font-sans text-tradey-black/60 text-xs">• List counterfeit or stolen items</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Use offensive or harassing language</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Misrepresent item condition or authenticity</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Spam other users with unwanted messages</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Attempt to sell items instead of swapping</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Item Listings */}
          <div className="border-b border-tradey-black/10 pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">5. Item Listings</h2>
            <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">
              When listing items for swap, you agree to:
            </p>
            <ul className="space-y-2">
              <li className="font-sans text-tradey-black/60 text-xs">• Only list clothing, shoes, and accessories in swappable condition</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Provide accurate descriptions and clear photos</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Indicate item size, brand, and condition honestly</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Update item availability promptly</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Remove listings for items that are no longer available</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Not list prohibited items (see Community Guidelines)</li>
            </ul>
          </div>

          {/* Swaps and Transactions */}
          <div className="border-b border-tradey-black/10 pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">6. Swaps and Transactions</h2>
            <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">
              TRADEY facilitates connections but does not participate in swap transactions:
            </p>
            <ul className="space-y-2">
              <li className="font-sans text-tradey-black/60 text-xs">• You are responsible for arranging swap details with other users</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Complete swaps as agreed upon with your swap partner</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Use tracked shipping for long-distance swaps when possible</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Meet in public places for local swaps</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Resolve disputes directly with your swap partner first</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Report issues through our support system if needed</li>
            </ul>
          </div>

          {/* Intellectual Property */}
          <div className="border-b border-tradey-black/10 pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">7. Intellectual Property</h2>
            <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">
              The TRADEY platform and its original content are protected by intellectual property laws:
            </p>
            <ul className="space-y-2">
              <li className="font-sans text-tradey-black/60 text-xs">• You retain ownership of photos and descriptions you upload</li>
              <li className="font-sans text-tradey-black/60 text-xs">• You grant TRADEY a license to display your content on our platform</li>
              <li className="font-sans text-tradey-black/60 text-xs">• You may not copy or use TRADEY's trademarks without permission</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Respect other users' intellectual property rights</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Report suspected copyright infringement to our team</li>
            </ul>
          </div>

          {/* Privacy and Data */}
          <div className="border-b border-tradey-black/10 pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">8. Privacy and Data</h2>
            <p className="font-sans text-tradey-black/70 text-sm leading-relaxed">
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms of Use by reference.
            </p>
          </div>

          {/* Disclaimers and Limitations */}
          <div className="border-b border-tradey-black/10 pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">9. Disclaimers and Limitations</h2>
            <div className="space-y-6">
              <div>
                <p className="font-sans text-tradey-black/70 text-sm mb-4 leading-relaxed">
                  TRADEY is provided "as is" without warranties of any kind. We do not guarantee:
                </p>
                <ul className="space-y-2">
                  <li className="font-sans text-tradey-black/60 text-xs">• Uninterrupted or error-free service</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Accuracy of item descriptions or user information</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Successful completion of swaps</li>
                  <li className="font-sans text-tradey-black/60 text-xs">• Quality or condition of swapped items</li>
                </ul>
              </div>
              <p className="font-sans text-tradey-black/70 text-sm leading-relaxed">
                To the maximum extent permitted by law, TRADEY's liability is limited to the amount you paid us (which is $0 since our service is free).
              </p>
            </div>
          </div>

          {/* Termination */}
          <div className="border-b border-tradey-black/10 pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">10. Termination</h2>
            <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">
              We may terminate or suspend your account at our discretion for violations of these terms:
            </p>
            <ul className="space-y-2">
              <li className="font-sans text-tradey-black/60 text-xs">• You can delete your account at any time</li>
              <li className="font-sans text-tradey-black/60 text-xs">• We may terminate accounts that violate our policies</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Terminated accounts lose access to all TRADEY features</li>
              <li className="font-sans text-tradey-black/60 text-xs">• Some data may be retained for legal and safety purposes</li>
            </ul>
          </div>

          {/* Changes to Terms */}
          <div className="border-b border-tradey-black/10 pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">11. Changes to Terms</h2>
            <p className="font-sans text-tradey-black/70 text-sm leading-relaxed">
              We may update these Terms of Use from time to time. We will notify users of material changes through the app or by email. Your continued use of TRADEY after changes take effect constitutes acceptance of the updated terms.
            </p>
          </div>

          {/* Governing Law */}
          <div className="border-b border-tradey-black/10 pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">12. Governing Law</h2>
            <p className="font-sans text-tradey-black/70 text-sm leading-relaxed">
              These Terms of Use are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved through binding arbitration in [Your City, State/Country].
            </p>
          </div>

          {/* Contact Information */}
          <div className="pb-16">
            <h2 className="font-fayte text-2xl text-tradey-black mb-4 uppercase">13. Contact Information</h2>
            <p className="font-sans text-tradey-black/70 text-sm mb-6 leading-relaxed">
              If you have questions about these Terms of Use, please contact us:
            </p>
            <div className="space-y-2">
              <p className="font-sans text-tradey-black/60 text-xs">Email: legal@tradey.com</p>
              <p className="font-sans text-tradey-black/60 text-xs">Mail: TRADEY Legal Department</p>
              <p className="font-sans text-tradey-black/60 text-xs">123 Fashion Street</p>
              <p className="font-sans text-tradey-black/60 text-xs">Style District, NY 10001</p>
              <p className="font-sans text-tradey-black/60 text-xs">United States</p>
            </div>
          </div>
        </div>

        {/* Agreement */}
        <div className="mt-20 pt-16 border-t border-tradey-black/10">
          <div className="bg-tradey-red text-white p-8">
            <h3 className="font-fayte text-3xl mb-4 uppercase">Agreement to Terms</h3>
            <p className="font-sans text-sm mb-6 opacity-90">
              By using TRADEY, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.
            </p>
            <p className="font-sans text-xs opacity-75">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};