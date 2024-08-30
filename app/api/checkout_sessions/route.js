import {
  createCheckoutSession,
  retrieveCheckoutSession,
} from "@/api/stripeService"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { cart, customer } = await req.json()
    const sessionData = await createCheckoutSession(cart, customer)

    return NextResponse.json(sessionData)
  } catch (err) {
    console.error("Error:", err)
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get("session_id")

    const sessionData = await retrieveCheckoutSession(sessionId)

    return NextResponse.json(sessionData)
  } catch (err) {
    console.error("Error:", err)
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}
