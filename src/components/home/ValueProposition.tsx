import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart, Users, Palette, ArrowRight } from 'lucide-react';

export default function ValueProposition() {
  return (
    <section className="bg-amber-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Your Purchase Supports</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Legacy */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-4">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Preserving a Legacy
            </h3>
            <p className="text-gray-600">
              Honoring generations of Gullah Geechee craftsmanship through handmade sweetgrass baskets.
            </p>
          </div>

          {/* Sustainable */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-4">
              <Leaf className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sustainable Traditions
            </h3>
            <p className="text-gray-600">
              Crafted with responsibly harvested sweetgrass, pine needle, and bullrush—naturally sourced and eco-friendly.
            </p>
          </div>

          {/* Artisans */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Empowering Artisans
            </h3>
            <p className="text-gray-600">
              Every basket is handmade by Lucille, ensuring fair, meaningful work rooted in cultural heritage.
            </p>
          </div>

          {/* Art */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-4">
              <Palette className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Celebrating Timeless Art
            </h3>
            <p className="text-gray-600">
              Keeping the art of sweetgrass weaving alive, one meticulously crafted piece at a time.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            to="/about"
            className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium"
          >
            Discover the Story Behind Every Basket
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}