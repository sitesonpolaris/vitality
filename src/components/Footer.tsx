import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
  };

  return (
    <footer className="bg-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="block">
              <img
                src="https://static.wixstatic.com/media/c73eb8_f1111a297cd94b96bd2d0be6c9d2d39f~mv2.png"
                alt="Longevity = Vitality logo"
                className="h-28 w-auto"
              />
            </Link>
            <p className="text-gray-600">
              Authentic Irish Moss aka Sea Moss sourced from the beautiful Caribbean Ocean.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-amber-600">Home</Link>
              </li>
              <li>
                <Link to="/collections" className="text-gray-600 hover:text-amber-600">Collections</Link>
              </li>
              <li>
                <Link to="/preparation" className="text-gray-600 hover:text-amber-600">Preparation</Link>
              </li>
                 <li>
                <Link to="/education" className="text-gray-600 hover:text-amber-600">Education</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-amber-600">Contact</Link>
              </li>
              <li>
                <Link to="/order-lookup" className="text-gray-600 hover:text-amber-600">Order Lookup</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-amber-600 flex-shrink-0 mt-1" />
                <span className="text-gray-600">
                  2130 Allen Jay Drive<br />
                  Charlotte, NC 28216
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <span className="text-gray-600">(919) 730-8782</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <span className="text-gray-600">kayobless@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay Updated</h3>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              <a
                href="https://www.instagram.com/zazu_malazu_lifestyle_brooklyn/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-amber-600"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Vitality = Longevity Seamoss. All rights reserved.{' '}
              Website designed by{' '}
              <a 
                href="https://www.sitesonpolaris.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-600 hover:text-amber-700"
              >
                Sites on Polaris
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;