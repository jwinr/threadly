"use client"

import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"

import Head from "next/head"
import { useRouter } from "next/navigation"

import { UserContext } from "@/context/UserContext"
import { CartContext } from "@/context/CartContext"
import { useMobileView } from "@/context/MobileViewContext"

import Point from "@/public/images/icons/notdef.svg"

import useCurrencyFormatter from "@/hooks/useCurrencyFormatter"

import ShippingInfo from "@/components/Shopping/ShippingInfo"
import OrderSummary from "@/components/Shopping/OrderSummary"
import CartProductCard from "@/components/Shopping/CartProductCard"
import FavoritesSection from "@/components/Shopping/FavoritesSection"
import EmptyCartSection from "@/components/Shopping/EmptyCartSection"
import EmptyFavoritesSection from "@/components/Shopping/EmptyFavoritesSection"

import {
  PageWrapper,
  MainContent,
  ContentWrapper,
  OrderSummaryWrapper,
  TitleWrapper,
  Header,
  CartContainer,
  CartWrapper,
  Subtitle,
} from "@/components/Shopping/CartStyles"

import OrderSpinner from "@/components/Loaders/OrderSpinner"

const StyledPoint = styled(Point)`
  width: 24px;
  height: 24px;
`

interface UserAttributes {
  sub: string
}

interface CartItem {
  variant_id: string
  product_sale_price?: string
  product_price: string
  quantity: number
  product_image_url: string
  product_name: string
  product_slug: string
  waist: string
  length: string
}

