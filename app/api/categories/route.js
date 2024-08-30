import { fetchCategories } from "@/api/categoryService"

export async function GET(req) {
  try {
    const categoriesData = await fetchCategories()

    return new Response(JSON.stringify(categoriesData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error fetching category data:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
