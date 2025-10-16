import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-tradey-black text-tradey-blue">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-7">
            <h3 className="font-fayte text-6xl md:text-8xl mb-6 text-tradey-blue">
              TRADEY
            </h3>
            <p className="font-garamond text-xl md:text-2xl text-tradey-white mb-6 max-w-2xl">
              Don't throw it, tradey it. Your old jacket is someone's new style.
            </p>
            <p className="font-garamond text-lg text-tradey-white opacity-80">
              Platform for second-hand clothing exchange. Sustainable, creative, together.
            </p>
          </div>

          {/* Links Section */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-fayte text-2xl mb-6 text-tradey-blue">
              LINKS
            </h4>
            <ul className="space-y-4 font-garamond text-lg">
              <li>
                <a href="#featured" className="text-tradey-white opacity-80 hover:opacity-100 transition-opacity">
                  Products
                </a>
              </li>
              <li>
                <a href="#" className="text-tradey-white opacity-80 hover:opacity-100 transition-opacity">
                  How it works
                </a>
              </li>
              <li>
                <a href="#" className="text-tradey-white opacity-80 hover:opacity-100 transition-opacity">
                  Community guidelines
                </a>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="col-span-1 md:col-span-3">
            <h4 className="font-fayte text-2xl mb-6 text-tradey-blue">
              SUPPORT
            </h4>
            <ul className="space-y-4 font-garamond text-lg">
              <li>
                <a href="#" className="text-tradey-white opacity-80 hover:opacity-100 transition-opacity">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-tradey-white opacity-80 hover:opacity-100 transition-opacity">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-tradey-white opacity-80 hover:opacity-100 transition-opacity">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-tradey-white opacity-80 hover:opacity-100 transition-opacity">
                  Terms of use
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-tradey-blue/30 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <p className="font-garamond text-sm text-tradey-white opacity-80">
              © 2024 TRADEY. ALL RIGHTS RESERVED.
            </p>
            <p className="font-garamond text-tradey-white text-sm opacity-80">
              Made with ❤️ for sustainable fashion
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
