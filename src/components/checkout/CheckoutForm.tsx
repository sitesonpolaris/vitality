import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { stripePromise, createPaymentIntent } from '../../lib/stripe';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface CheckoutFormContentProps {
  customerId: string;
  clientSecret: string;
  shippingAddress: {
    name: string;
    email: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

function CheckoutFormContent({ customerId, clientSecret, shippingAddress }: CheckoutFormContentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { state, dispatch } = useCart();
  const { user } = useAuth();


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        data: {
          payment_method_data: {
            billing_details: {
              name: shippingAddress.name,
              email: shippingAddress.email,
              address: {
                line1: shippingAddress.street,
                city: shippingAddress.city,
                state: shippingAddress.state,
                postal_code: shippingAddress.postalCode,
                country: shippingAddress.country,
              },
            },
          },
        },
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
      });

      if (submitError) {
        setError(submitError.message || 'An error occurred during payment.');
        return;
      }

    } catch (err) {
      setError('An unexpected error occurred.');
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md text-base font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
      >
        {processing ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Processing...
          </>
        ) : (
          `Pay $${state.cart.total.toFixed(2)}`
        )}
      </button>
    </form>
  );
}

interface CheckoutFormProps {
  customerId: string;
  shippingAddress: {
    name: string;
    email: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export default function CheckoutForm({ customerId, shippingAddress }: CheckoutFormProps) {
  const { state } = useCart();
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const initializePayment = async () => {
      try {
        const items = state.cart.items.map(item => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          priceId: item.priceId,
          quantity: item.quantity
        }));

        // Create headers with user and shipping info
        const headers = {
          'x-user-id': user?.id,
          'x-shipping-address': JSON.stringify(shippingAddress)
        };

        const secret = await createPaymentIntent({
          amount: Math.round(state.cart.total * 100), // Convert to cents
          items,
          customerId,
          headers
        });
        setClientSecret(secret);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to initialize payment');
        console.error('Failed to initialize payment:', error);
      }
    };

    if (state.cart.total > 0) {
      initializePayment();
    }
  }, [state.cart.total]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-amber-600" />
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#d97706',
          },
        },
      }}
    >
      <CheckoutFormContent 
        customerId={customerId}
        clientSecret={clientSecret}
        shippingAddress={shippingAddress}
      />
    </Elements>
  );
}