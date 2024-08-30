import { createSetupSession } from "@/api/stripeService"

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { customer } = req.body

      const clientSecret = await createSetupSession(
        customer,
        req.headers.origin
      )

      res.send({ clientSecret })
    } catch (error) {
      console.error("Error creating SetupIntent:", error)
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
