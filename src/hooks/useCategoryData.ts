import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
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
  categoryData: CategoryData | undefined
  loading: boolean
  filteredItems: Product[]
  setFilteredItems: React.Dispatch<React.SetStateAction<Product[]>>
}

const fetchCategoryData = async (
  slug: string,
  currentPage: number,
  filters: Filter | null
): Promise<CategoryData> => {
  const filterQuery = filters
    ? `&filters=${encodeURIComponent(JSON.stringify(filters))}`
    : ''

  const response = await fetch(
    `/api/categories/${slug}?page=${currentPage}${filterQuery}`
  )

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Category not found')
    }
    throw new Error('An unexpected error occurred.')
  }

  return response.json()
}

const useCategoryData = (
  slug: string | undefined,
  currentPage: number,
  filters: Filter | null
): UseCategoryDataReturn => {
  const [filteredItems, setFilteredItems] = useState<Product[]>([])

  const {
    data: categoryData,
    error,
    isLoading,
  } = useQuery<CategoryData>({
    queryKey: ['categoryData', slug, currentPage, filters],
    queryFn: () => fetchCategoryData(slug as string, currentPage, filters),
    enabled: !!slug,
  })

  useEffect(() => {
    if (categoryData) {
      const applyFilters = (
        products: Product[],
        filters: Filter | null
      ): Product[] => {
        return products
          .map((product) => {
            // Filter color variants based on the selected color filters
            const filteredColors = product.colors.filter((color) => {
              // Check if the color matches the selected filters
              const matchesColor =
                !filters?.Color ||
                (filters.Color as string[]).includes(color.color)
              return matchesColor
            })

            // Only return the product if it has matching color variants
            if (filteredColors.length > 0) {
              return {
                ...product,
                colors: filteredColors, // Only include the filtered colors
              }
            }
            return null // Return null if no matching color variants
          })
          .filter((product) => product !== null) as Product[] // Remove null products
      }

      const filtered = applyFilters(categoryData.products, filters)
      setFilteredItems(filtered)
    }
  }, [categoryData, filters])

  if (error) {
    console.error('Error fetching category data:', error)
  }

  return {
    categoryData,
    loading: isLoading,
    filteredItems,
    setFilteredItems,
  }
}

export default useCategoryData
