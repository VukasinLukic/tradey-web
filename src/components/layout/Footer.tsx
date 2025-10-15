import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-tradey-blue">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-7">
            <h3 className="font-anton text-6xl md:text-8xl mb-6 text-tradey-blue">
              TRADEY
            </h3>
            <p className="font-garamond text-xl md:text-2xl text-tradey-blue mb-6 max-w-2xl">
              Menjaj, ne bacaj. Tvoja stara jakna je nečiji novi stil.
            </p>
            <p className="font-garamond text-lg text-tradey-blue opacity-80">
              Platforma za razmenu polovne odeće. Održivo, kreativno, zajednički.
            </p>
          </div>

          {/* Links Section */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-anton text-2xl mb-6 text-tradey-blue">
              LINKOVI
            </h4>
            <ul className="space-y-4 font-garamond text-lg">
              <li>
                <a href="#featured" className="text-tradey-blue opacity-80 hover:opacity-100 transition-opacity">
                  Proizvodi
                </a>
              </li>
              <li>
                <a href="#" className="text-tradey-blue opacity-80 hover:opacity-100 transition-opacity">
                  Kako funkcioniše
                </a>
              </li>
              <li>
                <a href="#" className="text-tradey-blue opacity-80 hover:opacity-100 transition-opacity">
                  Pravila zajednice
                </a>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="col-span-1 md:col-span-3">
            <h4 className="font-anton text-2xl mb-6 text-tradey-blue">
              PODRŠKA
            </h4>
            <ul className="space-y-4 font-garamond text-lg">
              <li>
                <a href="#" className="text-tradey-blue opacity-80 hover:opacity-100 transition-opacity">
                  Kontakt
                </a>
              </li>
              <li>
                <a href="#" className="text-tradey-blue opacity-80 hover:opacity-100 transition-opacity">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-tradey-blue opacity-80 hover:opacity-100 transition-opacity">
                  Privatnost
                </a>
              </li>
              <li>
                <a href="#" className="text-tradey-blue opacity-80 hover:opacity-100 transition-opacity">
                  Uslovi korišćenja
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <p className="font-anton text-sm text-tradey-blue opacity-80">
              © 2024 TRADEY. SVA PRAVA ZADRŽANA.
            </p>
            <p className="font-garamond text-tradey-blue text-sm opacity-80">
              Napravljeno sa ❤️ za održivu modu
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
