import { useEffect, useState, useContext } from "react"
import { useRouter } from "next/router"
import { UserContext } from "../../context/UserContext"

/**
 * Hook to check if there is a logged-in user and redirect to the login page if not.
 * The isSigningOut state is designed to prevent an early redirect while the user state changes.
 * @param {boolean} isSigningOut - Indicates if the user is in the process of signing out
 * @param {number} timeout - Timeout in milliseconds to wait for user data before redirecting
 */
const useCheckLoggedInUser = (
  isSigningOut = false,
  timeout = 5000,
  shouldCheck = true
) => {
  const { userAttributes } = useContext(UserContext)
  const [checkingUser, setCheckingUser] = useState(true)
  const [loading, setLoading] = useState(true)
  const [redirectHandled, setRedirectHandled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!shouldCheck || redirectHandled) return

    const timer = setTimeout(() => {
      if (loading && !redirectHandled) {
        console.log("Pushing login from hook timer..")
        router.push("/login")
        setRedirectHandled(true)
      }
    }, timeout)

    if (userAttributes) {
      setLoading(false)
      setCheckingUser(false)
      clearTimeout(timer)
      setRedirectHandled(true)
    }

    return () => clearTimeout(timer)
  }, [
    userAttributes,
    isSigningOut,
    loading,
    router,
    timeout,
    redirectHandled,
    shouldCheck,
  ])

  useEffect(() => {
    if (!shouldCheck || redirectHandled) return

    if (isSigningOut) {
      setLoading(false)
      setRedirectHandled(true)
      return
    }

    if (!userAttributes && !isSigningOut && !loading) {
      console.log("Pushing login from hook redirectHandled..")
      router.push("/login")
      setRedirectHandled(true)
    }
  }, [
    userAttributes,
    isSigningOut,
    loading,
    router,
    redirectHandled,
    shouldCheck,
  ])

  return checkingUser
}

export default useCheckLoggedInUser
