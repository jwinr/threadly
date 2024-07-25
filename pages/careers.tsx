import React from "react"
import styled from "styled-components"
import Head from "next/head"
import Button from "../components/common/Button"
import { useToast } from "../context/ToastContext"
import { RiLinkedinBoxFill, RiGithubFill } from "react-icons/ri"

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
  font-size: 56px;
  color: var(--sc-color-title);
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 34px;
  }
`

const Description = styled.p`
  font-size: 18px;
  max-width: 600px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`

const Subtitle = styled.h2`
  font-size: 24px;
  color: var(--sc-color-title);
  margin: 50px 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
`

const Careers: React.FC = () => {
  const emailString = process.env.NEXT_PUBLIC_CONTACT_EMAIL || ""
  const linkedInString = process.env.NEXT_PUBLIC_CONTACT_LINKEDIN || ""
  const githubString = process.env.NEXT_PUBLIC_CONTACT_GITHUB || ""

  const { showToast } = useToast()

  const handleButtonClick = async () => {
    if (!emailString) {
      showToast("Email not available", { type: "caution" })
      return
    }

    try {
      await navigator.clipboard.writeText(emailString)
      showToast("Email copied to clipboard", {
        type: "success",
      })
    } catch (err) {
      console.error("Failed to copy email: ", err)
      showToast("Failed to copy email", {
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
        <Title>Let's work together</Title>
        <Description>
          Interested in hiring me to join your team? I'm always looking for
          opportunities to grow and apply my skills. Drop me an email if you
          want to chat!
        </Description>
        <Button
          href={`mailto:${emailString}`}
          target="_self"
          size="large"
          type="primary"
          onPress={handleButtonClick}
          aria-label="Contact Me"
        >
          Contact Me
        </Button>
        <Subtitle>... or feel free to connect with me</Subtitle>
        <ButtonContainer>
          <Button
            href={`https://www.linkedin.com/in/${linkedInString}`}
            target="_blank"
            size="large"
            type="secondary"
            aria-label="LinkedIn"
          >
            <RiLinkedinBoxFill />
            LinkedIn
          </Button>
          <Button
            href={`https://github.com/${githubString}`}
            target="_blank"
            size="large"
            type="secondary"
            aria-label="GitHub"
          >
            <RiGithubFill />
            GitHub
          </Button>
        </ButtonContainer>
      </CareersContainer>
    </>
  )
}

export default Careers
