import styled from "styled-components"
import Head from "next/head"
import Image from "next/image"
import LogoSymbol from "../public/images/logo_n.png"
import { useRouter } from "next/router"

const NotFoundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  height: 100%;
  margin: 0 auto;
  justify-content: center;
  text-align: center;

  @media (max-width: 768px) {
    width: auto;
    padding: 50px;
  }
`

const LogoBox = styled.div`
  display: flex;
  align-self: center;
  width: 80px;

  @media (max-width: 768px) {
    max-width: 75px;
    width: auto;
  }

  img {
    width: 100%;
    height: 100%;
  }
`

const Message = styled.p`
  font-size: 42px;
  font-weight: 800;
  margin-top: 25px;

  @media (max-width: 768px) {
    align-self: center;
    font-size: 36px;
  }
`

const HomeButton = styled.button`
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease-in 0s;
  border-radius: 6px;
  color: var(--sc-color-white);
  border: medium;
  font-weight: bold;
  min-height: 44px;
  padding: 0px 16px;
  width: fit-content;
  text-align: center;
  background-color: var(--sc-color-blue);
  transition: background-color 0.2s;
  margin-top: 25px;

  &:hover {
    background-color: var(--sc-color-dark-blue);
  }

  &:active {
    background-color: var(--sc-color-dark-blue);
  }

  &:focus-visible {
    background-color: var(--sc-color-dark-blue);
  }

  @media (min-width: 768px) {
    align-self: center;
  }
`

const Custom404 = () => {
  const router = useRouter()

  const handleHomeClick = () => {
    router.push("/")
  }

  return (
    <>
      <Head>
        <title>Page not found!</title>
        <meta
          name="description"
          content="Page not found. The page you are looking for does not exist."
        />
      </Head>
      <NotFoundWrapper>
        <LogoBox>
          <a href="/" aria-label="Home">
            <Image
              src={LogoSymbol}
              alt="TechNexus Logo"
              width="500"
              height="500"
            />
          </a>
        </LogoBox>
        <Message>
          Sorry, we couldn't find the page you were looking for.
        </Message>
        <HomeButton onClick={handleHomeClick}>Return to Homepage</HomeButton>
      </NotFoundWrapper>
    </>
  )
}

export default Custom404
