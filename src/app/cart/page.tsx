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
import CartProductCard from '@/components/Shopping/CartProductCard'
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
        // Wait until user_uuid is available before fetching
        setIsLoading(true)
        return
      }
      try {
        if (userAttributes && userAttributes.user_uuid) {
          const response = await fetch(
            `/api/cart?id=${userAttributes.user_uuid}`
          )
          const data: FavoriteItem[] = (await response.json()) as FavoriteItem[]

          setCart?.(
            data.map((item: FavoriteItem) => ({
              ...item,
              quantity: item.quantity || 1,
              variant_id: item.variant_id || 0,
            })) as CartItem[]
          )
        } else {
          console.error('user_uuid is null or undefined')
          const localCart: CartItem[] = JSON.parse(
            localStorage.getItem('cart') || '[]'
          ) as CartItem[]
          if (localCart.length > 0) {
            const uniqueVariantIds = [
              ...new Set(localCart.map((item: CartItem) => item.variant_id)),
            ]
            const variantIds = uniqueVariantIds.join(',')
            const response = await fetch(`/api/cart?variantIds=${variantIds}`)
            const data: FavoriteItem[] =
              (await response.json()) as FavoriteItem[]

            const detailedCart = localCart.map((item: CartItem) => ({
              ...item,
              ...data.find(
                (product: FavoriteItem) =>
                  product.variant_id === item.variant_id
              ),
              quantity: item.quantity,
            }))

            setCart?.(detailedCart)
          }
        }
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
      // Wait until user_uuid is available before fetching
      setIsLoading(true)
      return
    }
    try {
      const response = await fetch(
        `/api/favorites?id=${userAttributes?.user_uuid}&limit=5&offset=${newOffset}`
      )
      const data: FavoriteItem[] = (await response.json()) as FavoriteItem[]
      setFavorites((prevFavorites: FavoriteItem[]) => [
        ...prevFavorites,
        ...data,
      ])
      setOffset(newOffset + 5)
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  useEffect(() => {
    void fetchFavorites()
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
            {isLoading ? (
              <>
                <Subtitle $isLoading={isLoading} />
                <CartContainer $isLoading={isLoading} />
              </>
            ) : (
              <>
                <Subtitle $isLoading={isLoading}>
                  <h1>
                    {subtotal} subtotal <StyledPoint /> {totalQuantity}{' '}
                    {totalQuantity === 1 ? 'item' : 'items'}
                  </h1>
                </Subtitle>
                <CartContainer $isLoading={isLoading}>
                  {!isLoading ? (
                    (cart ?? []).length > 0 ? (
                      (cart ?? []).map((item, index) => (
                        <CartProductCard
                          key={item.variant_id}
                          item={{
                            product_id: item.product_id || 0,
                            product_name:
                              item.product_name || 'Unknown Product',
                            product_slug: item.product_slug || 'unknown-slug',
                            sku: item.sku || 'unknown-sku',
                            product_image_url:
                              item.product_image_url || '/images/default.png',
                            product_price: item.product_price || 0,
                            product_sale_price: item.product_sale_price,
                            quantity: item.quantity,
                            color: item.color,
                            waist: item.waist,
                            length: item.length,
                            size: item.size,
                            variant_id: item.variant_id,
                          }}
                          isMobileView={isMobileView}
                          deliveryDate={deliveryDate}
                          handleQuantityChange={() => void handleQuantityChange}
                          removeFromCart={() => void removeFromCart}
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
                      $isLoading={isLoading}
                      loadingSummary={loadingSummary ?? false}
                    />
                  </OrderSummaryWrapper>
                )}
              </>
            )}
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
