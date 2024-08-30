import { findUserByCognitoSub, fetchUserOrders } from "@/api/orderService"

export default async function handler(req, res) {
  const { method } = req

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"])
    return res.status(405).end(`Method ${method} Not Allowed`)
  }

  const { cognitoSub, limit = 10, offset = 0 } = req.query

  if (!cognitoSub) {
    return res.status(400).json({ error: "Missing cognitoSub" })
  }

  try {
    const userId = await findUserByCognitoSub(cognitoSub)
    const orders = await fetchUserOrders(userId, limit, offset)

    res.status(200).json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    res
      .status(500)
      .json({ error: "Error fetching orders", details: error.message })
  }
}
