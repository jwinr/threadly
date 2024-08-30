import { getPaymentMethodsForCustomer } from "@/api/stripeService"

export default async (req, res) => {
  try {
    if (req.method === "GET") {
      const { stripe_customer_id } = req.query
      if (!stripe_customer_id) {
        return res.status(400).json({ error: "Stripe customer ID not found" })
      }

      const paymentMethods = await getPaymentMethodsForCustomer(
        stripe_customer_id
      )
      return res.status(200).json({ paymentMethods })
    } else {
      res.setHeader("Allow", ["GET"])
      return res.status(405).end(`Method ${req.method} not allowed`)
    }
  } catch (error) {
    console.error("Error fetching payment methods:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
