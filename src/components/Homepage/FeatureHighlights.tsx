import React from 'react'
import styled from 'styled-components'
import { Shirt, Scissors, Truck, Recycle } from 'lucide-react'

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px;
  background-color: #f6f9fc;
  border-radius: 8px;

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
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: center;
`

const Icon = styled.div`
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

const FeatureHighlights: React.FC = () => {
  return (
    <Container>
      <SecTitle>Why choose Threadly?</SecTitle>
      <p>
        United in a common goal, everything we do is focused on delivering the
        best possible service and experience to you. We call this the Threadly
        Difference – here’s what it looks like in action.
      </p>
      <Wrapper>
        <Column>
          <Outline>
            <Icon>
              <Shirt size={32} />
            </Icon>
          </Outline>
          <HeaderText>Wide Selection of Styles</HeaderText>
          <p>
            Browse a curated collection of clothing, from casual essentials to
            trendsetting pieces, for every occasion.
          </p>
        </Column>
        <Divider />
        <Column>
          <Outline>
            <Icon>
              <Scissors size={32} />
            </Icon>
          </Outline>
          <HeaderText>Quality Craftsmanship</HeaderText>
          <p>
            Every item is made with high-quality materials, ensuring comfort,
            durability, and timeless style.
          </p>
        </Column>
        <Divider />
        <Column>
          <Outline>
            <Icon>
              <Truck size={32} />
            </Icon>
          </Outline>
          <HeaderText>Fast, Free Shipping</HeaderText>
          <p>
            From everyday basics to premium pieces, nearly everything ships for
            free — no minimum purchase required.
          </p>
        </Column>
        <Divider />
        <Column>
          <Outline>
            <Icon>
              <Recycle size={32} />
            </Icon>
          </Outline>
          <HeaderText>Sustainable Fashion</HeaderText>
          <p>
            We prioritize eco-friendly fabrics and responsible production
            practices, so you can shop with peace of mind.
          </p>
        </Column>
      </Wrapper>
    </Container>
  )
}

export default FeatureHighlights
