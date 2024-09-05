'use client'

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
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
}

const defaultUserContext: UserContextType = {
  userAttributes: null,
  fetchUserAttributes: async () => {},
  fetchPaymentMethods: async () => [],
  getToken: async () => null,
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
  const [, setAuthChecked] = useState<boolean>(false)

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

        const data = await response.json()

        if (data.userUuid) {
          const updatedAttributes = {
            ...attributes,
            user_uuid: data.userUuid,
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
        }

        setUserAttributes(selectedAttributes)

        debouncedFetchUserAttributes(selectedAttributes)
      }
    } catch (error) {
      console.error('Error fetching user session:', error)
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
    fetchUserAttributes().then(() => setAuthChecked(true))
  }, [fetchUserAttributes])

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

  const fetchPaymentMethods = useCallback(
    async (userUuid: string) => {
      const token = await getToken()
      if (!token) {
        return []
      }

      try {
        // Fetch the Stripe customer ID based on the userUuid
        const response = await fetch(`/api/user/${userUuid}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        if (!response.ok || !data.stripeCustomerId) {
          console.error('Failed to fetch Stripe customer ID:', data.error)
          return []
        }

        const stripeCustomerId = data.stripeCustomerId

        // Now fetch the payment methods using the Stripe customer ID
        const paymentResponse = await fetch(
          `/api/account/payments?stripe_customer_id=${stripeCustomerId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              'x-user-attributes': JSON.stringify(userAttributes),
            },
          }
        )

        const paymentData = await paymentResponse.json()
        if (paymentResponse.ok) {
          return paymentData.paymentMethods
        } else {
          console.error('Failed to fetch payment methods:', paymentData.error)
          return []
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error)
        return []
      }
    },
    [getToken, userAttributes]
  )

  return (
    <UserContext.Provider
      value={{
        userAttributes,
        fetchUserAttributes,
        fetchPaymentMethods,
        getToken,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
