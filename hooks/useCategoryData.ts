import { useEffect, useState } from 'react'

interface Filter {
  [key: string]: unknown
}

interface Product {
  id: string
  name: string
}

interface CategoryData {
  products: Product[]
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
      if (!slug) {
        return
      }

      setLoading(true)

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
          const data: CategoryData = await response.json()
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

    fetchCategoryData()
  }, [slug, currentPage, filters])

  return { categoryData, loading, filteredItems, setFilteredItems, setLoading }
}

export default useCategoryData
