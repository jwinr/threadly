import React, { useContext } from "react"
import CartLogo from "../../public/images/icons/cart.svg"
import styled from "styled-components"
import { CartContext } from "../../context/CartContext"

const Container = styled.a`
  position: relative;
  display: flex;
  width: fit-content;
  height: 100%;

  &:hover,
  &:active {
    > button {
      background-color: var(--sc-color-white-highlight);
    }
  }

  @media (max-width: 768px) {
    order: 3; // Top-right element on mobile layouts
  }
`

const Button = styled.button`
  font-size: 15px;
  cursor: pointer;
  color: var(--sc-color-text);
  padding: 7px 12px;
  border-radius: 10px;
  position: relative;
  display: flex;
  height: 100%;
  align-items: center;
  transition: background-color 0.2s;

  &:focus:not(:focus-visible) {
    --s-focus-ring: 0;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    height: 44px;
    width: 44px;
    padding: 0;
    justify-content: center;
  }
`

const CartCircle = styled.div`
  position: absolute;
  top: 0px;
  right: -1px;
  background-color: var(--sc-color-text);
  color: var(--sc-color-white);
  border-radius: 50%;
  padding: 3px 6px;
  font-size: 10px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  user-select: none;
  pointer-events: none;

  &:hover {
    > button {
      background-color: var(--sc-color-white-highlight);
    }
  }
`

const Wrapper = styled.div`
  justify-content: center;
  display: grid;

  svg > path {
    fill: var(--sc-color-icon);
  }

  @media (max-width: 768px) {
    width: 26px;
  }
`

type CartItem = {
  quantity: number | string // Allow for both numbers and strings
}

const CartIcon: React.FC = () => {
  const { cart } = useContext(CartContext)

  // Calculate total quantity
  const totalQuantity = cart.reduce(
    (sum: number, item: CartItem) => sum + Number(item.quantity),
    0
  )

  // Dynamically change the label based on 1 or more items
  const ariaLabel = `Cart, ${totalQuantity} ${
    totalQuantity === 1 ? "item" : "items"
  }`

  return (
    <Container href="/cart" tabIndex={-1} aria-label={ariaLabel}>
      {totalQuantity > 0 && <CartCircle>{totalQuantity}</CartCircle>}
      <Button aria-label={ariaLabel}>
        <Wrapper>
          <CartLogo />
        </Wrapper>
      </Button>
    </Container>
  )
}

export default CartIcon
