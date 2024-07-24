import React from "react"
import styled from "styled-components"
import { useRouter } from "next/router"
import Image from "next/image"
import LogoSymbol from "../../public/images/logo_n.png"
import * as AuthStyles from "./AuthStyles"

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

const HomeButton = styled(AuthStyles.AuthBtn)`
  @media (min-width: 768px) {
    width: fit-content;
    align-self: center;
  }
`

const ErrorRedirect = ({ message }) => {
  const router = useRouter()

  const handleRedirect = () => {
    router.push("/")
  }

  return (
    <ErrorContainer>
      <AuthStyles.LogoBox>
        <a href="/" aria-label="Home">
          <Image
            src={LogoSymbol}
            alt="TechNexus Logo"
            width="500"
            height="500"
          />
        </a>
      </AuthStyles.LogoBox>
      <ErrorMessage>{message}</ErrorMessage>
      <HomeButton onClick={handleRedirect}>Return to Home</HomeButton>
    </ErrorContainer>
  )
}

export default ErrorRedirect
