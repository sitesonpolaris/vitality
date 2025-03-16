import React from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { state, dispatch } = useCart();
  const { cart, isOpen } = state;

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 10) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity: newQuantity } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => dispatch({ type: 'TOGGLE_CART' })} />
      
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-6 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {cart.items.length === 0 ? (
              <div className="flex-1 px-4 py-6 sm:px-6">
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <ShoppingBag className="h-16 w-16 text-gray-400" />
                  <p className="text-gray-500">Your cart is empty</p>
                  <Link
                    to="/collections"
                    className="text-amber-600 hover:text-amber-700"
                    onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="space-y-8">
                    {cart.items.map((item) => (
                      <div key={item.productId} className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                          <p className="mt-1 text-sm text-gray-500">${item.price}</p>
                          <div className="mt-2 flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="rounded-full p-1 text-gray-400 hover:text-gray-500"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="text-gray-600">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="rounded-full p-1 text-gray-400 hover:text-gray-500"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <p>Subtotal</p>
                      <p>${cart.subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <p>Shipping</p>
                      <p>{cart.shipping === 0 ? 'Free' : `$${cart.shipping.toFixed(2)}`}</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <p>Tax</p>
                      <p>${cart.tax.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Total</p>
                      <p>${cart.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      to="/checkout"
                      onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                      className="w-full rounded-md border border-transparent bg-amber-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}