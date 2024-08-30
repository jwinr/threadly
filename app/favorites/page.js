import React, { useState, useEffect, useContext } from "react"
import { UserContext } from "../../context/UserContext"
import Head from "next/head"
import styled from "styled-components"
import Link from "next/link"
import LoaderDots from "../../components/loaders/LoaderDots"
import useCheckLoggedInUser from "../../hooks/useCheckLoggedInUser"

const FavoritesContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`

const Header = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
`

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
`

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
`

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
`

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
`

const RemoveButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #ff3333;
  }
`

const Favorites = () => {
  const { userAttributes } = useContext(UserContext)
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const checkingUser = useCheckLoggedInUser()

  useEffect(() => {
    if (!checkingUser) {
      fetch(`/api/favorites?cognitoSub=${userAttributes.sub}`, {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setFavorites(data)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching favorites:", error)
          setLoading(false)
        })
    }
  }, [checkingUser])

  const removeFromFavorites = (productId) => {
    if (userAttributes) {
      fetch(`/api/favorites`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({
          cognitoSub: userAttributes.sub,
          productId,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          // Update the favorites state to reflect the item removal
          setFavorites((currentFavorites) =>
            currentFavorites.filter((item) => item.product_id !== productId)
          )
        })
        .catch((error) => {
          console.error("Error removing item from favorites:", error)
        })
    }
  }

  return (
    <>
      <Head>
        <title>Favorites | TechNexus</title>
        <meta
          name="description"
          content="Save your favorites list. Once you've favorited items that you love or want to keep track of, they will be shown here."
        />
      </Head>
      <FavoritesContainer>
        {loading ? (
          <LoaderDots />
        ) : (
          <>
            <Header>Your favorites</Header>
            {favorites.length === 0 ? (
              <p>
                Your favorites are empty.{" "}
                <Link href="/">Continue shopping</Link>
              </p>
            ) : (
              favorites.map((product) => (
                <ProductItem key={product.product_id}>
                  <ProductInfo>
                    <ProductImage
                      src={product.product_image_url}
                      alt={product.product_name}
                    />
                    <ProductDetails>
                      <h3>{product.product_name}</h3>
                      <p>{product.product_price}</p>
                    </ProductDetails>
                  </ProductInfo>
                  <RemoveButton
                    onClick={() => removeFromFavorites(product.product_id)}
                  >
                    Remove
                  </RemoveButton>
                </ProductItem>
              ))
            )}
          </>
        )}
      </FavoritesContainer>
    </>
  )
}

export default Favorites
