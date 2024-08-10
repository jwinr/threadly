import React from "react"
import styled from "styled-components"

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-area: about;
  padding: 50px 20px;
  background-color: #f6f9fc;

  h1 {
    font-size: 34px;
    font-weight: 600;
  }
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  width: 100%;
  gap: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`

const SecTitle = styled.h2`
  font-size: 38px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--sc-color-title);
  align-self: start;
`

const Subtitle = styled.p``

const Column = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;

  p {
    font-size: 16px;
    margin: 8px 0;
    color: var(--sc-color-body);
  }
`

const Outline = styled.div`
  border: 2px solid var(--sc-color-carnation);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: center;
`

const Icon = styled.div`
  font-size: 2.5rem;
  color: var(--sc-color-carnation);
`

const HeaderText = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: var(--sc-color-title);
  margin-bottom: 8px;
`

const Divider = styled.div`
  border-left: 1px solid var(--sc-color-gray-300);
  height: 80px;
  align-self: center;

  @media (max-width: 768px) {
    display: none;
  }
`

const FeatureHighlights = () => {
  return (
    <Container>
      <SecTitle>Why choose Threadly?</SecTitle>
      <Subtitle>
        United in a common goal, everything we do is focused on delivering the
        best possible service and experience to you. We call this The Threadly
        Difference – here’s what it looks like in action.
      </Subtitle>
      <Wrapper>
        <Column>
          <Outline>
            <Icon>🖥️</Icon>
          </Outline>
          <HeaderText>Wide Selection of Tech Products</HeaderText>
          <p>
            Shop top-tier tech, from powerful components to essential
            accessories, for your custom builds and upgrades.
          </p>
        </Column>
        <Divider />
        <Column>
          <Outline>
            <Icon>🔧</Icon>
          </Outline>
          <HeaderText>Expert Guidance</HeaderText>
          <p>
            Our tech experts provide personalized advice and support to help you
            choose and use the right gear.
          </p>
        </Column>
        <Divider />
        <Column>
          <Outline>
            <Icon>🚚</Icon>
          </Outline>
          <HeaderText>Fast, free shipping</HeaderText>
          <p>
            From mouse pads to full-sized computer cases, nearly everything
            ships for free — no minimum purchase required.
          </p>
        </Column>
        <Divider />
        <Column>
          <Outline>
            <Icon>💻</Icon>
          </Outline>
          <HeaderText>Latest Tech & Innovations</HeaderText>
          <p>
            Discover the latest tech trends and innovations, from cutting-edge
            GPUs to the newest peripherals.
          </p>
        </Column>
      </Wrapper>
    </Container>
  )
}

export default FeatureHighlights
