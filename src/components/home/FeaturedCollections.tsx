import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Plus } from 'lucide-react';
import { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import ProductDetailModal from '../products/ProductDetailModal';

interface FeaturedCollectionsProps {
  products: Product[];
}

export default function FeaturedCollections({ products }: FeaturedCollectionsProps) {
  const { dispatch } = useCart();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity: 1 } });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="font-montserrat font-bold text-4xl text-primary mb-4 pb-10">
        {products[0]?.category === 'dried' ? 'Our Natural Dried Sea Moss' : 'Our Natural Sea Moss Gel'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="group relative">
            <div
              className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity" />
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover object-center group-hover:opacity-75"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-sm text-white line-clamp-2">{product.description}</p>
              </div>
            </div>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {Object.entries(product.dimensions)
                    .filter(([, value]) => value !== undefined)
                    .map(([key, value]) => `${key}: ${value}`).join(', ')}
                </p>
              </div>
              <button
                onClick={(e) => handleQuickAdd(e, product)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-600 text-white hover:bg-amber-700 transition-colors z-10"
                aria-label={`Add ${product.name} to cart`}
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
      <div className="mt-12 text-center">
        <Link
          to="/collections"
          className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          View All Products
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}