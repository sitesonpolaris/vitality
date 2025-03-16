import React from 'react';
import { X, Package, MapPin, Mail, Phone, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  name: string;
  email: string;
  phone?: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface Order {
  id: string;
  created_at: string;
  user_id: string;
  total_amount: number;
  status: string;
  fulfillment_status: 'unfulfilled' | 'fulfilled';
  items: OrderItem[];
  shipping_address: ShippingAddress;
}

interface OrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ order, isOpen, onClose }: OrderModalProps) {
  if (!isOpen || !order) return null;

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = order.total_amount - subtotal; // Assuming the difference is tax

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="order-modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="relative w-full max-w-4xl rounded-lg bg-white shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h2 id="order-modal-title" className="text-xl font-semibold text-gray-900">
                Order Details
              </h2>
              <p className="text-sm text-gray-500">Order #{order.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Information */}
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Order Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Date: {new Date(order.created_at).toLocaleString()}
                    </p>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Status:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status === 'paid' 
                          ? <CheckCircle2 className="h-4 w-4 mr-1" />
                          : <AlertCircle className="h-4 w-4 mr-1" />
                        }
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Fulfillment:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.fulfillment_status === 'fulfilled'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.fulfillment_status === 'fulfilled'
                          ? <Package className="h-4 w-4 mr-1" />
                          : <Loader2 className="h-4 w-4 mr-1" />
                        }
                        {order.fulfillment_status.charAt(0).toUpperCase() + order.fulfillment_status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">{order.shipping_address.name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {order.shipping_address.email}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Shipping Address</h3>
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 mt-1" />
                    <div>
                      {order.shipping_address.street}<br />
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}<br />
                      {order.shipping_address.country}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items and Summary */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4 mb-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500"> × {item.quantity}</span>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-medium text-gray-900 pt-2">
                    <span>Total</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}