import { NextResponse } from "next/server"
import { fetchProductDetails } from "@/api/productService"

export async function GET(req, { params }) {
  const { slug, variantSku } = params

  try {
    const productWithDetails = await fetchProductDetails(slug, variantSku)
    return NextResponse.json(productWithDetails)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    )
  }
}
