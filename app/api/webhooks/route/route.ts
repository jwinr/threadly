import { NextRequest, NextResponse } from 'next/server'
import { fulfillCheckout, handleStripeEvent, clearCart } from '@/api/stripeService'
import Stripe from 'stripe'

// We have to disable body parsing here because Stripe requires the raw body for signature verification.
// If Next.js parses it before reaching stripeService, the verification would fail.
export const api = {
  bodyParser: false,
}

export async function POST(req: NextRequest) {
  console.log('Received webhook request') // Log when the request is received

  try {
    const event = await handleStripeEvent(req)

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        try {
          await fulfillCheckout(session.id)
          console.log('Checkout Session was successful!', session.id)

          // Clear the cart after successful fulfillment
          if (session.customer) {
            await clearCart(session.customer.toString())
          }
        } catch (err) {
          console.error('Error fulfilling checkout:', err)
        }
        break
      case 'payment_intent.created':
        const paymentIntentCreated = event.data.object as Stripe.PaymentIntent
        console.log('Payment Intent Created:', paymentIntentCreated.id)
        break
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent
        console.log('Payment Intent Succeeded:', paymentIntentSucceeded.id)
        break
      case 'charge.succeeded':
        const chargeSucceeded = event.data.object as Stripe.Charge
        console.log('Charge Succeeded:', chargeSucceeded.id)
        break
      case 'price.created':
        const priceCreated = event.data.object as Stripe.Price
        console.log('Price Created:', priceCreated.id)
        break
      case 'product.created':
        const productCreated = event.data.object as Stripe.Product
        console.log('Product Created:', productCreated.id)
        break
      case 'charge.updated':
        const chargeUpdated = event.data.object as Stripe.Charge
        console.log('Product Created:', chargeUpdated.id)
        break
      case 'checkout.session.expired':
        const expiredSession = event.data.object as Stripe.Checkout.Session
        console.log('Checkout Session Expired:', expiredSession.id)
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ message: 'Received' }, { status: 200 })
  } catch (err) {
    if (err instanceof Error) {
      console.error('Webhook Error:', err.message)
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    } else {
      console.error('Unknown error occurred:', err)
      return NextResponse.json(
        { error: 'Webhook Error: An unknown error occurred.' },
        { status: 400 },
      )
    }
  }
}

export async function OPTIONS() {
  return NextResponse.json({ message: 'Options' }, { status: 200 })
}
