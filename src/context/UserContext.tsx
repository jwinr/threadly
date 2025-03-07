'use client'

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'
import debounce from 'lodash.debounce'
import { INVALID_JWT_TOKEN_ERROR } from '@/lib/constants'

interface UserAttributes {
  sub?: string
  email?: string
  family_name?: string
  given_name?: string
  user_uuid?: string
  stripe_customer_id?: string
  created_at?: string
}

interface CognitoIdTokenPayload {
  sub?: string
  email?: string
  family_name?: string
  given_name?: string
}

interface UserContextType {
  userAttributes: UserAttributes | null
  fetchUserAttributes: () => Promise<void>
  fetchPaymentMethods: (userUuid: string) => Promise<unknown[]>
  getToken: () => Promise<object | null>
  loading: boolean
}

const defaultUserContext: UserContextType = {
  userAttributes: null,
  fetchUserAttributes: async () => { },
  // eslint-disable-next-line @typescript-eslint/require-await
  fetchPaymentMethods: async () => [],
  // eslint-disable-next-line @typescript-eslint/require-await
  getToken: async () => null,
  loading: true,
}

export const UserContext = createContext<UserContextType>(defaultUserContext)

interface UserProviderProps {
  children: ReactNode
  initialUserAttributes: UserAttributes | null
}

export const UserProvider: React.FC<UserProviderProps> = ({
  children,
  initialUserAttributes,
}) => {
  const [userAttributes, setUserAttributes] = useState<UserAttributes | null>(
    initialUserAttributes
  )
  const [authChecked, setAuthChecked] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const debouncedFetchUserAttributes = useCallback(
    debounce(async (attributes: UserAttributes) => {
      try {
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-attributes': JSON.stringify(attributes),
          },
          body: JSON.stringify(attributes),
        })

        const data: unknown = await response.json()

        const userData = data as { userUuid?: string }
        if (userData.userUuid) {
          const updatedAttributes = {
            ...attributes,
            user_uuid: userData.userUuid,
          }
          setUserAttributes(updatedAttributes)
        }
      } catch (error) {
        console.error('Error updating user attributes:', error)
      }
    }, 300),
    []
  )

  const fetchUserAttributes = useCallback(async () => {
    try {
      const session = await fetchAuthSession()
      if (session?.tokens?.idToken) {
        const payload = session.tokens.idToken.payload as CognitoIdTokenPayload

        const selectedAttributes: UserAttributes = {
          sub: payload.sub,
          email: payload.email,
          family_name: payload.family_name,
          given_name: payload.given_name,
          created_at: userAttributes?.created_at,
        }

        setUserAttributes(selectedAttributes)

        await debouncedFetchUserAttributes(selectedAttributes)
      } else {
        // No valid session; ensure userAttributes are cleared
        setUserAttributes(null)
      }
    } catch (error) {
      console.error('Error fetching user session:', error)
      setUserAttributes(null)
    } finally {
      setAuthChecked(true)
      setLoading(false)
    }
  }, [debouncedFetchUserAttributes])

  const getToken = async (): Promise<object | null> => {
    try {
      const session = await fetchAuthSession()
      if (session?.tokens?.accessToken) {
        return session.tokens.accessToken
      } else {
        throw new Error(INVALID_JWT_TOKEN_ERROR)
      }
    } catch (error) {
      console.error('Error fetching auth session:', error)
      return null
    }
  }

  useEffect(() => {
    // Only fetch user attributes if auth hasn't been checked yet
    if (!authChecked) {
      // If initialUserAttributes are present and complete, set authChecked to true
      const hasCompleteAttributes =
        initialUserAttributes && initialUserAttributes.user_uuid

      if (hasCompleteAttributes) {
        setAuthChecked(true)
        setLoading(false)
      } else {
        // Fetch user attributes since initial data is missing or incomplete
        void fetchUserAttributes()
      }
    }
  }, [authChecked, fetchUserAttributes, initialUserAttributes])

  const signOut = async () => {
    try {
      // Call the signout API route to clear cookies
      await fetch('/api/user/signout', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      setUserAttributes(null)
      setAuthChecked(true)
      setLoading(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  useEffect(() => {
    const hubListener = ({ payload }: { payload: { event: string } }) => {
      switch (payload.event) {
        case 'signedIn':
          fetchUserAttributes()
          break
        case 'signedOut':
          signOut()
          break
        case 'tokenRefresh':
          fetchUserAttributes()
          break
        default:
          break
      }
    }

    const listener = Hub.listen('auth', hubListener)

    return () => {
      listener()
    }
  }, [fetchUserAttributes])

  const fetchPaymentMethods = useCallback(async () => {
    const token = await getToken()
    if (!token) {
      return []
    }

    try {
      // Fetch the Stripe customer ID directly from /api/stripe-id
      const response = await fetch('/api/stripe-id', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${JSON.stringify(token)}`,
          'Content-Type': 'application/json',
        },
      })

      const data: { stripe_customer_id?: string; error?: string } =
        (await response.json()) as {
          stripe_customer_id?: string
          error?: string
        }

      if (!response.ok || !data.stripe_customer_id) {
        console.error('Failed to fetch Stripe customer ID:', data.error)
        return []
      }

      const stripeCustomerId = data.stripe_customer_id

      // Now fetch the payment methods using the Stripe customer ID
      const paymentResponse = await fetch(
        `/api/account/payments?stripe_customer_id=${stripeCustomerId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${JSON.stringify(token)}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const paymentData: { paymentMethods: unknown[]; error?: string } =
        (await paymentResponse.json()) as {
          paymentMethods: unknown[]
          error?: string
        }

      if (paymentResponse.ok) {
        return paymentData.paymentMethods
      } else {
        console.error(
          'Failed to fetch payment methods:',
          paymentData?.error || 'Unknown error'
        )
        return []
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error)
      return []
    }
  }, [getToken])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      userAttributes,
      fetchUserAttributes,
      fetchPaymentMethods,
      getToken,
      loading,
    }),
    [
      userAttributes,
      fetchUserAttributes,
      fetchPaymentMethods,
      getToken,
      loading,
    ]
  )

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  )
}
