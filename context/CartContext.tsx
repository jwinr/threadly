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

export interface CartItem {
  variant_id: string
  quantity: number
  [key: string]: any
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (variantId: string, quantity?: number, isSyncing?: boolean) => Promise<void>
  removeFromCart: (variantId: string) => Promise<void>
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  loadingSummary: boolean
  setLoadingSummary: React.Dispatch<React.SetStateAction<boolean>>
  handleQuantityChange: (variantId: string, newQuantity: number) => Promise<void>
  clearCart: () => Promise<void>
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast()
  const [cart, setCart] = useState<CartItem[]>([])
  const { userAttributes, getToken } = useContext(UserContext)
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const hasSyncedCart = useRef<boolean>(false)

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const fetchProductDetails = async (cartItems: CartItem[]): Promise<CartItem[]> => {
    try {
      const variantIds = cartItems.map((item) => item.variant_id)
      const response = await fetch(`/api/cart?variantIds=${variantIds.join(',')}`, {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY as string,
        },
      })
      const products = await response.json()
      return cartItems.map((item) => ({
        ...item,
        ...products.find((product: any) => product.variant_id === item.variant_id),
      }))
    } catch (error) {
      console.error('Error fetching product details:', error)
      return cartItems
    }
  }

  const fetchCart = async () => {
    if (userAttributes && userAttributes.user_uuid) {
      try {
        console.log('Fetching cart for user:', userAttributes.user_uuid)
        const response = await fetch(`/api/cart?id=${userAttributes.user_uuid}`, {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY as string,
          },
        })
        const data = await response.json()
        const detailedCart = await fetchProductDetails(data)
        setCart(detailedCart)
      } catch (error) {
        console.error('Error fetching cart:', error)
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[]
      if (localCart.length > 0) {
        const detailedCart = await fetchProductDetails(localCart)
        setCart(detailedCart)
      }
    }
  }

  const addToCart = useCallback(
    async (variantId: string, quantity = 1, isSyncing = false) => {
      setLoadingSummary(true)
      try {
        if (userAttributes) {
          const currentCart = await fetchCartDetails()
          const existingItem = currentCart.find((item) => item.variant_id === variantId)
          const currentQuantity = existingItem ? existingItem.quantity : 0
          const newQuantity = currentQuantity + quantity

          let quantityToAdd = quantity
          if (newQuantity > 10) {
            quantityToAdd = 10 - currentQuantity
            if (quantityToAdd <= 0) {
              if (!isSyncing) {
                await delay(1000)
                showToast("Sorry, you've reached the limit for this item", {
                  type: 'caution',
                })
              }
              return
            }
          }

          const token = await getToken()
          if (!token) {
            throw new Error('User is not authenticated')
          }

          const body = JSON.stringify({
            cognitoSub: userAttributes.sub,
            variantId,
            quantity: quantityToAdd,
          })

          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': process.env.NEXT_PUBLIC_API_KEY as string,
              Authorization: `Bearer ${token}`,
            },
            body,
          })

          if (!response.ok) {
            const errorData = await response.json()
            console.error('Error response:', errorData)
            throw new Error(`Error adding to cart: ${errorData.message}`)
          }

          await delay(1000)
          await fetchCart()
          if (!isSyncing) {
            showToast(`Added ${quantityToAdd} item(s) to cart`, {
              type: 'success',
            })
          }
        } else {
          const localCart = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[]
          const existingItem = localCart.find((item) => item.variant_id === variantId)
          const currentQuantity = existingItem ? existingItem.quantity : 0
          const newQuantity = currentQuantity + quantity

          let quantityToAdd = quantity
          if (newQuantity > 10) {
            quantityToAdd = 10 - currentQuantity
            if (quantityToAdd <= 0) {
              if (!isSyncing) {
                showToast("Sorry, you've reached the limit for this item", {
                  type: 'caution',
                })
              }
              return
            }
          }

          if (existingItem) {
            existingItem.quantity += quantityToAdd
          } else {
            localCart.push({
              variant_id: variantId,
              quantity: quantityToAdd,
            })
          }

          localStorage.setItem('cart', JSON.stringify(localCart))
          await fetchCart()
          await delay(1000)
          if (!isSyncing) {
            showToast(`Added ${quantityToAdd} item(s) to cart`, {
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
    [userAttributes, fetchCart, getToken, showToast],
  )

  const removeFromCart = async (variantId: string) => {
    setLoadingSummary(true)
    try {
      if (userAttributes) {
        const token = await getToken()
        if (!token) {
          throw new Error('User is not authenticated')
        }

        await fetch('/api/cart', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY as string,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cognitoSub: userAttributes.sub,
            variantId,
          }),
        })
        await delay(50)
        fetchCart()
        await delay(1000)
        showToast('Item removed from cart', {
          type: 'success',
        })
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[]
        const updatedCart = localCart.filter((item) => item.variant_id !== variantId)
        await delay(1000)
        localStorage.setItem('cart', JSON.stringify(updatedCart))

        const detailedCart = await fetchProductDetails(updatedCart)
        setCart(detailedCart)

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

  const fetchCartDetails = async (): Promise<CartItem[]> => {
    try {
      const response = await fetch(`/api/cart?id=${userAttributes?.user_uuid}`, {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY as string,
        },
      })
      return await response.json()
    } catch (error) {
      console.error('Error fetching cart details:', error)
      return []
    }
  }

  const handleQuantityChange = async (variantId: string, newQuantity: number) => {
    try {
      setLoadingSummary(true)

      const quantity = Number(newQuantity)

      await delay(100)
      setCart((prevCart) =>
        prevCart.map((item) => (item.variant_id === variantId ? { ...item, quantity } : item)),
      )

      await delay(900)

      if (userAttributes) {
        const token = await getToken()
        if (!token) {
          throw new Error('User is not authenticated')
        }

        const body = JSON.stringify({
          cognitoSub: userAttributes.sub,
          variantId,
          quantity: newQuantity,
        })

        await fetch('/api/cart', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY as string,
            Authorization: `Bearer ${token}`,
          },
          body,
        })
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[]
        const updatedCart = localCart.map((item) =>
          item.variant_id === variantId ? { ...item, quantity: newQuantity } : item,
        )
        localStorage.setItem('cart', JSON.stringify(updatedCart))

        // Update the cart state directly after localStorage update
        const detailedCart = await fetchProductDetails(updatedCart)
        setCart(detailedCart)
      }

      showToast(`Item quantity updated to ${newQuantity}`, {
        type: 'success',
      })
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
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[]

        // Fetch the current cart from the server
        const currentServerCart = await fetchCartDetails()

        for (const item of localCart) {
          const existingItem = currentServerCart.find(
            (cartItem) => cartItem.variant_id === item.variant_id,
          )
          const currentQuantity = existingItem ? existingItem.quantity : 0
          const newTotalQuantity = currentQuantity + item.quantity

          let quantityToAdd = item.quantity
          if (newTotalQuantity > 10) {
            quantityToAdd = 10 - currentQuantity
          }

          if (quantityToAdd > 0) {
            await addToCart(item.variant_id, quantityToAdd, true)
          }
        }

        localStorage.removeItem('cart')
      } catch (error) {
        console.error('Error syncing cart with server:', error)
      } finally {
        setIsSyncing(false)
      }
    }
  }, [userAttributes, isSyncing, fetchCartDetails, addToCart])

  const clearCart = async () => {
    setLoadingSummary(true)
    try {
      if (userAttributes) {
        const token = await getToken()
        if (!token) {
          throw new Error('User is not authenticated')
        }

        await fetch('/api/cart', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY as string,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cognitoSub: userAttributes.sub }),
        })
      } else {
        localStorage.removeItem('cart')
      }
      setCart([]) // Clear the cart state
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