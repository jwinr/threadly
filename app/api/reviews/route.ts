import { NextRequest, NextResponse } from 'next/server'
import { findUserByCognitoSub, handleVote, submitReview } from '@/api/reviewService'

export async function POST(req: NextRequest) {
  try {
    const { reviewId, voteType, title, text, rating, cognitoSub, productId } = await req.json()

    // Fetch user_id using cognitoSub
    const userId = await findUserByCognitoSub(cognitoSub)

    let updatedReview

    if (voteType) {
      // Handle vote logic
      updatedReview = await handleVote(reviewId, voteType, userId)
    } else if (title && text && rating && productId) {
      // Handle review submission
      updatedReview = await submitReview(userId, title, text, rating, productId)
    }

    return NextResponse.json({
      message: 'Operation completed successfully',
      updatedReview,
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: {
      Allow: 'POST',
    },
  })
}

export function middleware(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
  }
}
