import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ShoppingCart, Search, X, User, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { state, dispatch } = useCart();
  const { user } = useAuth();
  const isAdmin = user?.app_metadata?.role === 'admin';
  const itemCount = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            {/* <img
              src="https://static.wixstatic.com/media/c73eb8_f1111a297cd94b96bd2d0be6c9d2d39f~mv2.png"
              alt="Lucille's Sweetgrass Baskets"
              className="h-12 w-auto"
            /> */}
            <h2 className="font-bold text-primary md:text-xl text-sm hover:text-amber-600 transition-colors pl-2 md:pl-6">VITALITY = LONGEVITY</h2>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
            <Link to="/collections" className="text-gray-700 hover:text-gray-900">Collections</Link>
            <Link to="/preparation" className="text-gray-700 hover:text-gray-900">Preparation</Link>
            <Link to="/education" className="text-gray-700 hover:text-gray-900">Education</Link>

            <Link to="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              <Search className="h-6 w-6" />
            </button>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_CART' })}
              className="text-gray-700 hover:text-gray-900 relative"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <Link
              to={user ? '/dashboard' : '/auth'}
              className="text-gray-700 hover:text-gray-900"
            >
              <User className="h-6 w-6" />
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-gray-900"
                title="Admin Dashboard"
              >
                <LayoutDashboard className="h-6 w-6" />
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Home
              </Link>
              <Link
                to="/collections"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Collections
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Contact
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white p-4 shadow-md">
            <div className="max-w-3xl mx-auto">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}