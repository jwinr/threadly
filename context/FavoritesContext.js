"use client"

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react"
import PropTypes from "prop-types"
import { UserContext } from "@/context/UserContext"

const FavoritesContext = createContext()

export const useFavorites = () => useContext(FavoritesContext)

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])
  const { userAttributes } = useContext(UserContext)
  const hasFetchedFavorites = useRef(false)
  const previousUserUuid = useRef(null)

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
            `/api/favorites?id=${userAttributes.user_uuid}`,
            {
              headers: {
                "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
              },
            }
          )
          const data = await response.json()
          setFavorites(Array.isArray(data) ? data : [])
          hasFetchedFavorites.current = true
        } catch (error) {
          console.error("Error fetching favorites:", error)
        }
      }
    }

    fetchFavorites()
  }, [userAttributes])

  const addFavorite = async (productId) => {
    if (!userAttributes?.user_uuid) return
    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ id: userAttributes.user_uuid, productId }),
      })
      setFavorites((prevFavorites) => [
        ...prevFavorites,
        { product_id: productId },
      ])
    } catch (error) {
      console.error("Error adding to favorites:", error)
    }
  }

  const removeFavorite = async (productId) => {
    if (!userAttributes?.user_uuid) return
    try {
      await fetch("/api/favorites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ id: userAttributes.user_uuid, productId }),
      })
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.product_id !== productId)
      )
    } catch (error) {
      console.error("Error removing from favorites:", error)
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

FavoritesProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
