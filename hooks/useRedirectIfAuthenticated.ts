import { useState, useEffect } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'

/**
 * Hook to check if a user is authenticated and redirect to the homepage if they are.
 * Designed for pages like login or signup where authenticated users should not access.
 * @param {() => Promise<void>} fetchUserAttributes - A function to fetch user attributes if needed
 * @returns {boolean} - Whether the authentication check has been completed
 */
const useRedirectIfAuthenticated = (fetchUserAttributes: () => Promise<void>): boolean => {
  const [authChecked, setAuthChecked] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const session = await fetchAuthSession()
        if (session && session.tokens && session.tokens.idToken) {
          router.push('/')
        } else {
          setAuthChecked(true) // No authenticated user found
        }
      } catch (error) {
        console.log('No authenticated user found', error)
        setAuthChecked(true) // Error occurred while checking authentication
      }
    }

    checkUserAuthentication()
  }, [router, fetchUserAttributes])

  return authChecked
}

export default useRedirectIfAuthenticated
