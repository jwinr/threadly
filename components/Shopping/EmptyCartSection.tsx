import React from 'react'
import styled from 'styled-components'
import EmptyCartImg from '@/public/images/icons/emptyCart.svg'
import Button from '@/components/Elements/Button'

interface EmptyCartSectionProps {
  userAttributes: unknown
}

const EmptyCartContainer = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 6px;
  box-shadow:
    rgba(0, 0, 0, 0.04) 0px 6px 12px 4px,
    rgba(0, 0, 0, 0.04) 0px 4px 10px 2px,
    rgba(0, 0, 0, 0.06) 0px 2px 8px,
    rgba(0, 0, 0, 0.04) 0px 2px 4px;
  width: 100%;
  flex-direction: column;
  align-items: center;
`

const EmptyContents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  a {
    width: 100%;
  }

  span {
    margin-bottom: 20px;
  }

  button {
    width: 250px;
  }
`

const EmptyHeader = styled.h1`
  font-size: 29px;
  font-weight: bold;
  color: var(--sc-color-title);
  margin: 8px 0;
`

const EmptyWrapper = styled.div`
  display: flex;
  margin: 25px 0;
  height: 100px;

  svg {
    width: 100%;
    height: 100%;
  }
`

const EmptyCartSection: React.FC<EmptyCartSectionProps> = ({
  userAttributes,
}) => {
  return (
    <EmptyCartContainer>
      <EmptyContents>
        <EmptyHeader>Your cart is empty</EmptyHeader>
        {userAttributes ? ( // User is logged in, but has an empty cart
          <>
            <span>Check out what we&rsquo;re featuring now!</span>
            <Button
              href="/"
              target="_self"
              size="large"
              type="primary"
              aria-label="Go to homepage"
            >
              Go to homepage
            </Button>
          </>
        ) : (
          <>
            <span>Have an account? Sign in to see your cart</span>
            <Button
              href="/login"
              type="primary"
              size="large"
              aria-label="Sign in"
            >
              Sign in
            </Button>
          </>
        )}
        <EmptyWrapper>
          <EmptyCartImg />
        </EmptyWrapper>
      </EmptyContents>
    </EmptyCartContainer>
  )
}

export default EmptyCartSection
