import React from 'react';
import { useCart } from '../context/CartContext';
import { Navigate } from 'react-router-dom';
import CheckoutForm from '../components/checkout/CheckoutForm';
import CustomerForm from '../components/checkout/CustomerForm';
import { CustomerInfo } from '../types/customer';
import { createCustomer } from '../lib/stripe';

export default function Checkout() {
  const { state } = useCart();
  const [customerId, setCustomerId] = React.useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = React.useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleCustomerSubmit = async (customerInfo: CustomerInfo) => {
    setIsLoading(true);
    setError(null);
    try {
      setCustomerInfo(customerInfo);
      const { customerId } = await createCustomer(customerInfo);
      setCustomerId(customerId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create customer');
      console.error('Customer creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (state.cart.items.length === 0) {
    return <Navigate to="/collections" replace />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Secure Checkout</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
        <div className="space-y-4">
          {state.cart.items.map((item) => (
            <div key={item.productId} className="flex justify-between">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-gray-500"> × {item.quantity}</span>
              </div>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${state.cart.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>Shipping</span>
              <span>{state.cart.shipping === 0 ? 'Free' : `$${state.cart.shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>Tax</span>
              <span>${state.cart.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-lg mt-4">
              <span>Total</span>
              <span>${state.cart.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!customerId ? (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
          <CustomerForm onSubmit={handleCustomerSubmit} isLoading={isLoading} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
          {customerInfo && (
            <CheckoutForm 
              customerId={customerId} 
              shippingAddress={{
                name: customerInfo.fullName,
                email: customerInfo.email,
                street: customerInfo.address.street,
                city: customerInfo.address.city,
                state: customerInfo.address.state,
                postalCode: customerInfo.address.postalCode,
                country: customerInfo.address.country
              }} 
            />
          )}
        </div>
      )}
    </div>
  );
}