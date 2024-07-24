import React from "react"
import { FaDesktop, FaHeadset, FaTruck } from "react-icons/fa"
import styled from "styled-components"

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-area: about;

  h1 {
    font-size: 34px;
    font-weight: 600;
  }
`

const Wrapper = styled.div`
  display: flex;

  @media (max-width: 768px) {
    display: block; /* Switch to a column stack view */
  }
`

const Column = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  p {
    font-size: 14px;
    margin: 4px 0;
  }
`

const Outline = styled.div`
  border: 2px solid var(--sc-color-blue);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: center;
`

const Logo = styled.div`
  color: var(--sc-color-blue);
  font-size: 2.5rem;
  font-weight: normal;
  letter-spacing: 0.05em;
`

const HeaderText = styled.div`
  font-size: 23px;
  font-weight: 600;
`

const FeatureHighlights = () => {
  return (
    <Container>
      <Wrapper>
        <Column>
          <Outline>
            <Logo>
              <FaDesktop />
            </Logo>
          </Outline>
          <HeaderText>Wide Selection of Parts</HeaderText>
          <p>
            Explore our extensive collection of computer components, from
            powerful processors to high-capacity storage devices. Whether you're
            building a gaming rig, upgrading your workstation, or looking for
            your next laptop, we have the latest and greatest hardware to meet
            your needs.
          </p>
        </Column>
        <Column>
          <Outline>
            <Logo>
              <FaHeadset />
            </Logo>
          </Outline>
          <HeaderText>Expert Advice and Support</HeaderText>
          <p>
            We're more than just a retailer; we're your trusted tech partner.
            Our team of knowledgeable experts is here to provide you with expert
            advice, troubleshooting assistance, and personalized
            recommendations. Count on us to help you make informed decisions for
            your next tech purchase.
          </p>
        </Column>
        <Column>
          <Outline>
            <Logo>
              <FaTruck />
            </Logo>
          </Outline>
          <HeaderText>Fast and Secure Shipping</HeaderText>
          <p>
            Your time is valuable, and we understand that. That's why we curate
            a seamless shopping experience, backed by lightning-fast shipping
            with trusted delivery partners, ensuring your order not only arrives
            quickly and in perfect condition but also exceeds your expectations
            with every unboxing.
          </p>
        </Column>
      </Wrapper>
    </Container>
  )
}

export default FeatureHighlights
