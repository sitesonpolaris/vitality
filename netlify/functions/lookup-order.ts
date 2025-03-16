import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const orderId = event.queryStringParameters?.orderId;

  if (!orderId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Order ID is required' }),
    };
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(orderId, {
      expand: ['customer', 'shipping'],
    });

    // Parse the order items from metadata
    const orderItems = JSON.parse(paymentIntent.metadata.order_items || '[]') as Array<{
      price_id: string;
      quantity: number;
      price: number;
    }>;
    
    const items = orderItems.map(item => ({
      quantity: item.quantity,
      amount: item.price * 100 * item.quantity, // Convert to cents
      description: `Order item (${item.price_id})`
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
        created: paymentIntent.created,
        items,
        shipping: paymentIntent.shipping,
      }),
    };
  } catch (error) {
    console.error('Error looking up order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to lookup order',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

export { handler };