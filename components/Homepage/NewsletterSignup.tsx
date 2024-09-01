'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'
import styled, { keyframes } from 'styled-components'
import PropFilter from '@/utils/PropFilter'
import Button from '@/components/Elements/Button'

const formFilter = PropFilter('form')

const NewsletterContainer = styled.div`
  text-align: center;
  padding: 20px;
`

const NewsletterTitle = styled.h2`
  text-align: center;
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 25px;
  color: var(--sc-color-title);
`

const NewsletterSubtitle = styled.p`
  font-size: 19px;
  margin-bottom: 25px;
`

interface NewsletterFormProps {
  isVisible: boolean
}

const NewsletterForm = styled(formFilter(['isVisible']))<NewsletterFormProps>`
  display: flex;
  justify-content: center;
  gap: 10px;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: opacity 0.5s ease;
`

const NewsletterInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid var(--sc-color-border-gray);
  min-width: 375px;

  @media (max-width: 768px) {
    min-width: auto;
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const SuccessMessage = styled.div`
  animation: ${fadeIn} 0.5s ease;
`

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState<string>('')
  const [emailValid, setEmailValid] = useState<boolean>(true)
  const [submitted, setSubmitted] = useState<boolean>(false)

  const validateEmailDomain = (email: string): boolean => {
    const regex = /.+@\S+\.\S+$/
    return regex.test(email)
  }

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setEmail(email)
    setEmailValid(true) // Reset the email validation state when the user types
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate the email before making the API call
    const isEmailValid = validateEmailDomain(email)
    if (!isEmailValid) {
      setEmailValid(false)
      return
    }

    // Make the mock API call with the validated email
    setSubmitted(true)
  }

  return (
    <NewsletterContainer>
      <NewsletterTitle>Stay updated</NewsletterTitle>
      <NewsletterSubtitle>
        Be the first to know the latest deals and more. We won't spam.
      </NewsletterSubtitle>
      {submitted ? (
        <SuccessMessage>Thanks for subscribing to our newsletter!</SuccessMessage>
      ) : (
        <NewsletterForm isVisible={!submitted} onSubmit={handleSubmit}>
          <NewsletterInput
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            style={{
              borderColor: emailValid ? 'var(--sc-color-border-gray)' : 'red',
            }}
          />
          <Button type="primary" size="large">
            Subscribe
          </Button>
        </NewsletterForm>
      )}
    </NewsletterContainer>
  )
}

export default NewsletterSignup
