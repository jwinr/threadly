import { NextRequest, NextResponse } from 'next/server'
import { fetchProductWithMainImage } from '@/api/reviewService'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }

  try {
    const productWithMainImage = await fetchProductWithMainImage(slug)

    // Send the product data as a JSON response
    return NextResponse.json(productWithMainImage)
  } catch (error: any) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
