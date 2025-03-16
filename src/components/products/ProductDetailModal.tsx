import React, { useEffect, useState } from 'react';
import { X, Minus, Plus, Loader2, Truck, Package } from 'lucide-react';
import { Product } from '../../types/product';
import { supabase } from '../../lib/supabase';
import ProductImageGallery from './ProductImageGallery';

interface InventoryInfo {
  inventory_level: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductDetailModal({ product, isOpen, onClose, onAddToCart }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [inventoryInfo, setInventoryInfo] = useState<InventoryInfo | null>(null);
  const [loadingInventory, setLoadingInventory] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoadingInventory(true);
        const { data, error } = await supabase
          .rpc('get_inventory_status');

        if (error) throw error;
        
        const productInventory = data?.find((item: { product_id: string; }) => item.product_id === product.id);
        if (productInventory) {
          setInventoryInfo({
            inventory_level: productInventory.inventory_level,
            status: productInventory.status as 'in_stock' | 'low_stock' | 'out_of_stock'
          });
        }
      } catch (err) {
        console.error('Error fetching inventory:', err);
      } finally {
        setLoadingInventory(false);
      }
    };

    if (isOpen && product.id) {
      fetchInventory();
    }
  }, [isOpen, product.id]);

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => {
      const newValue = prev + delta;
      const maxQuantity = inventoryInfo?.inventory_level || 0;
      return Math.max(1, Math.min(newValue, maxQuantity));
    });
  };

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      onAddToCart(product, quantity);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError('Failed to add item to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />
      
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <ProductImageGallery images={product.images} productName={product.name} />

            {/* Product details */}
            <div className="flex flex-col items-start">
              <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
                {product.name}
              </h2>
              <p className="mt-2 text-2xl text-amber-600">${product.price}</p>
              
              <div className="mt-4 space-y-2">
                {/* Stock Status */}
                <div className="flex items-center text-sm">
                  {loadingInventory ? (
                    <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
                  ) : (
                    <>
                      <span className={`mr-2 h-3 w-3 rounded-full ${
                        inventoryInfo?.status === 'in_stock' ? 'bg-green-500' :
                        inventoryInfo?.status === 'low_stock' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      <span className={
                        inventoryInfo?.status === 'in_stock' ? 'text-green-700' :
                        inventoryInfo?.status === 'low_stock' ? 'text-yellow-700' :
                        'text-red-700'
                      }>
                        {inventoryInfo?.status === 'in_stock' ? 'In Stock' :
                         inventoryInfo?.status === 'low_stock' ? 'Low Stock' :
                         'Out of Stock'}
                        {inventoryInfo?.inventory_level !== undefined && 
                         ` (${inventoryInfo.inventory_level} available)`}
                      </span>
                    </>
                  )}
                </div>

                {/* Shipping Estimate */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4" />
                  <span>Free shipping on orders over $100</span>
                </div>

                {/* Dimensions */}
<div className="flex items-start space-x-2 text-sm text-gray-600">
  <Package className="h-4 w-4" />
  <span className="flex-1 text-left">  
    {Object.entries(product.dimensions)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ')}
  </span>
</div>

                <p className="text-gray-600 text-left">{product.description}</p>
                
                <div className="text-sm text-gray-500">
                  {Object.entries(product.dimensions)
                    .filter(([, value]) => value !== undefined)
                    .map(([key, value]) => (
                      <div key={key} className="capitalize">
                        {key}: {value}
                      </div>
                    ))}
                </div>

              </div>

              {/* Quantity selector */}
              <div className="mt-6">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <div className="mt-2 flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="rounded-full p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, 10)))}
                    className="w-16 text-center border-gray-300 rounded-md"
                    min="1"
                    max="10"
                  />
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (inventoryInfo?.inventory_level || 0)}
                    className="rounded-full p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Add to cart button */}
              <div className="mt-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!inventoryInfo?.inventory_level || loading}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md text-base font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : success ? (
                    'Added to Cart!'
                  ) : (
                    'Add to Cart'
                  )}
                </button>
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}