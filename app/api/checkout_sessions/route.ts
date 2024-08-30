import { createCheckoutSession, retrieveCheckoutSession } from '@/api/stripeService'
import { NextResponse } from 'next/server'

export async function POST(req: NextResponse) {
  try {
    const { cart, customer } = await req.json()

    if (!cart || !customer) {
      console.error('Missing cart or customer data in request:', { cart, customer })
      return NextResponse.json(
        { success: false, error: 'Missing cart or customer data' },
        { status: 400 },
      )
    }

    const sessionData = await createCheckoutSession(cart, customer)

    return NextResponse.json(sessionData)
  } catch (error) {
    console.error('Error processing POST request:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace available',
    })
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}

export async function GET(req: NextResponse) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      console.error('Missing session_id in request:', req.url)
      return NextResponse.json({ success: false, error: 'Missing session_id' }, { status: 400 })
    }

    const sessionData = await retrieveCheckoutSession(sessionId)

    return NextResponse.json(sessionData)
  } catch (error) {
    console.error('Error processing GET request:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace available',
    })
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
