'use client'

import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import getStripe from '@/utils/get-stripejs'
import styled from 'styled-components'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { UserContext } from '@/context/UserContext'

const CheckoutWrapper = styled.div`
  position: relative;
  padding: 25px 10px;
`

interface UserAttributes {
  stripe_customer_id?: string
}

export default function NewPayment() {
  const { userAttributes } = useContext<{ userAttributes?: UserAttributes }>(UserContext)
  const router = useRouter()
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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
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
