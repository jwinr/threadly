import { useEffect, useState } from 'react'
import { Attribute } from '@/types/product'

interface Filter {
  [key: string]: unknown
}

interface Size {
  price: number
  sale_price?: number
}

interface Color {
  color: string
  sizes: Size[]
  color_variant_id: string
  color_sku: number
  images: Array<{ image_url: string }>
  color_swatch_url: string
}

interface Product {
  slug: string
  brand: string
  rating: number
  id: string
  name: string
  price: number
  colors: Color[]
}

interface CategoryData {
  name: string
  products: Product[]
  attributes?: Attribute[]
}

interface UseCategoryDataReturn {
  categoryData: CategoryData | null
  loading: boolean
  filteredItems: Product[]
  setFilteredItems: React.Dispatch<React.SetStateAction<Product[]>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const useCategoryData = (
  slug: string | undefined,
  currentPage: number,
  filters: Filter | null
): UseCategoryDataReturn => {
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [filteredItems, setFilteredItems] = useState<Product[]>([])

  useEffect(() => {
    const fetchCategoryData = async () => {
      const filterQuery = filters
        ? `&filters=${encodeURIComponent(JSON.stringify(filters))}`
        : ''

      try {
        const response = await fetch(
          `/api/categories/${slug}?page=${currentPage}${filterQuery}`,
          {
            headers: {
              'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
            },
          }
        )

        if (response.ok) {
          const data: CategoryData = (await response.json()) as CategoryData
          setCategoryData(data)

          setFilteredItems(data.products)
        } else if (response.status === 404) {
          throw new Error('Category not found')
        } else {
          throw new Error('An unexpected error occurred.')
        }
      } catch (error) {
        console.error('Error fetching category data:', error)
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 750)
      }
    }

    void fetchCategoryData()
  }, [slug, currentPage, filters])

  return { categoryData, loading, filteredItems, setFilteredItems, setLoading }
}

export default useCategoryData
