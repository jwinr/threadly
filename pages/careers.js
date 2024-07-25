import React from "react"
import styled from "styled-components"
import Head from "next/head"

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

const ContactButton = styled.a`
  display: inline-block;
  padding: 10px 20px;
  font-size: 1rem;
  color: var(--sc-color-white);
  background-color: var(--sc-color-blue);
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--color-main-dark-blue);
  }

  &:active {
    background-color: var(--color-main-dark-blue);
  }

  &:focus-visible {
    background-color: var(--color-main-dark-blue);
  }
`

const Careers = () => {
  const emailString = process.env.NEXT_PUBLIC_CONTACT_EMAIL

  return (
    <>
      <Head>
        <title>Hire Me | Nexari</title>
      </Head>
      <CareersContainer>
        <Title>Let's work together.</Title>
        <Description>
          Interested in hiring me to join your team? I'm always looking for
          opportunities to grow and apply my skills. Feel free to reach out and
          let's discuss how I can contribute to your success!
        </Description>
        <ContactButton href={`mailto:${emailString}`}>Contact Me</ContactButton>
      </CareersContainer>
    </>
  )
}

export default Careers
