'use client'

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { UserContext } from '@/context/UserContext'

interface Favorite {
  product_id: string
  product_slug?: string
  product_image_url?: string
  product_name?: string
  product_price?: number
  product_sale_price?: number
  reviews?: Array<{
    rating: number
    review_text: string
  }>
}

interface FavoritesContextType {
  favorites: Favorite[]
  addFavorite: (userId: string, productId: string) => Promise<void>
  removeFavorite: (userId: string, productId: string) => Promise<void>
}

// Initialize the context with a default value
const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
)

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

interface FavoritesProviderProps {
  children: ReactNode
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const { userAttributes } = useContext(UserContext)
  const hasFetchedFavorites = useRef(false)
  const previousUserUuid = useRef<string | null>(null)

  useEffect(() => {
    const fetchFavorites = async () => {
      if (
        userAttributes &&
        userAttributes.user_uuid &&
        !hasFetchedFavorites.current &&
        userAttributes.user_uuid !== previousUserUuid.current
      ) {
        try {
          previousUserUuid.current = userAttributes.user_uuid
          const response = await fetch(
            `/api/favorites?id=${userAttributes.user_uuid}`
          )
          const data = (await response.json()) as Favorite[]
          setFavorites(Array.isArray(data) ? data : [])
          hasFetchedFavorites.current = true
        } catch (error) {
          console.error('Error fetching favorites:', error)
        }
      }
    }

    void fetchFavorites()
  }, [userAttributes])

  const addFavorite = async (userId: string, productId: string) => {
    if (!userAttributes?.user_uuid) {
      return
    }
    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userAttributes.user_uuid, productId }),
      })
      setFavorites((prevFavorites) => [
        ...prevFavorites,
        { product_id: productId },
      ])
    } catch (error) {
      console.error('Error adding to favorites:', error)
    }
  }

  const removeFavorite = async (userId: string, productId: string) => {
    if (!userAttributes?.user_uuid) {
      return
    }
    try {
      await fetch('/api/favorites', {
        method: 'DELETE',
        body: JSON.stringify({ id: userAttributes.user_uuid, productId }),
      })
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.product_id !== productId)
      )
    } catch (error) {
      console.error('Error removing from favorites:', error)
    }
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}
