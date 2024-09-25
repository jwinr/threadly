'use client'

import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { UserContext } from '@/context/UserContext'
import { useToast } from '@/context/ToastContext'
import { INVALID_JWT_TOKEN_ERROR } from '@/lib/constants'
import { fetchWithCsrf } from '@/utils/fetchWithCsrf'

export interface CartItem {
  product_stripe_sale_price_id?: number
  product_stripe_price_id?: number
  variant_id: number
  quantity: number
  product_id?: number
  product_name?: string
  product_slug?: string
  sku?: string
  product_image_url?: string
  product_price?: number
  product_sale_price?: number | null
  color?: string
  waist?: string
  length?: string
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (
    variantId: number,
    quantity?: number,
    isSyncing?: boolean
  ) => Promise<void>
  removeFromCart: (variantId: number) => Promise<void>
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  loadingSummary: boolean
  setLoadingSummary: React.Dispatch<React.SetStateAction<boolean>>
  handleQuantityChange: (
    variantId: number,
    newQuantity: number
  ) => Promise<void>
  clearCart: () => Promise<void>
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { showToast } = useToast()
  const [cart, setCart] = useState<CartItem[]>([])
  const { userAttributes, getToken } = useContext(UserContext)
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const hasSyncedCart = useRef<boolean>(false)

  const fetchCart = useCallback(async () => {
    if (userAttributes && userAttributes.user_uuid) {
      try {
        const response = await fetch(`/api/cart?id=${userAttributes.user_uuid}`)
        const data: CartItem[] = (await response.json()) as CartItem[]
        setCart(data)
      } catch (error) {
        console.error('Error fetching cart:', error)
      }
    } else {
      const localCart = JSON.parse(
        localStorage.getItem('cart') || '[]'
      ) as CartItem[]
      if (localCart.length > 0) {
        setCart(localCart)
      }
    }
  }, [userAttributes, setCart])

