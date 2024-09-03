import { NextRequest, NextResponse } from 'next/server'
import { checkUsernameExists } from '@/api/userService'

export async function POST(request: NextRequest) {
  const { username } = await request.json()

  if (!username) {
    return NextResponse.json({ message: 'Username or password is incorrect' }, { status: 400 })
  }

  try {
    const exists = await checkUsernameExists(username)

    return NextResponse.json({ exists: exists ? true : false }, { status: 200 })
  } catch (error: any) {
    console.error('Error checking username:', error)
    return NextResponse.json({ message: 'Username or password is incorrect' }, { status: 500 })
  }
}
