'use client'

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import styled from 'styled-components'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { UserContext } from '@/context/UserContext'
import getStripe from '@/utils/get-stripejs'

const CheckoutWrapper = styled.div`
  position: relative;
  padding: 25px 10px;
`

export default function NewPayment() {
  const { userAttributes } = useContext(UserContext)
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(false)

  useEffect(() => {
    if (userAttributes) {
      setIsUserLoaded(true)
    }
  }, [userAttributes])

  const fetchClientSecret = useCallback(async (): Promise<string> => {
    try {
      if (!isUserLoaded) {
        console.log('Waiting for user')
        return ''
      }

      const customer = userAttributes?.stripe_customer_id
      if (!customer) {
        console.log('Customer is not defined')
        return ''
      }

      const response = await fetch('/api/account/payments/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
        },
        body: JSON.stringify({ customer }),
      })

      const data: { clientSecret?: string; error?: string } =
        (await response.json()) as { clientSecret?: string; error?: string }

      if (!response.ok) {
        throw new Error(
          (data.error as string) || 'Failed to create checkout session'
        )
      }

      return data.clientSecret || ''
    } catch (error) {
      console.error('Error fetching client secret:', error)
      return ''
    }
  }, [isUserLoaded, userAttributes])

  const options = useMemo(() => ({ fetchClientSecret }), [fetchClientSecret])

  return (
    <>
      <CheckoutWrapper id="checkout">
        {isUserLoaded && (
          <>
            <EmbeddedCheckoutProvider stripe={getStripe()} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </>
        )}
      </CheckoutWrapper>
    </>
  )
}