  const addToCart = useCallback(
    async (variantId: number, quantity = 1, isSyncing = false) => {
      console.log('addToCart called with:', { variantId, quantity, isSyncing })
      setLoadingSummary(true)
      try {
        if (userAttributes) {
          const token = await getToken()
          if (!token) {
            throw new Error(INVALID_JWT_TOKEN_ERROR)
          }

          const payload = {
            userId: userAttributes.user_uuid,
            variantId,
            quantity,
          }
          console.log('Sending payload to server:', payload)

          const response = await fetchWithCsrf('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${JSON.stringify(token)}`,
            },
            body: JSON.stringify({
              userId: userAttributes.user_uuid,
              variantId,
              quantity,
            }),
          })

          console.log('Response status:', response.status)

          if (!response.ok) {
            const errorData: unknown = await response.json()
            console.error('Error adding to cart:', errorData)
            throw new Error(
              `Error adding to cart: ${(errorData as { message: string }).message}`
            )
          }

          await fetchCart()
          console.log('Cart after adding item:', cart)
          if (!isSyncing) {
            void showToast(`Added ${quantity} item(s) to cart`, {
              type: 'success',
            })
          }
        } else {
          const localCart = JSON.parse(
            localStorage.getItem('cart') || '[]'
          ) as CartItem[]
          console.log('Local cart after addition:', localCart)
          const existingItem = localCart.find(
            (item) => item.variant_id === variantId
          )

          if (existingItem) {
            existingItem.quantity += quantity
          } else {
            localCart.push({
              variant_id: variantId,
              quantity,
              product_stripe_sale_price_id: 0,
              product_stripe_price_id: 0,
            })
          }

          localStorage.setItem('cart', JSON.stringify(localCart))
          await fetchCart()
          if (!isSyncing) {
            void showToast(`Added ${quantity} item(s) to cart`, {
              type: 'success',
            })
          }
        }
      } catch (error) {
        console.error('Error adding to cart:', error)
        void showToast('Failed to add product', {
          type: 'caution',
        })
      } finally {
        setLoadingSummary(false)
      }
    },
    [userAttributes, fetchCart, getToken, showToast]
  )

  const removeFromCart = async (variantId: number) => {
    setLoadingSummary(true)
    try {
      if (userAttributes) {
        const token = await getToken()
        if (!token) {
          throw new Error(INVALID_JWT_TOKEN_ERROR)
        }

        const response = await fetch('/api/cart', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${JSON.stringify(token)}`,
          },
          body: JSON.stringify({
            userId: userAttributes.user_uuid,
            variantId,
          }),
        })

        if (!response.ok) {
          const errorData: unknown = await response.json()
          console.error('Error removing from cart:', errorData)
          const errorMessage = (errorData as { message: string }).message
          throw new Error(`Error removing from cart: ${errorMessage}`)
        }

        await fetchCart()
        await showToast('Item removed from cart', {
          type: 'success',
        })
      } else {
        const localCart = JSON.parse(
          localStorage.getItem('cart') || '[]'
        ) as CartItem[]
        const updatedCart = localCart.filter(
          (item) => item.variant_id !== variantId
        )

        localStorage.setItem('cart', JSON.stringify(updatedCart))
        setCart(updatedCart)

        await showToast('Removed from cart.', {
          type: 'success',
        })
      }
    } catch (error) {
      console.error('Error removing product from cart:', error)
      await showToast('Failed to remove product', {
        type: 'caution',
      })
    } finally {
      setLoadingSummary(false)
    }
  }

  const handleQuantityChange = async (
    variantId: number,
    newQuantity: number
  ) => {
    setLoadingSummary(true)
    try {
      if (userAttributes) {
        const token = await getToken()
        if (!token) {
          throw new Error(INVALID_JWT_TOKEN_ERROR)
        }

        const response = await fetchWithCsrf('/api/cart', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${JSON.stringify(token)}`,
          },
          body: JSON.stringify({
            userId: userAttributes.user_uuid,
            variantId,
            quantity: newQuantity,
          }),
        })

        if (!response.ok) {
          const errorData: unknown = await response.json()
          console.error('Error updating quantity:', errorData)
          throw new Error(
            `Error updating quantity: ${(errorData as { message: string }).message}`
          )
        }

        await fetchCart()
        await showToast(`Item quantity updated to ${newQuantity}`, {
          type: 'success',
        })
      } else {
        const localCart = JSON.parse(
          localStorage.getItem('cart') || '[]'
        ) as CartItem[]
        const updatedCart = localCart.map((item) =>
          item.variant_id === variantId
            ? { ...item, quantity: newQuantity }
            : item
        )

        localStorage.setItem('cart', JSON.stringify(updatedCart))
        setCart(updatedCart)

        await showToast(`Item quantity updated to ${newQuantity}`, {
          type: 'success',
        })
      }
    } catch (error) {
      console.error('Error updating product quantity:', error)
      await showToast('Failed to update product quantity', {
        type: 'caution',
      })
    } finally {
      setLoadingSummary(false)
    }
  }

  const syncLocalCartWithServer = useCallback(async () => {
    if (userAttributes && !isSyncing) {
      setIsSyncing(true)
      try {
        const localCart = JSON.parse(
          localStorage.getItem('cart') || '[]'
        ) as CartItem[]

        const token = await getToken()
        if (!token) {
          throw new Error(INVALID_JWT_TOKEN_ERROR)
        }

        await fetchWithCsrf('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${JSON.stringify(token)}`,
          },
          body: JSON.stringify({ cart: localCart }),
        })

        localStorage.removeItem('cart')
        await fetchCart()
      } catch (error) {
        console.error('Error syncing cart with server:', error)
      } finally {
        setIsSyncing(false)
      }
    }
  }, [userAttributes, isSyncing, fetchCart, getToken])

  const clearCart = async () => {
    setLoadingSummary(true)
    try {
      if (userAttributes) {
        const token = await getToken()
        if (!token) {
          throw new Error(INVALID_JWT_TOKEN_ERROR)
        }

        const response = await fetch('/api/cart', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${JSON.stringify(token)}`,
          },
          body: JSON.stringify({ userId: userAttributes.user_uuid }),
        })

        if (!response.ok) {
          const errorData: unknown = await response.json()
          console.error('Error clearing cart:', errorData)
          throw new Error(
            `Error clearing cart: ${(errorData as { message: string }).message}`
          )
        }
      } else {
        localStorage.removeItem('cart')
      }
      setCart([]) // Clear the cart state
      await showToast('Cart cleared', {
        type: 'success',
      })
    } catch (error) {
      console.error('Error clearing cart:', error)
      await showToast('Failed to clear cart', {
        type: 'caution',
      })
    } finally {
      setLoadingSummary(false)
    }
  }

  useEffect(() => {
    if (!hasSyncedCart.current) {
      void syncLocalCartWithServer()
      hasSyncedCart.current = true
    }
  }, [userAttributes, syncLocalCartWithServer])

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        setCart,
        loadingSummary,
        setLoadingSummary,
        handleQuantityChange,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
