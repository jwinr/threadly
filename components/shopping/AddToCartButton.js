import React, { useContext, useState } from "react"
import { CartContext } from "../../context/CartContext"
import styled from "styled-components"
import LoaderSpin from "../loaders/LoaderSpin"
import PropFilter from "../../utils/PropFilter"

const Button = styled.button`
  position: relative; // Allow the loader to be positioned absolutely within the button
  justify-content: center;
  background-color: var(--sc-color-blue);
  color: white;
  padding: 10px 20px;
  border: none;
  min-height: 44px;
  border-radius: 5px;
  display: flex;
  font-weight: bold;
  align-items: center;
  transition: background 0.3s;

  &:hover {
    background-color: var(--sc-color-dark-blue);
  }

  &:focus-visible {
    background-color: var(--sc-color-dark-blue);
  }

  &:disabled {
    cursor: pointer;
  }
`

const ButtonText = styled(PropFilter("span")(["loading"]))`
  opacity: ${({ loading }) => (loading ? 0.2 : 1)};
  transition: opacity 0.3s ease-in-out;
`

const AddToCartButton = ({ productId, quantity = 1, productName }) => {
  const { addToCart } = useContext(CartContext)
  const [loading, setLoading] = useState(false)

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      await Promise.all([addToCart(productId, quantity), delay(1000)]) // Using a minimum delay to make sure the loading state is temporarily visible even if the API request is quick, since it could result in a rapid UI change
    } catch (error) {
      console.error("Failed to add to cart", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={loading}
      aria-label={`Add ${productName} to cart`}
    >
      <ButtonText loading={loading}>Add to cart</ButtonText>
      <LoaderSpin loading={loading} />
    </Button>
  )
}

export default AddToCartButton
