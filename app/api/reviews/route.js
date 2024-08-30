import {
  findUserByCognitoSub,
  handleVote,
  submitReview,
} from "@/api/reviewService"

export default async function handler(req, res) {
  const { method } = req

  if (method === "POST") {
    const { reviewId, voteType, title, text, rating, cognitoSub, productId } =
      req.body

    try {
      // Fetch user_id using cognitoSub
      const userId = await findUserByCognitoSub(cognitoSub)

      let updatedReview

      if (voteType) {
        // Handle vote logic
        updatedReview = await handleVote(reviewId, voteType, userId)
      } else if (title && text && rating && productId) {
        // Handle review submission
        updatedReview = await submitReview(
          userId,
          title,
          text,
          rating,
          productId
        )
      }

      res
        .status(200)
        .json({ message: "Operation completed successfully", updatedReview })
    } catch (error) {
      console.error("Error:", error)
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" })
  }
}
