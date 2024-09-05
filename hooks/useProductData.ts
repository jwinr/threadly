import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  category_name: string
  category_slug: string
}

interface UseProductDataReturn {
  product: Product | null
  categoryName: string | null
  categorySlug: string | null
}

const useProductData = (
  slug: string,
  variantSku: string
): UseProductDataReturn => {
  const [product, setProduct] = useState<Product | null>(null)
  const [categoryName, setCategoryName] = useState<string | null>(null)
  const [categorySlug, setCategorySlug] = useState<string | null>(null)

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/products/${slug}/${variantSku}`, {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
          },
        })

        if (response.ok) {
          const data: Product = await response.json()
          setProduct(data)
          setCategoryName(data.category_name)
          setCategorySlug(data.category_slug)
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }

    if (slug) {
      fetchProductDetails()
    }
  }, [slug, variantSku])

  return { product, categoryName, categorySlug }
}

export default useProductData
