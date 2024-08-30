import { useEffect, useState } from "react"

const useCategoryData = (slug, currentPage, filters) => {
  const [categoryData, setCategoryData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filteredItems, setFilteredItems] = useState([])

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!slug) return

      setLoading(true)

      const filterQuery = filters
        ? `&filters=${encodeURIComponent(JSON.stringify(filters))}`
        : ""

      try {
        const response = await fetch(
          `/api/categories/${slug}?page=${currentPage}${filterQuery}`,
          {
            headers: {
              "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          setCategoryData(data)

          setFilteredItems(data.products)
        } else if (response.status === 404) {
          throw new Error("Category not found")
        } else {
          throw new Error("An unexpected error occurred.")
        }
      } catch (error) {
        console.error("Error fetching category data:", error)
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
