import styled from 'styled-components'
import Email from '@/public/images/icons/email.svg'

const ContactPageWrapper = styled.div`
  display: flex;
  padding: 30px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`

const HeaderText = styled.h1`
  font-weight: 700;
  font-size: 56px;
  margin-bottom: 10px;
  color: var(--sc-color-title);
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

const StyledEmail = styled(Email)`
  width: 36px;
  height: 36px;
`

const ContactCard = styled.div`
  background-color: var(--sc-color-white);
  width: 100%;
  border-radius: 10px;
  max-width: 66.67%;
  display: flex;
  justify-self: center;
  align-self: center;
  box-shadow:
    0 30px 60px -12px rgba(50, 50, 93, 0.25),
    0 18px 36px -18px rgba(0, 0, 0, 0.3);
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
      <ContactPageWrapper>
        <HeaderText>Contact us</HeaderText>
        <ContactCard>
          <CardDetails>
            <SubheaderText>Need help or support?</SubheaderText>
            <p>
              Have an order related question, a technical issue or just want to say hi? Feel free to
              reach out to us through email and we will get back to you shortly.
            </p>
            <EmailWrapper>
              <StyledEmail /> <EmailText>help@shopthreadly.com</EmailText>
            </EmailWrapper>
          </CardDetails>
        </ContactCard>
      </ContactPageWrapper>
    </>
  )
}

export default ContactUs
