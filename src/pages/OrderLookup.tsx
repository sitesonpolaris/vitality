import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { lookupOrder } from '../lib/stripe';

interface OrderDetails {
  id: string;
  amount: number;
  status: string;
  created: number;
  items: Array<{
    description: string;
    quantity: number;
    amount: number;
  }>;
  shipping: {
    name: string;
    address: {
      line1: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
}

export default function OrderLookup() {
  const [orderId, setOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsLoading(true);
    setError(null);
    setOrderDetails(null);

    try {
      const details = await lookupOrder(orderId);
      setOrderDetails(details);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to lookup order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Lookup</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
              Order ID
            </label>
            <input
              type="text"
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your order ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !orderId.trim()}
            className="self-end px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Look Up
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-8">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {orderDetails && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-500">Order ID: {orderDetails.id}</p>
            <p className="text-sm text-gray-500">
              Date: {new Date(orderDetails.created * 1000).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">Status: {orderDetails.status}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Items</h3>
            <div className="space-y-4">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <span className="font-medium">{item.description}</span>
                    <span className="text-gray-500"> × {item.quantity}</span>
                  </div>
                  <span>${(item.amount / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${(orderDetails.amount / 100).toFixed(2)}</span>
            </div>
          </div>

          {orderDetails.shipping && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
              <p className="text-gray-600">
                {orderDetails.shipping.name}<br />
                {orderDetails.shipping.address.line1}<br />
                {orderDetails.shipping.address.city}, {orderDetails.shipping.address.state} {orderDetails.shipping.address.postal_code}<br />
                {orderDetails.shipping.address.country}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}