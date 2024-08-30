import { NextResponse } from 'next/server'
import { createSetupSession } from '@/api/stripeService'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customer } = body

    if (!customer) {
      return NextResponse.json({ error: 'Customer information is required.' }, { status: 400 })
    }

    const origin = req.headers.get('origin') || ''
    const clientSecret = await createSetupSession(customer, origin)

    return NextResponse.json({ clientSecret }, { status: 200 })
  } catch (error) {
    console.error('Error creating SetupIntent:', error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
    }
  }
}
