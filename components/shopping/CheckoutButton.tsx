import React, { useState, useContext, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import LoaderSpin from '@/components/Loaders/LoaderSpin'
import { useToast } from '@/context/ToastContext'
import { UserContext } from '@/context/UserContext'

interface ButtonProps {
  $loading?: boolean
  disabled?: boolean
}

const Button = styled.button<ButtonProps>`
  position: relative;
  justify-content: center;
  background-color: var(--sc-color-carnation);
  color: white;
  padding: 0px 16px;
  min-height: 44px;
  border-radius: 4px;
  display: flex;
  font-weight: 500;
  width: 100%;
  align-items: center;
  box-shadow:
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
    rgb(230 0 0 / 80%) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
  transition: all 240ms;
  cursor: ${({ $loading, disabled }) =>
    $loading || disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $loading, disabled }) => ($loading || disabled ? 0.6 : 1)};
  pointer-events: ${({ $loading, disabled }) =>
    $loading || disabled ? 'none' : 'auto'};

  &:focus {
    box-shadow:
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(58, 151, 212, 0.36) 0px 0px 0px 4px,
      rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
      rgb(43 121 255 / 80%) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
  }
`

const ButtonText = styled.span<ButtonProps>`
  opacity: ${({ $loading }) => ($loading ? 0 : 1)};
  transition: opacity 0.24s ease-in-out;
`

interface CheckoutButtonProps {
  disabled?: boolean
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ disabled }) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()
  const { userAttributes } = useContext(UserContext)

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  const handleCheckout = useCallback(async () => {
    if (disabled) {
      return
    }

    setLoading(true)
    try {
      if (!userAttributes) {
        // If the user is not logged in, redirect to the login page
        router.push('/login')
        return
      }

      await delay(1000) // Simulate loading delay
      router.push('/checkout')
    } catch (error) {
      console.error('Failed to proceed to checkout', error)
      showToast('Failed to proceed to checkout', { type: 'caution' })
    } finally {
      setLoading(false)
    }
  }, [disabled, router, userAttributes, showToast])

  return (
    <Button
      onClick={handleCheckout}
      $loading={loading}
      disabled={disabled}
      aria-label={
        userAttributes ? 'Proceed to checkout' : 'Sign in to check out'
      }
      aria-disabled={disabled}
    >
      <ButtonText $loading={loading}>
        {userAttributes ? 'Checkout' : 'Sign in to check out'}
      </ButtonText>
      <LoaderSpin loading={loading} />
    </Button>
  )
}

export default CheckoutButton
