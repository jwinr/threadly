import React from "react"
import styled from "styled-components"
import Head from "next/head"
import Button from "../components/common/Button"
import { useToast } from "../context/ToastContext"

const CareersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
  text-align: center;
  background-color: var(--color-main-light);
  min-height: 80vh;

  @media (max-width: 768px) {
    padding: 30px 10px;
  }
`

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--color-main-dark);
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const Description = styled.p`
  font-size: 1.2rem;
  color: var(--sc-color-neutral-dark);
  max-width: 600px;
  line-height: 1.5;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

const Careers = () => {
  const emailString = process.env.NEXT_PUBLIC_CONTACT_EMAIL
  const { showToast } = useToast()

  const handleButtonClick = async () => {
    try {
      await navigator.clipboard.writeText(emailString)
      await showToast("Email copied to clipboard", {
        type: "success",
      })
    } catch (err) {
      await showToast("Failed to copy email", {
        type: "caution",
      })
    }
  }

  return (
    <>
      <Head>
        <title>Hire Me | Nexari</title>
      </Head>
      <CareersContainer>
        <Title>Let's work together.</Title>
        <Description>
          Interested in hiring me to join your team? I'm always looking for
          opportunities to grow and apply my skills. Feel free to reach out via
          email.
        </Description>
        <Button
          href={`mailto:${emailString}`}
          target="_self"
          size="large"
          type="primary"
          onPress={handleButtonClick}
        >
          Contact Me
        </Button>
      </CareersContainer>
    </>
  )
}

export default Careers
