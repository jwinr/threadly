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
import { validateCsrfToken } from '@/utils/csrf'
import { INVALID_CSRF_TOKEN_ERROR } from '@/lib/constants'

interface CartItemRequestBody {
  userId: string
  variantId: number
  quantity?: number
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('id')
  const variantIds = searchParams.get('variantIds')

  try {
    let cartItems: any[] = []

    if (userId) {
      const customerId = await findCustomerIdByUserUuid(req, userId)
      const cartId = await findCartIdByCustomerId(req, customerId)

      if (cartId === null) {
        return NextResponse.json(cartItems, { status: 200 })
      }

      cartItems = await fetchCartItemsByCartId(req, cartId)
    } else if (variantIds) {
      const variantIdsArray = variantIds.split(',').map((id) => parseInt(id, 10))
      cartItems = await fetchCartItemsByVariantIds(req, variantIdsArray)
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

export async function POST(req: NextRequest) {
  if (!validateCsrfToken(req)) {
    return NextResponse.json({ error: INVALID_CSRF_TOKEN_ERROR }, { status: 403 })
  }

  const { userId, variantId, quantity }: CartItemRequestBody = await req.json()

  try {
    const customerId = await findCustomerIdByUserUuid(req, userId)
    const cartId = await findCartIdByCustomerId(req, customerId)

    // Fetch the current items in the cart
    const currentCartItems = await fetchCartItemsByVariantIds(req, [variantId])

    // Determine if the variant is already in the cart and get the current quantity
    const currentCartItem = currentCartItems.find((item) => item.variant_id === variantId)
    const currentQuantity = currentCartItem ? currentCartItem.quantity : 0

    // Calculate the new quantity and enforce the maximum limit
    const newQuantity = currentQuantity + (quantity || 1)
    const MAX_QUANTITY = 10

    if (newQuantity > MAX_QUANTITY) {
      return NextResponse.json(
        { error: `Cannot add more than ${MAX_QUANTITY} items of this product to the cart.` },
        { status: 400 },
      )
    }

    // Add the item to the cart using the service function
    await addItemToCart(req, cartId, variantId, quantity || 1)

    return NextResponse.json({ message: 'Product added to cart' }, { status: 200 })
  } catch (error: any) {
    console.error('Error adding product to cart:', error)
    return NextResponse.json(
      { error: 'Error adding product to cart', details: error.message },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  if (!validateCsrfToken(req)) {
    return NextResponse.json({ error: INVALID_CSRF_TOKEN_ERROR }, { status: 403 })
  }

  const { userId, variantId }: Pick<CartItemRequestBody, 'userId' | 'variantId'> = await req.json()

  try {
    const customerId = await findCustomerIdByUserUuid(req, userId)
    const cartId = await findCartIdByCustomerId(req, customerId)
    await removeItemFromCart(req, cartId, variantId)

    return NextResponse.json({ message: 'Item removed from cart' }, { status: 200 })
  } catch (error: any) {
    console.error('Error removing item from cart:', error)
    return NextResponse.json(
      { error: 'Error removing item from cart', details: error.message },
      { status: 500 },
    )
  }
}

export async function PATCH(req: NextRequest) {
  if (!validateCsrfToken(req)) {
    return NextResponse.json({ error: INVALID_CSRF_TOKEN_ERROR }, { status: 403 })
  }

  const { userId, variantId, quantity }: CartItemRequestBody = await req.json()

  try {
    const customerId = await findCustomerIdByUserUuid(req, userId)
    const cartId = await findCartIdByCustomerId(req, customerId)
    await updateCartItemQuantity(req, cartId, variantId, quantity || 1)

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
