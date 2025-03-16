import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
      headers: {
        Allow: 'POST',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  }

  try {
    const { amount, items, customerId } = JSON.parse(event.body || '{}');

    // Validate the amount
    if (!amount || typeof amount !== 'number' || amount < 1) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid amount' }),
      };
    }

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid items' }),
      };
    }

    // Create a PaymentIntent
    const lineItems = await Promise.all(items.map(async (item) => ({
      price_id: item.priceId,
      quantity: item.quantity,
      amount: item.price * 100 * item.quantity // Convert to cents
    })));

    const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      customer: customerId,
      metadata: {
        user_id: event.headers['x-user-id'],
        order_items: JSON.stringify(items.map(item => ({
          price_id: item.priceId,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        }))),
        shipping_address: event.headers['x-shipping-address'],
        createdAt: new Date().toISOString(),
        status: 'pending'
      },
      automatic_payment_methods: {
        enabled: true
      },
    });

    // Return the client secret
    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  }
};

export { handler };