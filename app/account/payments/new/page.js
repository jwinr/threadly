"use client"

import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react"
import { useRouter } from "next/navigation"
import getStripe from "@/utils/get-stripejs"
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js"
import Head from "next/head"
import { UserContext } from "@/context/UserContext"

export default function NewPayment() {
  const { userAttributes } = useContext(UserContext)
  const router = useRouter()
  const [isUserLoaded, setIsUserLoaded] = useState(false)

  useEffect(() => {
    if (userAttributes) {
      setIsUserLoaded(true)
    }
  }, [userAttributes])

  const fetchClientSecret = useCallback(async () => {
    try {
      if (!isUserLoaded) {
        console.log("Waiting for user")
        return null
      }

      const customer = userAttributes?.stripe_customer_id
      if (!customer) {
        console.log("Customer is not defined")
        return null
      }

      const response = await fetch("/api/account/payments/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ customer }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      return data.clientSecret
    } catch (error) {
      console.error("Error fetching client secret:", error)
      return null
    }
  }, [isUserLoaded, userAttributes])

  const options = useMemo(() => ({ fetchClientSecret }), [fetchClientSecret])

  return (
    <>
      <Head>
        <title>Checkout | TechNexus</title>
      </Head>
      <div
        id="checkout"
        style={{
          position: "relative",
          paddingTop: "25px",
          paddingLeft: "10px",
          paddingRight: "10px",
          paddingBottom: "25px",
        }}
      >
        {isUserLoaded && (
          <>
            <EmbeddedCheckoutProvider stripe={getStripe()} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </>
        )}
      </div>
    </>
  )
}