interface CartContextType {
  cart: CartItem[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  removeFromCart: (variant_id: string) => void
  loadingSummary: boolean
  setLoadingSummary: React.Dispatch<React.SetStateAction<boolean>>
  handleQuantityChange: (variant_id: string, quantity: number) => void
}

interface FavoriteItem {
  variant_id: string
}

interface PreviousTotals {
  subtotal: string
  estimatedTaxes: string
  total: string
  totalQuantity: number
}

const Cart: React.FC = () => {
  const { userAttributes } = useContext(UserContext) as {
    userAttributes: UserAttributes | null
  }
  const {
    cart,
    setCart,
    removeFromCart,
    loadingSummary,
    setLoadingSummary,
    handleQuantityChange,
  } = useContext(CartContext) as CartContextType
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [offset, setOffset] = useState(0)
  const isMobileView = useMobileView()
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const { deliveryDate, zipCode } = ShippingInfo()
  const formatCurrency = useCurrencyFormatter()

  const [previousTotals, setPreviousTotals] = useState<PreviousTotals>({
    subtotal: "0.00",
    estimatedTaxes: "0.00",
    total: "0.00",
    totalQuantity: 0,
  })

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (userAttributes && userAttributes.sub) {
          const apiKey = process.env.NEXT_PUBLIC_API_KEY
          if (!apiKey) {
            throw new Error("API key is missing")
          }
          const response = await fetch(
            `/api/cart?cognitoSub=${userAttributes.sub}`,
            {
              headers: {
                "x-api-key": apiKey,
              },
            }
          )
          const data = await response.json()

          setCart(
            data.map((item: CartItem) => ({
              ...item,
              quantity: item.quantity || 1,
            }))
          )
        } else {
          console.error("cognitoSub is null or undefined")
          const localCart = JSON.parse(localStorage.getItem("cart") || "[]")
          if (localCart.length > 0) {
            console.log("Fetching cart for local cart")
            const uniqueVariantIds = [
              ...new Set(localCart.map((item: CartItem) => item.variant_id)),
            ]
            const variantIds = uniqueVariantIds.join(",")
            const apiKey = process.env.NEXT_PUBLIC_API_KEY
            if (!apiKey) {
              throw new Error("API key is missing")
            }
            const response = await fetch(`/api/cart?variantIds=${variantIds}`, {
              headers: {
                "x-api-key": apiKey,
              },
            })
            const data = await response.json()

            const detailedCart = localCart.map((item: CartItem) => ({
              ...item,
              ...data.find(
                (product: CartItem) => product.variant_id === item.variant_id
              ),
              quantity: item.quantity,
            }))

            setCart(detailedCart)
          }
        }
      } catch (error) {
        console.error("Error fetching cart:", error)
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 750) // Delay to allow the skeleton loader UI
      }
    }

    fetchCart()
    fetchFavorites()
  }, [userAttributes, setCart])

  const fetchFavorites = async (newOffset = 0) => {
    if (userAttributes) {
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY
        if (!apiKey) {
          throw new Error("API key is missing")
        }
        const response = await fetch(
          `/api/favorites?cognitoSub=${userAttributes.sub}&limit=5&offset=${newOffset}`,
          {
            headers: {
              "x-api-key": apiKey,
            },
          }
        )
        const data = await response.json()
        setFavorites((prevFavorites) => [...prevFavorites, ...data])
        setOffset(newOffset + 5)
      } catch (error) {
        console.error("Error fetching favorites:", error)
      }
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [userAttributes])

  const calculateTotal = (cart: CartItem[]) => {
    const subtotal = cart.reduce((sum, item) => {
      const price = Number(item.product_sale_price || item.product_price)
      const quantity = Number(item.quantity)
      return sum + price * quantity
    }, 0)

    const estimatedTaxes = subtotal * 0.07
    const total = subtotal + estimatedTaxes

    const totalQuantity = cart.reduce(
      (sum, item) => sum + Number(item.quantity),
      0
    )

    return {
      subtotal: formatCurrency(subtotal),
      estimatedTaxes: formatCurrency(estimatedTaxes),
      total: formatCurrency(total),
      totalQuantity,
    }
  }

  useEffect(() => {
    if (!loadingSummary) {
      const totals = calculateTotal(cart)
      setPreviousTotals(totals)
    }
  }, [loadingSummary, cart])

  const { subtotal, estimatedTaxes, total, totalQuantity } = previousTotals

  return (
    <PageWrapper>
      <Head>
        <title>Cart | Nexari</title>
      </Head>
      <MainContent>
        <ContentWrapper>
          <CartWrapper>
            <TitleWrapper>
              <Header>Cart</Header>
            </TitleWrapper>
            {loading ? (
              <>
                <Subtitle loading={loading} />
                <CartContainer loading={loading} />
              </>
            ) : (
              <>
                <Subtitle loading={loading}>
                  <h1>
                    {subtotal} subtotal <StyledPoint /> {totalQuantity}{" "}
                    {totalQuantity === 1 ? "item" : "items"}
                  </h1>
                </Subtitle>
                <CartContainer loading={loading}>
                  {!loading ? (
                    cart.length > 0 ? (
                      cart.map((item, index) => (
                        <CartProductCard
                          key={item.variant_id}
                          item={{
                            ...item,
                            product_image_url:
                              item.product_image_url || "/images/default.png", // Default image
                          }}
                          isMobileView={isMobileView}
                          deliveryDate={deliveryDate}
                          handleQuantityChange={handleQuantityChange}
                          removeFromCart={removeFromCart}
                          index={index}
                        />
                      ))
                    ) : (
                      <EmptyCartSection userAttributes={userAttributes} />
                    )
                  ) : null}
                </CartContainer>
                {isMobileView && (
                  <OrderSummaryWrapper>
                    <OrderSummary
                      subtotal={subtotal}
                      estimatedTaxes={estimatedTaxes}
                      total={total}
                      totalQuantity={totalQuantity}
                      zipCode={zipCode}
                      loading={loading}
                      loadingSummary={loadingSummary}
                    />
                  </OrderSummaryWrapper>
                )}
              </>
            )}
            <CartContainer loading={loading}>
              {!loading ? (
                favorites.length > 0 ? (
                  <FavoritesSection
                    favorites={favorites}
                    loadMoreFavorites={() => fetchFavorites(offset)}
                    isMobileView={isMobileView}
                  />
                ) : (
                  <EmptyFavoritesSection />
                )
              ) : null}
            </CartContainer>
          </CartWrapper>
        </ContentWrapper>
        {!isMobileView && (
          <OrderSummaryWrapper>
            <OrderSpinner loading={loadingSummary} />
            <OrderSummary
              subtotal={subtotal}
              estimatedTaxes={estimatedTaxes}
              total={total}
              totalQuantity={totalQuantity}
              zipCode={zipCode}
              loading={loading}
              loadingSummary={loadingSummary}
            />
          </OrderSummaryWrapper>
        )}
      </MainContent>
    </PageWrapper>
  )
}

export default Cart
