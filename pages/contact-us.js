import Head from "next/head"
import styled from "styled-components"
import { IoMail } from "react-icons/io5"

const ContactPageWrapper = styled.div`
  display: grid;
  grid-template-areas:
    "header"
    "card";
  padding: 30px;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`

const HeaderText = styled.h1`
  font-weight: 800;
  font-size: 32px;
  margin-bottom: 10px;
`

const SubheaderText = styled.h2`
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 5px;
  grid-area: header;
`

const EmailText = styled.h2`
  font-weight: 700;
  font-size: 22px;
`

const ContactCard = styled.div`
  background-color: var(--sc-color-white);
  width: 100%;
  border-radius: 10px;
  max-width: 66.67%;
  display: flex;
  justify-self: center;
  align-self: center;
  grid-area: card;
  box-shadow: 6px 6px 14px 1px rgba(0, 0, 0, 0.16);
`

const CardDetails = styled.div`
  background-color: var(--sc-color-white);
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  border-radius: 10px;
  width: 100%;
  padding: 40px;
  display: flex;
`

const EmailWrapper = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`

const ContactUs = () => {
  return (
    <>
      <Head>
        <title>Contact Us | TechNexus</title>
        <meta
          name="description"
          content="Get in touch with TechNexus. Questions, feedback, press or business proposals."
        />
      </Head>
      <ContactPageWrapper>
        <HeaderText>Contact us</HeaderText>
        <ContactCard>
          <CardDetails>
            <SubheaderText>Need help or support?</SubheaderText>
            <p>
              Have an order related question, a technical issue or just want to
              say hi? Feel free to reach out to us through email and we will get
              back to you shortly.
            </p>
            <EmailWrapper>
              <IoMail size="36" /> <EmailText>help@jwtechnexus.com</EmailText>
            </EmailWrapper>
          </CardDetails>
        </ContactCard>
      </ContactPageWrapper>
    </>
  )
}

export default ContactUs
