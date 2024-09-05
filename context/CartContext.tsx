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

export interface CartItem {
  variant_id: number
  quantity: number
  [key: string]: unknown
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

  const fetchCart = async () => {
    if (userAttributes && userAttributes.user_uuid) {
      try {
        const response = await fetch(`/api/cart?id=${userAttributes.user_uuid}`)
        const data = await response.json()
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
  }

  const addToCart = useCallback(
    async (variantId: number, quantity = 1, isSyncing = false) => {
      setLoadingSummary(true)
      try {
        if (userAttributes) {
          const token = await getToken()
          if (!token) {
            throw new Error(INVALID_JWT_TOKEN_ERROR)
          }

          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId: userAttributes.user_uuid,
              variantId,
              quantity,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            console.error('Error adding to cart:', errorData)
            throw new Error(`Error adding to cart: ${errorData.message}`)
          }

          await fetchCart()
          if (!isSyncing) {
            showToast(`Added ${quantity} item(s) to cart`, {
              type: 'success',
            })
          }
        } else {
          const localCart = JSON.parse(
            localStorage.getItem('cart') || '[]'
          ) as CartItem[]
          const existingItem = localCart.find(
            (item) => item.variant_id === variantId
          )

          if (existingItem) {
            existingItem.quantity += quantity
          } else {
            localCart.push({
              variant_id: variantId,
              quantity,
            })
          }

          localStorage.setItem('cart', JSON.stringify(localCart))
          await fetchCart()
          if (!isSyncing) {
            showToast(`Added ${quantity} item(s) to cart`, {
              type: 'success',
            })
          }
        }
      } catch (error) {
        console.error('Error adding to cart:', error)
        showToast('Failed to add product', {
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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: userAttributes.user_uuid,
            variantId,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error('Error removing from cart:', errorData)
          throw new Error(`Error removing from cart: ${errorData.message}`)
        }

        await fetchCart()
        showToast('Item removed from cart', {
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

        showToast('Removed from cart.', {
          type: 'success',
        })
      }
    } catch (error) {
      console.error('Error removing product from cart:', error)
      showToast('Failed to remove product', {
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

        const response = await fetch('/api/cart', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: userAttributes.user_uuid,
            variantId,
            quantity: newQuantity,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error('Error updating quantity:', errorData)
          throw new Error(`Error updating quantity: ${errorData.message}`)
        }

        await fetchCart()
        showToast(`Item quantity updated to ${newQuantity}`, {
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

        showToast(`Item quantity updated to ${newQuantity}`, {
          type: 'success',
        })
      }
    } catch (error) {
      console.error('Error updating product quantity:', error)
      showToast('Failed to update product quantity', {
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

        await fetch('/api/cart/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: userAttributes.user_uuid }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error('Error clearing cart:', errorData)
          throw new Error(`Error clearing cart: ${errorData.message}`)
        }
      } else {
        localStorage.removeItem('cart')
      }
      setCart([]) // Clear the cart state
      showToast('Cart cleared', {
        type: 'success',
      })
    } catch (error) {
      console.error('Error clearing cart:', error)
      showToast('Failed to clear cart', {
        type: 'caution',
      })
    } finally {
      setLoadingSummary(false)
    }
  }

  useEffect(() => {
    if (!hasSyncedCart.current) {
      syncLocalCartWithServer()
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
