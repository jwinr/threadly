import React, { useState, useEffect, useContext } from "react"
import CartLogo from "../../public/images/icons/cart.svg"
import styled from "styled-components"
import { CartContext } from "../../context/CartContext"

const Container = styled.a`
  position: relative;
  display: flex;
  width: fit-content;
  height: 100%;

  @media (max-width: 768px) {
    order: 3; // Top-right element on mobile layouts
  }
`

const Button = styled.button`
  font-size: 15px;
  cursor: pointer;
  color: var(--sc-color-text);
  padding: 7px 10px;
  border-radius: 10px;
  position: relative;
  display: flex;
  height: 100%;
  align-items: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--sc-color-white-highlight);
  }

  @media (max-width: 768px) {
    height: 44px;
    width: 44px;
    padding: 0;
    justify-content: center;

    &:active {
      background-color: var(--sc-color-white-highlight);
    }

    &:hover {
      background-color: transparent;
    }
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
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Wrapper = styled.div`
  justify-content: center;
  display: grid;

  svg {
    width: 24px;
  }

  @media (max-width: 768px) {
    width: 26px;
  }
`

function CartIcon() {
  const { cart } = useContext(CartContext)

  // Calculate total quantity
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Dynamically change the label based on 1 or more items
  const ariaLabel = `Cart, ${totalQuantity} ${
    totalQuantity === 1 ? "item" : "items"
  }`

  return (
    <Container href="/cart" tabIndex="-1" aria-label={ariaLabel}>
      <Button aria-label={ariaLabel}>
        <Wrapper>
          <CartLogo />
        </Wrapper>
      </Button>
      {totalQuantity > 0 && <CartCircle>{totalQuantity}</CartCircle>}
    </Container>
  )
}

export default CartIcon
