import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js"
import { CartContext } from "../context/CartContext"
import Head from "next/head"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function Checkout() {
  const { cart } = useContext(CartContext)
  const [prices, setPrices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCartReady, setIsCartReady] = useState(false)

  useEffect(() => {
    if (cart.length > 0) {
      // Assuming prices are set here based on the cart
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

    setIsLoading(false)
  }, [cart])

  useEffect(() => {
    if (prices.length > 0) {
      setIsCartReady(true)
    }
  }, [prices])

  const fetchClientSecret = useCallback(async () => {
    try {
      if (!isCartReady || prices.length === 0) {
        console.log("Cart is not ready or prices are empty")
        return null
      }

      const response = await fetch("/api/checkout-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ cart: prices }), // Ensure prices are passed
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
  }, [prices, isCartReady])

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
        {isLoading ? (
          <p>Loading prices...</p>
        ) : (
          isCartReady && (
            <>
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </>
          )
        )}
      </div>
    </>
  )
}
