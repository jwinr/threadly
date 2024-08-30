import {
  findCustomerIdByUserUuid,
  fetchFavoriteItems,
  addProductToFavorites,
  removeProductFromFavorites,
} from '@/api/favoritesService'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('id')
  const limit = parseInt(searchParams.get('limit') || '5', 10)
  const offset = parseInt(searchParams.get('offset') || '0', 10)

  try {
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const customerId = await findCustomerIdByUserUuid(userId)
    const favoriteItems = await fetchFavoriteItems(customerId, limit, offset)

    return NextResponse.json(favoriteItems, { status: 200 })
  } catch (error: any) {
    console.error('Error handling GET request:', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error.message,
      },
      { status: 500 },
    )
  }
}

interface FavoriteRequestBody {
  userId: string
  colorVariantId: number
}

export async function POST(req: NextRequest) {
  try {
    const body: FavoriteRequestBody = await req.json()
    const { userId, colorVariantId } = body

    await addProductToFavorites(userId, colorVariantId)

    return NextResponse.json({ message: 'Product added to favorites' }, { status: 200 })
  } catch (error: any) {
    console.error('Error handling POST request:', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body: FavoriteRequestBody = await req.json()
    const { userId, colorVariantId } = body

    await removeProductFromFavorites(userId, colorVariantId)

    return NextResponse.json({ message: 'Product removed from favorites' }, { status: 200 })
  } catch (error: any) {
    console.error('Error handling DELETE request:', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error.message,
      },
      { status: 500 },
    )
  }
}
