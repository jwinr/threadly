import React from 'react'

import styled from 'styled-components'

import { useRouter } from 'next/router'

import LogoSymbol from '@/public/images/logo_n.svg'
import * as AuthStyles from './AuthStyles'
import Button from '@/components/Elements/Button'

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  height: 100%;
  margin: 0 auto;
  justify-content: center;
  text-align: center;
  align-items: center;

  @media (max-width: 768px) {
    width: auto;
    padding: 50px;
  }
`

const ErrorMessage = styled.div`
  font-size: 26px;
  font-weight: 800;
  margin: 25px 0;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`

interface ErrorRedirectProps {
  message: string
}

const ErrorRedirect: React.FC<ErrorRedirectProps> = ({ message }) => {
  const router = useRouter()

  const handleRedirect = () => {
    router.push('/')
  }

  return (
    <ErrorContainer>
      <AuthStyles.LogoBox>
        <a href="/" aria-label="Home">
          <LogoSymbol />
        </a>
      </AuthStyles.LogoBox>
      <ErrorMessage>{message}</ErrorMessage>
      <Button type="primary" size="large" onPress={handleRedirect}>
        Return to home
      </Button>
    </ErrorContainer>
  )
}

export default ErrorRedirect
