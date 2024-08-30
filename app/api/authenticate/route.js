import { verifyToken, checkCognitoUser } from "@/api/authService"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  const token = req.body.token

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" })
  }

  try {
    // Verify the JWT token and extract user information
    const decoded = await verifyToken(token)

    // Extract user information from the decoded token payload
    const { sub: userId, username } = decoded

    // Check if the user exists in AWS Cognito
    await checkCognitoUser(userId)

    // Authentication successful, respond with user information
    res
      .status(200)
      .json({ userId, username, message: "Authentication successful" })
  } catch (error) {
    return res.status(401).json({ error: `Unauthorized: ${error.message}` })
  }
}
