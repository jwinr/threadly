import { NextRequest, NextResponse } from 'next/server'
import { fulfillCheckout } from '@/api/stripeService'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const session_id = url.searchParams.get('session_id')

    if (!session_id) {
      console.error('Missing session_id in request')
      return NextResponse.json({ success: false, error: 'Missing session_id' }, { status: 400 })
    }

    await fulfillCheckout(session_id)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fulfilling checkout:', error.message)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    } else {
      console.error('Unknown error fulfilling checkout:', error)
      return NextResponse.json({ success: false, error: 'Unknown error' }, { status: 500 })
    }
  }
}
