import { loadStripe } from '@stripe/stripe-js';
import { CustomerInfo } from '../types/customer';

if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('Missing Stripe publishable key');
}

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export async function createCustomer(customerInfo: CustomerInfo) {
  const response = await fetch('/.netlify/functions/create-customer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customerInfo),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create customer');
  }

  return response.json();
}

interface CreatePaymentIntentParams {
  amount: number;
  items: Array<{ id: string; priceId: string; quantity: number }>;
  customerId?: string;
}

export async function createPaymentIntent(params: CreatePaymentIntentParams) {
  const response = await fetch('/.netlify/functions/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create payment intent');
  }

  const data = await response.json();
  return data.clientSecret;
}

export async function lookupOrder(orderId: string) {
  const response = await fetch(`/.netlify/functions/lookup-order?orderId=${orderId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to lookup order');
  }

  return response.json();
}