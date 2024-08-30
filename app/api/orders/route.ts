import { NextRequest, NextResponse } from 'next/server'
import { findUserByCognitoSub, fetchUserOrders } from '@/api/orderService'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cognitoSub = searchParams.get('cognitoSub')
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const offset = parseInt(searchParams.get('offset') || '0', 10)

  if (!cognitoSub) {
    return NextResponse.json({ error: 'Missing cognitoSub' }, { status: 400 })
  }

  try {
    const userId = await findUserByCognitoSub(cognitoSub)
    const orders = await fetchUserOrders(userId, limit, offset)

    return NextResponse.json(orders, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Error fetching orders', details: error.message },
      { status: 500 },
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: {
      Allow: 'GET',
    },
  })
}
