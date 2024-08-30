"use client"

import React, { createContext, useState, useEffect, useCallback } from "react"
import { fetchAuthSession } from "aws-amplify/auth"
import { Hub } from "aws-amplify/utils"
import debounce from "lodash.debounce"

export const UserContext = createContext()

export const UserProvider = ({ children, initialUserAttributes }) => {
  const [userAttributes, setUserAttributes] = useState(initialUserAttributes)
  const [authChecked, setAuthChecked] = useState(false)

  const debouncedFetchUserAttributes = useCallback(
    debounce(async (attributes) => {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
          "x-user-attributes": JSON.stringify(attributes),
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
    }, 300),
    []
  )

  const fetchUserAttributes = useCallback(async () => {
    try {
      const session = await fetchAuthSession()
      if (session && session.tokens && session.tokens.idToken) {
        const { sub, email, family_name, given_name } =
          session.tokens.idToken.payload

        const selectedAttributes = { sub, email, family_name, given_name }

        setUserAttributes(selectedAttributes)

        debouncedFetchUserAttributes(selectedAttributes)
      }
    } catch (error) {
      console.error("Error fetching user session:", error)
    }
  }, [debouncedFetchUserAttributes])

  const getToken = async () => {
    try {
      const session = await fetchAuthSession()
      if (session && session.tokens && session.tokens.accessToken) {
        return session.tokens.accessToken
      } else {
        throw new Error("User is not authenticated")
      }
    } catch (error) {
      console.error("Error fetching auth session:", error)
      return null
    }
  }

  useEffect(() => {
    fetchUserAttributes().then(() => setAuthChecked(true))
  }, [fetchUserAttributes])

  useEffect(() => {
    const hubListener = ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          fetchUserAttributes()
          break
        case "signedOut":
          setUserAttributes(null)
          break
        case "tokenRefresh":
          fetchUserAttributes()
          break
        default:
          break
      }
    }

    const listener = Hub.listen("auth", hubListener)

    return () => {
      listener()
    }
  }, [fetchUserAttributes])

  const fetchPaymentMethods = useCallback(
    async (userUuid) => {
      const token = await getToken()
      if (!token) {
        return []
      }

      try {
        // Fetch the Stripe customer ID based on the userUuid
        const response = await fetch(`/api/user/${userUuid}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
          },
        })

        const data = await response.json()

        if (!response.ok || !data.stripeCustomerId) {
          console.error("Failed to fetch Stripe customer ID:", data.error)
          return []
        }

        const stripeCustomerId = data.stripeCustomerId

        // Now fetch the payment methods using the Stripe customer ID
        const paymentResponse = await fetch(
          `/api/account/payments?stripe_customer_id=${stripeCustomerId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
              "x-user-attributes": JSON.stringify(userAttributes),
            },
          }
        )

        const paymentData = await paymentResponse.json()
        if (paymentResponse.ok) {
          return paymentData.paymentMethods
        } else {
          console.error("Failed to fetch payment methods:", paymentData.error)
          return []
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error)
        return []
      }
    },
    [getToken]
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
