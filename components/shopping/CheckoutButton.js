import React, { useState } from "react"
import { useRouter } from "next/router"
import styled from "styled-components"
import LoaderSpin from "../loaders/LoaderSpin"
import PropFilter from "../../utils/PropFilter"

const Button = styled(PropFilter("button")(["loading"]))`
  position: relative;
  justify-content: center;
  background-color: var(--sc-color-button-blue);
  color: white;
  padding: 0px 16px;
  min-height: 44px;
  border-radius: 4px;
  display: flex;
  font-weight: 500;
  width: 100%;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px, rgb(0 116 230 / 80%) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
  transition: all 240ms;
  cursor: ${({ loading }) => (loading ? "default" : "pointer")};
  opacity: ${({ loading }) => (loading ? "0.5" : "1")};
  pointer-events: ${({ loading }) => (loading ? "none" : "auto")};

  &:focus {
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(58, 151, 212, 0.36) 0px 0px 0px 4px,
      rgba(0, 0, 0, 0.12) 0px 1px 1px 0px, rgb(43 121 255 / 80%) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
  }
`

const ButtonText = styled(PropFilter("span")(["loading"]))`
  opacity: ${({ loading }) => (loading ? 0 : 1)};
  transition: opacity 0.24s ease-in-out;
`

const CheckoutButton = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const handleCheckout = async () => {
    setLoading(true)
    try {
      await delay(1000) // Simulate loading delay
      router.push("/checkout")
    } catch (error) {
      console.error("Failed to proceed to checkout", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      loading={loading}
      aria-label="Proceed to checkout"
    >
      <ButtonText loading={loading}>Checkout</ButtonText>
      <LoaderSpin loading={loading} />
    </Button>
  )
}

export default CheckoutButton
