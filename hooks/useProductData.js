import { useState, useEffect } from "react"

const useProductData = (slug, variantSku) => {
  const [product, setProduct] = useState(null)
  const [categoryName, setCategoryName] = useState(null)
  const [categorySlug, setCategorySlug] = useState(null)

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/products/${slug}/${variantSku}`, {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setProduct(data)
          setCategoryName(data.category_name)
          setCategorySlug(data.category_slug)
        }
      } catch (error) {
        console.error("Error:", error)
      }
    }

    if (slug) {
      fetchProductDetails()
    }
  }, [slug, variantSku])

  return { product, categoryName, categorySlug }
}

export default useProductData
