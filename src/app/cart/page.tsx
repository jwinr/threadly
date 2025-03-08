'use client'

import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { UserContext } from '@/context/UserContext'
import { CartContext, CartItem } from '@/context/CartContext'
import { useMobileView } from '@/context/MobileViewContext'
import Point from '@/public/images/icons/notdef.svg'
import useCurrencyFormatter from 'src/hooks/useCurrencyFormatter'
import ShippingInfo from '@/components/Shopping/ShippingInfo'
import OrderSummary from '@/components/Shopping/OrderSummary'
import { CartItems } from '@/components/Shopping/CartItems'
import FavoritesSection from '@/components/Shopping/FavoritesSection'
import EmptyCartSection from '@/components/Shopping/EmptyCartSection'
import EmptyFavoritesSection from '@/components/Shopping/EmptyFavoritesSection'
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
} from '@/components/Shopping/CartStyles'
import OrderSpinner from '@/components/Loaders/OrderSpinner'
import { FavoriteItem } from '@/types/favorites'

const StyledPoint = styled(Point)`
  width: 24px;
  height: 24px;
`

interface PreviousTotals {
  subtotal: string
  estimatedTaxes: string
  total: string
  totalQuantity: number
}

const Cart: React.FC = () => {
  const { userAttributes } = useContext(UserContext)
  const {
    cart,
    setCart,
    removeFromCart,
    loadingSummary,
    handleQuantityChange,
  } = useContext(CartContext) ?? {}
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [offset, setOffset] = useState(0)
  const isMobileView = useMobileView()
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const { deliveryDate, zipCode } = ShippingInfo()
  const formatCurrency = useCurrencyFormatter()

  const [previousTotals, setPreviousTotals] = useState<PreviousTotals>({
    subtotal: '0.00',
    estimatedTaxes: '0.00',
    total: '0.00',
    totalQuantity: 0,
  })

  useEffect(() => {
    const fetchCart = async () => {
      if (!userAttributes || !userAttributes.user_uuid) {
        // For guest users, load from localStorage and fetch additional details
        const localCart: CartItem[] = JSON.parse(
          localStorage.getItem('cart') || '[]'
        ) as CartItem[]

        if (localCart.length > 0) {
          // Get unique variantIds from the local cart items
          const uniqueVariantIds = [
            ...new Set(localCart.map((item) => item.variant_id)),
          ].join(',')

          try {
            // Fetch detailed product information using variantIds
            const response = await fetch(
              `/api/cart?variantIds=${uniqueVariantIds}`
            )
            const data: FavoriteItem[] =
              (await response.json()) as FavoriteItem[]

            // Merge local cart items with fetched product details
            const detailedCart = localCart.map((item) => ({
              ...item,
              ...data.find((product) => product.variant_id === item.variant_id),
            }))

            setCart?.(detailedCart)
          } catch (error) {
            console.error(
              'Error fetching detailed cart items for guest:',
              error
            )
          }
        } else {
          setCart?.(localCart) // Set empty cart if nothing in localStorage
        }

        setIsLoading(false)
        return
      }

      // For logged-in users, fetch the cart from the server
      try {
        const response = await fetch(`/api/cart?id=${userAttributes.user_uuid}`)
        const data: FavoriteItem[] = (await response.json()) as FavoriteItem[]

        setCart?.(
          data.map((item: FavoriteItem) => ({
            ...item,
            quantity: item.quantity || 1,
            variant_id: item.variant_id || 0,
          })) as CartItem[]
        )
      } catch (error) {
        console.error('Error fetching cart:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchCart()
  }, [userAttributes, setCart])

  const fetchFavorites = async (newOffset = 0) => {
    if (!userAttributes || !userAttributes.user_uuid) {
      // For guests, ensure favorites are empty
      setFavorites([])
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(
        `/api/favorites?id=${userAttributes.user_uuid}&limit=5&offset=${newOffset}`
      )
      const data = await response.json()
      setFavorites((prevFavorites) => [...prevFavorites, ...data])
      setOffset(newOffset + 5)
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Only call fetchFavorites if the user is signed in
    if (userAttributes?.user_uuid) {
      fetchFavorites()
    }
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
      const totals = calculateTotal(cart || [])
      setPreviousTotals(totals)
    }
  }, [loadingSummary, cart])

  const { subtotal, estimatedTaxes, total, totalQuantity } = previousTotals

  return (
    <PageWrapper>
      <MainContent>
        <ContentWrapper>
          <CartWrapper>
            <TitleWrapper>
              <Header>Cart</Header>
            </TitleWrapper>
            <>
              <Subtitle $isLoading={isLoading}>
                {!isLoading && totalQuantity > 0 && (
                  <h1>
                    {subtotal} subtotal <StyledPoint /> {totalQuantity}{' '}
                    {totalQuantity === 1 ? 'item' : 'items'}
                  </h1>
                )}
              </Subtitle>
              <CartContainer $isLoading={isLoading}>
                {!isLoading && (
                  <>
                    {cart?.length ? (
                      <CartItems
                        cart={cart}
                        isMobileView={isMobileView}
                        deliveryDate={deliveryDate}
                        handleQuantityChange={handleQuantityChange}
                        removeFromCart={removeFromCart}
                      />
                    ) : (
                      <EmptyCartSection userAttributes={userAttributes} />
                    )}
                  </>
                )}
              </CartContainer>
              {isMobileView && (
                <OrderSummaryWrapper>
                  <OrderSummary
                    subtotal={subtotal}
                    estimatedTaxes={estimatedTaxes}
                    total={total}
                    totalQuantity={totalQuantity}
                    zipCode={zipCode}
                    $isLoading={isLoading}
                    loadingSummary={loadingSummary ?? false}
                  />
                </OrderSummaryWrapper>
              )}
            </>
            <CartContainer $isLoading={isLoading}>
              {!isLoading ? (
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
            <OrderSpinner $isLoading={loadingSummary ?? false} />
            <OrderSummary
              subtotal={subtotal}
              estimatedTaxes={estimatedTaxes}
              total={total}
              totalQuantity={totalQuantity}
              zipCode={zipCode}
              $isLoading={isLoading}
              loadingSummary={loadingSummary ?? false}
            />
          </OrderSummaryWrapper>
        )}
      </MainContent>
    </PageWrapper>
  )
}

export default Cart
