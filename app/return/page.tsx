'use client'

import React, { useEffect, useState, useContext, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { CartContext } from '@/context/CartContext'
import styled from 'styled-components'
import SuccessCheckmark from '@/components/Shopping/SuccessCheckmark'
import useCheckLoggedInUser from '@/hooks/useCheckLoggedInUser'
import Button from '@/components/Elements/Button'
import LoaderDots from '@/components/Loaders/LoaderDots'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  height: 100%;

  @media (max-width: 768px) {
    padding: 0 10px;
  }
`

const SuccessSection = styled.section`
  background: #ffffff;
  padding: 40px;
  border-radius: 8px;
  box-shadow:
    rgba(0, 0, 0, 0.04) 0px 6px 12px 4px,
    rgba(0, 0, 0, 0.04) 0px 4px 10px 2px,
    rgba(0, 0, 0, 0.06) 0px 2px 8px,
    rgba(0, 0, 0, 0.04) 0px 2px 4px;
  text-align: center;
  width: 100%;
  max-width: 50%;
  animation:
    fadeIn 0.2s ease-in-out forwards,
    enter 0.3s 0s forwards;
  animation-fill-mode: forwards, forwards;

  a {
    width: 60%;
  }

  @media (max-width: 768px) {
    padding: 20px;
    max-width: initial;

    button {
      width: 75%;
    }
  }
`

const Message = styled.p`
  font-size: 16px;
  margin: 20px 0;

  @media (max-width: 768px) {
    font-size: 14px;
    margin: 15px 0;
  }
`

const ContactLink = styled.a`
  color: var(--sc-color-blue);

  &:hover {
    color: var(--sc-color-text-hover);
  }

  &:focus {
    box-shadow: var(--sc-shadow-link-focus);
    border-radius: 4px;
  }
`

const ErrorSection = styled(SuccessSection)`
  background: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
`

type CheckoutSessionData = {
  status: string
  customer_email: string
  fulfilled: boolean
}

export default function Return() {
  const router = useRouter()
  const { clearCart } = useContext(CartContext)!
  const [status, setStatus] = useState<string | null>(null)
  const [customerEmail, setCustomerEmail] = useState<string>('')
  const [isCartCleared, setIsCartCleared] = useState<boolean>(false)
  const checkingUser = useCheckLoggedInUser(5000, true)
  const hasCheckedUser = useRef<boolean>(false)

  useEffect(() => {
    if (!hasCheckedUser.current && !checkingUser) {
      hasCheckedUser.current = true
      const queryString = window.location.search
      const urlParams = new URLSearchParams(queryString)
      const sessionId = urlParams.get('session_id')

      if (!sessionId) {
        console.log('No session ID found, redirecting to home.')
        router.push('/')
        return
      }

      fetch(`/api/checkout_sessions?session_id=${sessionId}`, {
        method: 'GET',
      })
        .then((res) => {
          console.log('Checkout session response status:', res.status)
          if (!res.ok) {
            throw new Error('Invalid session')
          }
          return res.json()
        })
        .then(async (data: CheckoutSessionData) => {
          console.log('Checkout session data:', data)
          if (data.status === 'open' || !data.status) {
            throw new Error('Invalid session status')
          }

          setCustomerEmail(data.customer_email)

          // Check if the session has already been fulfilled
          if (data.fulfilled) {
            setStatus('complete')
            if (!isCartCleared) {
              await clearCart()
              setIsCartCleared(true)
            }
          } else {
            // Trigger the fulfillment process
            return fetch(`/api/checkout/fulfill?session_id=${sessionId}`, {
              method: 'GET',
              headers: {
                'x-api-key': process.env.NEXT_PUBLIC_API_KEY!,
              },
            })
          }
        })
        .then((res) => {
          if (!res) {
            throw new Error('Fulfillment response is undefined')
          }

          console.log('Fulfillment response status:', res.status)
          if (!res.ok) {
            throw new Error('Fulfillment failed')
          }
          return res.json()
        })
        .then(async (fulfillmentData: { success: boolean }) => {
          console.log('Fulfillment data:', fulfillmentData)
          if (fulfillmentData.success) {
            setStatus('complete')
            if (!isCartCleared) {
              await clearCart()
              setIsCartCleared(true)
            }
          }
        })
        .catch((error: Error) => {
          console.error('Error occurred:', error.message)
          if (error.message.includes('Invalid session')) {
            setStatus('session_not_found')
          } else if (error.message.includes('Invalid session status')) {
            setStatus('unauthorized')
          } else if (error.message.includes('Fulfillment failed')) {
            setStatus('failed')
          } else {
            setStatus('error')
          }
        })
    }
  }, [router, checkingUser, clearCart, isCartCleared])

  switch (status) {
    case 'complete':
      return (
        <>
          <Container>
            <SuccessSection id="success">
              <SuccessCheckmark />
              <Message>
                We appreciate your business! A confirmation email will be sent
                to {customerEmail}. If you have any questions, please{' '}
                <ContactLink href="/contact-us">contact us</ContactLink>.
              </Message>
              <Button type="primary" size="large" href="/orders">
                Check my orders
              </Button>
            </SuccessSection>
          </Container>
        </>
      )
    case 'pending':
      return (
        <>
          <Container>
            <SuccessSection id="pending">
              <Message>
                Your order is still being processed. Please check back later. If
                you have any questions, please{' '}
                <ContactLink href="/contact-us">contact us</ContactLink>.
              </Message>
            </SuccessSection>
          </Container>
        </>
      )
    case 'failed':
      return (
        <>
          <Container>
            <ErrorSection id="failed">
              <Message>
                We encountered an issue with your order. Please try again or{' '}
                <ContactLink href="/contact-us">contact us</ContactLink> for
                assistance.
              </Message>
            </ErrorSection>
          </Container>
        </>
      )
    case 'session_not_found':
      return (
        <>
          <Container>
            <ErrorSection id="session_not_found">
              <Message>
                The session ID provided is invalid or does not exist. Please{' '}
                <ContactLink href="/contact-us">contact us</ContactLink> for
                assistance.
              </Message>
            </ErrorSection>
          </Container>
        </>
      )
    case 'unauthorized':
      return (
        <>
          <Container>
            <ErrorSection id="unauthorized">
              <Message>
                You are not authorized to view this session. Please{' '}
                <ContactLink href="/contact-us">contact us</ContactLink> if you
                believe this is a mistake.
              </Message>
            </ErrorSection>
          </Container>
        </>
      )
    case 'error':
      return (
        <>
          <Container>
            <ErrorSection id="error">
              <Message>
                An unexpected error occurred. Please{' '}
                <ContactLink href="/contact-us">contact us</ContactLink> for
                assistance.
              </Message>
            </ErrorSection>
          </Container>
        </>
      )
    default:
      return (
        <>
          <LoaderDots />
        </>
      )
  }
}
