import { NextResponse } from 'next/server'
import { fetchCategories } from '@/api/categoryService'

export async function GET(request: Request) {
  try {
    const categoriesData = await fetchCategories()

    return NextResponse.json(categoriesData, {
      status: 200,
    })
  } catch (error) {
    console.error('Error fetching category data:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      {
        status: 500,
      },
    )
  }
}
