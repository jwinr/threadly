import {
  findCustomerIdByUserUuid,
  findCartIdByCustomerId,
  fetchCartItemsByCartId,
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  fetchCartItemsByVariantIds,
} from '@/api/cartService'
import { NextRequest, NextResponse } from 'next/server'

interface CartItemRequestBody {
  userId: string
  variantId: number
  quantity?: number
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('id')
  const variantIds = searchParams.get('variantIds')

  try {
    let cartItems: any[] = []

    if (userId) {
      const customerId = await findCustomerIdByUserUuid(userId)
      const cartId = await findCartIdByCustomerId(customerId)

      if (cartId === null) {
        return NextResponse.json(cartItems, { status: 200 })
      }

      cartItems = await fetchCartItemsByCartId(cartId)
    } else if (variantIds) {
      const variantIdsArray = variantIds.split(',').map((id) => parseInt(id, 10))
      cartItems = await fetchCartItemsByVariantIds(variantIdsArray)
    } else {
      return NextResponse.json(
        { message: 'Invalid request: Missing userId or variantIds' },
        { status: 400 },
      )
    }

    return NextResponse.json(cartItems, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Error fetching cart', details: error.message },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  const { userId, variantId, quantity }: CartItemRequestBody = await request.json()

  try {
    const customerId = await findCustomerIdByUserUuid(userId)
    const cartId = await findCartIdByCustomerId(customerId)
    await addItemToCart(cartId, variantId, quantity || 1)

    return NextResponse.json({ message: 'Product added to cart' }, { status: 200 })
  } catch (error: any) {
    console.error('Error adding product to cart:', error)
    return NextResponse.json(
      { error: 'Error adding product to cart', details: error.message },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  const { userId, variantId }: Pick<CartItemRequestBody, 'userId' | 'variantId'> =
    await request.json()

  try {
    const customerId = await findCustomerIdByUserUuid(userId)
    const cartId = await findCartIdByCustomerId(customerId)
    await removeItemFromCart(cartId, variantId)

    return NextResponse.json({ message: 'Item removed from cart' }, { status: 200 })
  } catch (error: any) {
    console.error('Error removing item from cart:', error)
    return NextResponse.json(
      { error: 'Error removing item from cart', details: error.message },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  const { userId, variantId, quantity }: CartItemRequestBody = await request.json()

  try {
    const customerId = await findCustomerIdByUserUuid(userId)
    const cartId = await findCartIdByCustomerId(customerId)
    await updateCartItemQuantity(cartId, variantId, quantity || 1)

    return NextResponse.json({ message: 'Product quantity updated' }, { status: 200 })
  } catch (error: any) {
    console.error('Error updating product quantity:', error)
    return NextResponse.json(
      { error: 'Error updating product quantity', details: error.message },
      { status: 500 },
    )
  }
}

export function OPTIONS() {
  return NextResponse.json(null, {
    status: 405,
    headers: {
      Allow: 'GET, POST, DELETE, PATCH',
    },
  })
}