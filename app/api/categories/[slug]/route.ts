import { NextRequest, NextResponse } from 'next/server'
import { fetchCategoryData } from '@/api/categoryService'

interface Params {
  params: {
    slug: string
  }
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { slug } = params
    const { searchParams } = req.nextUrl
    const filters = searchParams.get('filters') || '{}'

    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json({ error: 'Invalid category slug' }, { status: 400 })
    }

    let parsedFilters: Record<string, any>

    try {
      parsedFilters = JSON.parse(decodeURIComponent(filters))
    } catch {
      return NextResponse.json({ error: 'Invalid filters format' }, { status: 400 })
    }

    const categoryData = await fetchCategoryData(slug, parsedFilters)

    return NextResponse.json(categoryData, { status: 200 })
  } catch (error) {
    console.error('Error fetching category data:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
