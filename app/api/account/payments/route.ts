import {NextResponse} from 'next/server'
import {getPaymentMethodsForCustomer} from '@/api/stripeService'

export async function GET(req: Request) {
  try {
    const {searchParams} = new URL(req.url)
    const stripe_customer_id = searchParams.get('stripe_customer_id')

    if (!stripe_customer_id || typeof stripe_customer_id !== 'string') {
      return NextResponse.json({error: 'Stripe customer ID not found'}, {status: 400})
    }

    const paymentMethods = await getPaymentMethodsForCustomer(stripe_customer_id)
    return NextResponse.json({paymentMethods}, {status: 200})
  } catch (error) {
    console.error('Error fetching payment methods:', error)

    if (error instanceof Error) {
      return NextResponse.json({error: error.message}, {status: 500})
    } else {
      return NextResponse.json({error: 'Internal server error'}, {status: 500})
    }
  }
}
