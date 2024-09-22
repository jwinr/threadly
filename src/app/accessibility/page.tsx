'use client'

import styled from 'styled-components'

const PageContainer = styled.div`
  display: flex;
  padding: 80px;
  flex-direction: column;
  gap: 15px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 4px,
      var(--sc-color-divider) 4px,
      var(--sc-color-divider) 8px
    );
    opacity: 0.75;
  }

  &::before {
    left: 0px;
  }

  &::after {
    right: 0px;
  }

  p {
    font-size: 18px;
    margin: 24px 0;

    @media (max-width: 768px) {
      font-size: 15px;
    }
  }

  @media (max-width: 768px) {
    padding: 40px;
    max-width: 100%;
    padding: 30px;
  }
`

const HeaderText = styled.h1`
  font-weight: 700;
  font-size: 56px;
  color: var(--sc-color-title);

  @media (max-width: 768px) {
    font-size: 42px;
  }
`

const SubheaderText = styled.h2`
  font-weight: 600;
  font-size: 24px;
  color: var(--sc-color-title);

  @media (max-width: 768px) {
    font-size: 18px;
  }
`

const Accessibility = () => {
  const emailString = process.env.NEXT_PUBLIC_CONTACT_EMAIL || ''

  return (
    <>
      <PageContainer role="main">
        <HeaderText>Commitment to Accessibility</HeaderText>
        <section>
          <p>
            We are dedicated to ensuring that our website is accessible to all
            of our users, including individuals with disabilities and those who
            may experience limited access to technology. Our goal is to make our
            site conform to the World Wide Web Consortium (W3C) Web Content
            Accessibility Guidelines (WCAG) 2.1, Level AA standards.
          </p>
        </section>
        <section>
          <SubheaderText>
            How We Improve Accessibility for Everyone
          </SubheaderText>
          <br></br>
          <SubheaderText>Accessible Navigation</SubheaderText>
          <p>
            We structure our site using clear headings, lists, and sections so
            that users can navigate with ease, including those using screen
            readers and other assistive technologies.
          </p>
        </section>
        <section>
          <SubheaderText>Accessible Media</SubheaderText>
          <p>
            For users who are unable to see images or hear multimedia content,
            we provide text alternatives. Our images include descriptive alt
            text, and we offer transcripts and captions for multimedia content
            to ensure full accessibility.
          </p>
        </section>
        <section>
          <SubheaderText>Keyboard-Friendly Navigation</SubheaderText>
          <p>
            We design our site to be fully operable via keyboard alone, ensuring
            that individuals with limited mobility can access all features
            without the need for a mouse or other pointing device. Our
            navigation and functionality are built to meet WCAG's guidelines for
            keyboard accessibility.
          </p>
        </section>
        <section>
          <SubheaderText>Consistent User Experience</SubheaderText>
          <p>
            Once you understand how to use our menus and interfaces, you can
            expect our site to behave consistently every time you visit,
            creating a reliable and predictable experience across all pages and
            features.
          </p>
        </section>
        <section>
          <SubheaderText>Ongoing Commitment</SubheaderText>
          <p>
            Accessibility is not a one-time effort. As we continue to update and
            improve our website, we remain committed to following internal
            guidelines that ensure accessibility is part of our design,
            development, and testing processes. If you experience any issues
            with accessing content on our site or have suggestions for improving
            our accessibility, please don't hesitate to contact us at{' '}
            <b>{emailString}</b>.
          </p>
        </section>
      </PageContainer>
    </>
  )
}

export default Accessibility
