import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { CustomerInfo } from '../../src/types/customer';
import { supabase } from '../../src/lib/supabase';

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

async function findExistingCustomer(email: string): Promise<string | null> {
  try {
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    return customers.data.length > 0 ? customers.data[0].id : null;
  } catch (error) {
    console.error('Error finding customer:', error);
    return null;
  }
}

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const customerInfo: CustomerInfo = JSON.parse(event.body || '{}');

    // Check for existing customer
    let customerId = await findExistingCustomer(customerInfo.email);
    let customer;

    if (customerId) {
      // Update existing customer
      customer = await stripe.customers.update(customerId, {
        name: customerInfo.fullName,
        phone: customerInfo.phone,
        address: {
          line1: customerInfo.address.street,
          city: customerInfo.address.city,
          state: customerInfo.address.state,
          postal_code: customerInfo.address.postalCode,
          country: customerInfo.address.country,
        },
      });
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        name: customerInfo.fullName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: {
          line1: customerInfo.address.street,
          city: customerInfo.address.city,
          state: customerInfo.address.state,
          postal_code: customerInfo.address.postalCode,
          country: customerInfo.address.country,
        },
        metadata: {
          createdAt: new Date().toISOString(),
        },
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        customerId: customer.id,
        isExisting: !!customerId 
      }),
    };
  } catch (error) {
    console.error('Error creating customer:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to create customer',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
}

export { handler };