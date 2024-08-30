import { fetchProductWithMainImage } from "@/api/reviewService"

export default async function handler(req, res) {
  const { slug } = req.query

  try {
    const productWithMainImage = await fetchProductWithMainImage(slug)

    // Send the product data as a JSON response
    res.json(productWithMainImage)
  } catch (error) {
    console.error("Error fetching product:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}
