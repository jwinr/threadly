import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react"

import Head from "next/head"
import { useRouter } from "next/router"

import getStripe from "@/utils/get-stripejs"
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js"

import { CartContext } from "@/context/CartContext"
import { UserContext } from "@/context/UserContext"

export default function Checkout() {
  const { cart } = useContext(CartContext)
  const { userAttributes } = useContext(UserContext)
  const router = useRouter()
  const [prices, setPrices] = useState([])
  const [isCartReady, setIsCartReady] = useState(false)

  useEffect(() => {
    if (cart.length > 0) {
      const fetchedPrices = cart.map((item) => {
        return {
          product_id: item.product_id,
          stripe_price_id: item.product_sale_price
            ? item.product_stripe_sale_price_id
            : item.product_stripe_price_id,
          quantity: item.quantity,
        }
      })

      setPrices(fetchedPrices)
    } else {
      setPrices([])
    }
  }, [cart])

  useEffect(() => {
    if (prices.length > 0 && userAttributes) {
      setIsCartReady(true)
    }
  }, [prices, userAttributes])

  const fetchClientSecret = useCallback(async () => {
    try {
      if (!isCartReady || prices.length === 0) {
        console.log("Cart is not ready or prices are empty")
        return null
      }

      const customer = userAttributes?.stripe_customer_id
      if (!customer) {
        console.log("Customer is not defined")
        return null
      }

      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ cart: prices, customer }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      router.push(`/checkout?session_id=${data.sessionId}`)
      return data.clientSecret
    } catch (error) {
      console.error("Error fetching client secret:", error)
      return null
    }
  }, [prices, isCartReady, userAttributes])

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
          padding: "16px",
        }}
      >
        {isCartReady && (
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
