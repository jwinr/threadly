import { NextRequest, NextResponse } from 'next/server'
import { fetchProductDetails } from '@/api/productService'

interface Params {
  slug: string
  variantSku: string
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { slug, variantSku } = params

  try {
    const productWithDetails = await fetchProductDetails(slug, variantSku)

    if (!productWithDetails) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(productWithDetails)
  } catch (error: any) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
