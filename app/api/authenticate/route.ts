import { NextResponse } from 'next/server'
import { verifyToken, checkCognitoUser } from '@/api/authService'

// POST request handler
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const token = body.token

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 })
    }

    // Verify the JWT token and extract user information
    const decoded = await verifyToken(token)

    // Extract user information from the decoded token payload
    const { sub: userId, username } = decoded

    // Check if the user exists in AWS Cognito
    await checkCognitoUser(userId)

    // Authentication successful, respond with user information
    return NextResponse.json(
      { userId, username, message: 'Authentication successful' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error during authentication:', error)

    return NextResponse.json(
      {
        error: `Unauthorized: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`,
      },
      { status: 401 },
    )
  }
}
