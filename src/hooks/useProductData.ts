import { useQuery } from '@tanstack/react-query'

interface Product {
  id: string
  name: string
  category_name: string
  category_slug: string
}

interface UseProductDataReturn {
  product: Product | undefined
  categoryName: string | undefined
  categorySlug: string | undefined
}

const fetchProductDetails = async (
  slug: string,
  variantSku: string
): Promise<Product> => {
  const response = await fetch(`/api/products/${slug}/${variantSku}`, {
    headers: {
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
    },
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  return response.json()
}

const useProductData = (
  slug: string,
  variantSku: string
): UseProductDataReturn & { isLoading: boolean; error: Error | null } => {
  const {
    data: product,
    error,
    isLoading,
  } = useQuery<Product>({
    queryKey: ['productData', slug, variantSku],
    queryFn: () => fetchProductDetails(slug, variantSku),
  })

  if (error) {
    console.error('Error fetching product data:', error)
  }

  return {
    product,
    categoryName: product?.category_name,
    categorySlug: product?.category_slug,
    isLoading,
    error,
  }
}

export default useProductData
