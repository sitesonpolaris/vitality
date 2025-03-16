import React, { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, dispatch } = useCart();
  const [status, setStatus] = React.useState<'success' | 'processing' | 'error'>('processing');
  const [message, setMessage] = React.useState('');
  const [orderId, setOrderId] = React.useState<string | null>(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!user) return; // Ensure user is available before proceeding

      try {
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
        if (!stripe) throw new Error('Failed to load Stripe');

        const clientSecret = new URLSearchParams(window.location.search).get(
          'payment_intent_client_secret'
        );

        if (!clientSecret) {
          navigate('/');
          return;
        }

        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        if (!paymentIntent) throw new Error('No payment intent found');

        switch (paymentIntent.status) {
          case 'succeeded':
            try {
              // ✅ Use state.cart.items to get order items safely
              const orderItems = state?.cart?.items?.map(item => ({
                id: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
              })) || [];

              // ✅ Database will now automatically handle shipping info
              const { error: orderError } = await supabase.rpc('record_stripe_order', {
                p_payment_intent_id: paymentIntent.id,
                p_user_id: user.id,
                p_total_amount: paymentIntent.amount / 100, // Convert from cents
                p_items: orderItems,
              });

              if (orderError) throw orderError;

              setStatus('success');
              setOrderId(paymentIntent.id);
              setMessage('Payment successful! Thank you for your purchase.');
              dispatch({ type: 'CLEAR_CART' });
            } catch (err) {
              console.error('Failed to record order:', err);
              setStatus('error');
              setMessage('Payment successful but failed to record order. Please contact support.');
            }
            break;

          case 'processing':
            setStatus('processing');
            setMessage('Your payment is processing.');
            break;

          case 'requires_payment_method':
            setStatus('error');
            setMessage('Your payment was not successful, please try again.');
            break;

          default:
            setStatus('error');
            setMessage('Something went wrong.');
            break;
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setMessage('Failed to verify payment status. Please contact support.');
      }
    };

    checkPaymentStatus();
  }, [navigate, user, state]); // Ensure dependencies are correctly tracked

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      {status === 'processing' ? (
        <div className="flex flex-col items-center">
          <Loader2 className="h-16 w-16 text-amber-600 animate-spin mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Payment</h1>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
        </div>
      ) : status === 'success' ? (
        <div className="flex flex-col items-center">
          <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">{message}</p>
          {orderId && (
            <p className="text-sm text-gray-500 mb-8">Order ID: {orderId}</p>
          )}
          <button
            onClick={() => navigate('/collections')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 text-red-600 mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-8">{message}</p>
          <button
            onClick={() => navigate('/checkout')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
