import { NextRequest } from 'next/server'
import cookie from 'cookie'

export function validateCsrfToken(request: NextRequest): boolean {
  const cookies = cookie.parse(request.headers.get('cookie') || '')
  const csrfTokenFromCookie = cookies.csrfToken || ''
  const csrfTokenFromHeader = request.headers.get('x-csrf-token') || ''

  // Make sure that we always return a boolean value
  return (
    csrfTokenFromCookie !== '' &&
    csrfTokenFromHeader !== '' &&
    csrfTokenFromCookie === csrfTokenFromHeader
  )
}
