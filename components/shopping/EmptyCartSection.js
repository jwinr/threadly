import React from "react"
import styled from "styled-components"
import Image from "next/image"
import EmptyCartImg from "../../public/images/empty_cart.png"
import { CartContainer } from "../../components/shopping/CartStyles"
import CartProductCard from "./CartProductCard"

const EmptyCartContainer = styled.div`
  margin: 16px;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 6px 12px 4px,
    rgba(0, 0, 0, 0.04) 0px 4px 10px 2px, rgba(0, 0, 0, 0.06) 0px 2px 8px,
    rgba(0, 0, 0, 0.04) 0px 2px 4px;
  width: 100%;
`

const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  padding: 50px 0;
  margin: 50px auto;
`

const RedirectButton = styled.button`
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: var(--sc-color-white);
  border: medium;
  font-weight: bold;
  min-height: 44px;
  padding: 0px 16px;
  max-width: 300px;
  width: 100%;
  text-align: center;
  background-color: var(--sc-color-blue);
  transition: background-color 0.3s;
  margin-top: 16px;
  margin-bottom: 16px;

  &:hover {
    background-color: var(--sc-color-dark-blue);
  }

  &:active {
    background-color: var(--sc-color-dark-blue);
  }

  &:focus-visible {
    background-color: var(--sc-color-dark-blue);
  }
`

const EmptyHeader = styled.h1`
  font-size: 29px;
  font-weight: bold;
  margin-bottom: 8px;
`

const EmptyWrapper = styled.div`
  display: flex;
  margin-top: 50px;
  height: 150px;

  img {
    width: 100%;
    height: 100%;
  }
`

const TitleWrapper = styled.div`
  -webkit-box-align: center;
  align-items: center;
  display: flex;
  min-height: 49px;
  width: 100%;
`

const Header = styled.h1`
  font-size: 29px;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--sc-color-title);
`

const FavoritesWrapper = styled.div`
  button {
    min-height: 32px;
    width: fit-content;
    font-size: 12px;
    order: 2;
  }

  @media (min-width: 0) {
    margin-left: initial;
    flex-basis: 100%;
    max-width: 100%;
  }

  @media (min-width: 992px) {
    margin-left: initial;
    flex-basis: 75%;
    max-width: 75%;
  }
`

const EmptyCartSection = ({
  userAttributes,
  handleSignIn,
  handleHomePage,
  favorites,
}) => {
  return (
    <>
      <EmptyCartContainer>
        <EmptyCart>
          <EmptyHeader>Your cart is empty</EmptyHeader>
          {userAttributes ? ( // User is logged in, but has an empty cart
            <>
              <span>Check out what we're featuring now!</span>
              <RedirectButton onClick={handleHomePage} type="button">
                Go to homepage
              </RedirectButton>
            </>
          ) : (
            <>
              <span>Have an account? Sign in to see your cart</span>
              <RedirectButton onClick={handleSignIn} type="button">
                Sign in
              </RedirectButton>
            </>
          )}
          <EmptyWrapper>
            <Image
              src={EmptyCartImg}
              alt="Your cart is empty"
              width="500"
              height="500"
              priority={true}
            />
          </EmptyWrapper>
        </EmptyCart>
      </EmptyCartContainer>
      {favorites.length > 0 && (
        <FavoritesWrapper>
          <TitleWrapper>
            <Header>Favorites</Header>
          </TitleWrapper>
          <CartContainer>
            {favorites.map((item) => (
              <CartProductCard key={item.product_id} item={item} />
            ))}
          </CartContainer>
        </FavoritesWrapper>
      )}
    </>
  )
}

export default EmptyCartSection
