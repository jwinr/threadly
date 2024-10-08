'use client'

import React, { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import { UserContext } from '@/context/UserContext'
import useCheckLoggedInUser from 'src/hooks/useCheckLoggedInUser'
import styled from 'styled-components'
import getStripe from 'src/utils/get-stripejs'
import { Elements } from '@stripe/react-stripe-js'
import LoaderDots from '@/components/Loaders/LoaderDots'
import Breadcrumb from '@/components/Elements/Breadcrumb'
import Button from '@/components/Elements/Button'

const PaymentPageContainer = styled.div`
  margin: 0 auto;
  padding: 0 16px;
  gap: 20px;
  display: flex;
  flex-direction: column;
`

const Container = styled.div`
  margin: 0 auto;
  padding: 20px;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Header = styled.h1`
  color: var(--sc-color-title);
  font-size: 29px;
  font-weight: bold;
  margin-bottom: 8px;
`

const PaymentMethodsList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
`

const PaymentMethodItem = styled.li`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const NoSavedMethodsCard = styled.div`
  background: #ffffff;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  width: 100%;
  margin-bottom: 20px;
`

const RemoveCard = styled.button`
  padding: 10px 20px;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    background-color: #c0c0c0;
    cursor: not-allowed;
  }
`

interface PaymentMethod {
  id: string
  card: {
    brand: string
    last4: string
  }
}

const Payments: React.FC = () => {
  const { fetchPaymentMethods } = useContext(UserContext) as {
    fetchPaymentMethods: (customerId: string) => Promise<PaymentMethod[]>
  }
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const checkingUser = useCheckLoggedInUser()

  useEffect(() => {
    if (!checkingUser) {
      fetchSavedPaymentMethods()
    }
  }, [checkingUser])

  const fetchSavedPaymentMethods = async () => {
    setLoading(true)

    try {
      // Fetch the Stripe customer ID from the backend
      const customerResponse = await fetch('/api/stripe-id', {
        method: 'GET',
      })

      if (!customerResponse.ok) {
        console.error('Failed to fetch Stripe customer ID')
        setLoading(false)
        return
      }

      const { stripe_customer_id: customer } = await customerResponse.json()

      if (customer) {
        const methods = await fetchPaymentMethods(customer)
        setPaymentMethods(methods)
      } else {
        console.log('Customer is not defined')
      }
    } catch (error) {
      console.error('Error fetching saved payment methods:', error)
    }

    setLoading(false)
  }

  const removePaymentMethod = (methodId: string) => {
    // TODO: Implement logic to perform after removing the card
    console.log('TODO: ', methodId)
  }

  return (
    <>
      <Head>
        <title>Payments | Nexari</title>
      </Head>
      {checkingUser || loading ? (
        <LoaderDots />
      ) : (
        <>
          <Breadcrumb />
          <PaymentPageContainer>
            <Header>Payments</Header>
            <Container>
              {!loading && paymentMethods.length === 0 ? (
                <NoSavedMethodsCard>
                  <p>No saved payment methods found.</p>
                  <Button
                    href="/account/payments/new"
                    target="_self"
                    size="medium"
                    type="primary"
                  >
                    Add payment card
                  </Button>
                </NoSavedMethodsCard>
              ) : (
                <PaymentMethodsList>
                  {paymentMethods.map((method) => (
                    <PaymentMethodItem key={method.id}>
                      <span>
                        {method.card.brand.toUpperCase()} ending in{' '}
                        {method.card.last4}
                      </span>
                      <RemoveCard
                        onClick={() => removePaymentMethod(method.id)}
                      >
                        Remove
                      </RemoveCard>
                    </PaymentMethodItem>
                  ))}
                </PaymentMethodsList>
              )}
            </Container>
          </PaymentPageContainer>
        </>
      )}
    </>
  )
}

const WrappedPayments: React.FC = () => (
  <Elements stripe={getStripe()}>
    <Payments />
  </Elements>
)

export default WrappedPayments
