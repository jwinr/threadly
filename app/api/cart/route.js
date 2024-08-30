import {
  findCustomerIdByUserUuid,
  findCartIdByCustomerId,
  fetchCartItemsByCartId,
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  fetchCartItemsByVariantIds,
} from "@/api/cartService"
import { NextResponse } from "next/server"

// Handler for GET requests
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("id")
  const variantIds = searchParams.get("variantIds")

  try {
    let cartItems = []

    if (userId) {
      const customerId = await findCustomerIdByUserUuid(userId)
      const cartId = await findCartIdByCustomerId(customerId)

      if (cartId === null) {
        return NextResponse.json(cartItems, { status: 200 })
      }

      cartItems = await fetchCartItemsByCartId(cartId)
    } else if (variantIds) {
      const variantIdsArray = variantIds
        .split(",")
        .map((id) => parseInt(id, 10))
      cartItems = await fetchCartItemsByVariantIds(variantIdsArray)
    } else {
      return NextResponse.json(
        { message: "Invalid request: Missing userId or variantIds" },
        { status: 400 }
      )
    }

    return NextResponse.json(cartItems, { status: 200 })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json(
      { error: "Error fetching cart", details: error.message },
      { status: 500 }
    )
  }
}

// Handler for POST requests
export async function POST(request) {
  const { userId, variantId, quantity } = await request.json()

  try {
    const customerId = await findCustomerIdByUserUuid(userId)
    const cartId = await findCartIdByCustomerId(customerId)
    await addItemToCart(cartId, variantId, quantity)

    return NextResponse.json(
      { message: "Product added to cart" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error adding product to cart:", error)
    return NextResponse.json(
      { error: "Error adding product to cart", details: error.message },
      { status: 500 }
    )
  }
}

// Handler for DELETE requests
export async function DELETE(request) {
  const { userId, variantId } = await request.json()

  try {
    const customerId = await findCustomerIdByUserUuid(userId)
    const cartId = await findCartIdByCustomerId(customerId)
    await removeItemFromCart(cartId, variantId)

    return NextResponse.json({ message: "Cart cleared" }, { status: 200 })
  } catch (error) {
    console.error("Error clearing cart:", error)
    return NextResponse.json(
      { error: "Error clearing cart", details: error.message },
      { status: 500 }
    )
  }
}

// Handler for PATCH requests
export async function PATCH(request) {
  const { userId, variantId, quantity } = await request.json()

  try {
    const customerId = await findCustomerIdByUserUuid(userId)
    const cartId = await findCartIdByCustomerId(customerId)
    await updateCartItemQuantity(cartId, variantId, quantity)

    return NextResponse.json(
      { message: "Product quantity updated" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating product quantity:", error)
    return NextResponse.json(
      { error: "Error updating product quantity", details: error.message },
      { status: 500 }
    )
  }
}

// Method not allowed handler
export function OPTIONS() {
  return NextResponse.json(null, {
    status: 405,
    headers: {
      Allow: "GET, POST, DELETE, PATCH",
    },
  })
}
