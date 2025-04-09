'use client';

interface StripeCustomerResponse {
  stripe_customer_id?: string;
  error?: string;
}

export async function fetchStripeCustomerId(
  headers?: HeadersInit
): Promise<string | null> {
  try {
    const response = await fetch('/api/stripe-id', {
      method: 'GET',
      headers,
    });

    const data = (await response.json()) as StripeCustomerResponse;

    if (!response.ok || !data.stripe_customer_id) {
      console.error('Failed to fetch Stripe customer ID:', data.error);
      return null;
    }

    return data.stripe_customer_id;
  } catch (error) {
    console.error('Error fetching Stripe customer ID:', error);
    return null;
  }
}
