import React, { useContext, useState } from "react"
import { CartContext } from "@/context/CartContext"
import styled from "styled-components"
import LoaderSpin from "@/components/loaders/LoaderSpin"
import PropFilter from "@/utils/PropFilter"
import { useToast } from "@/context/ToastContext"

const Button = styled.button`
  position: relative; // Allow the loader to be positioned absolutely within the button
  justify-content: center;
  background-color: var(--sc-color-blue);
  color: white;
  --s1-keyline: #4164df;
  padding: 10px 20px;
  box-shadow: var(--s1-top-shadow),
    var(--s1-keyline) 0 0 0 var(--s1-keyline-width), var(--s1-focus-ring),
    var(--s1-box-shadow);
  transition-property: background-color, box-shadow;
  transition-timing-function: cubic-bezier(0, 0.09, 0.4, 1);
  transition-duration: 150ms;
  border: none;
  min-height: 44px;
  border-radius: 6px;
  --s1-focus-ring: 0 0 0 0 transparent;
  outline: none;
  display: flex;
  font-weight: bold;
  align-items: center;
  transition: all 0.3s;

  &:hover {
    transition-duration: 0ms;
  }

  &:hover:not(:active) {
    --s1-keyline: #1c54b2;
    border-color: #4164df;
  }

  &:active {
    border-color: #0a3885;
    background-color: #234bd9;
    color: #d0daff;
    --s1-keyline: #0a3885;
    --s1-top-shadow: 0px -1px 1px 0px rgba(16, 17, 26, 0.16);
  }

  &:focus {
    --s1-focus-ring: 0 0 0 4px rgba(1, 150, 237, 0.36);
    outline: 1px solid transparent;
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
    pointer-events: none;
  }
`

const ButtonText = styled(PropFilter("span")(["loading"]))`
  opacity: ${({ loading }) => (loading ? 0.2 : 1)};
  transition: opacity 0.3s ease-in-out;
`

const AddToCartButton = ({ productId, quantity = 1, productName }) => {
  const { addToCart } = useContext(CartContext)
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      await Promise.all([addToCart(productId, quantity), delay(1000)]) // Using a minimum delay to make sure the loading state is temporarily visible even if the API request is quick, since it could result in a rapid UI change
    } catch (error) {
      console.error("Failed to add to cart", error)
      showToast("Failed to add product", {
        type: "caution",
      })
    } finally {
      setLoading(false)
      showToast("Item added to cart", {
        type: "success",
      })
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
