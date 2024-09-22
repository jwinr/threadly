import React from 'react'
import styled from 'styled-components'
import { Leaf } from 'lucide-react'
import Arrow from '@/public/images/icons/ctaArrow.svg'

const Container = styled.div`
  background-color: #fff5f4;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  text-align: center;
  border-radius: 8px;
`

const LeafIcon = styled(Leaf)`
  color: var(--sc-color-carnation);
  margin-bottom: 16px;
`

const Heading = styled.h2`
  font-size: 26px;
  font-weight: bold;
  color: var(--sc-color-title);
  margin-bottom: 16px;
`

const Description = styled.p`
  font-size: 18px;
  max-width: 600px;
  margin: 0 auto 24px;
`

const HoverArrow = styled.div`
  --arrowSpacing: 5px;
  opacity: 1;
  top: 1px;
  position: relative;
  stroke: #fff;
  margin-left: var(--arrowSpacing);
  transition:
    transform 150ms ease,
    opacity 250ms ease;

  & > svg {
    stroke-width: 2px;

    .ctaArrow_svg__HoverArrow_linePath {
      transition: opacity 100ms ease;
      opacity: 0;
    }
    .ctaArrow_svg__HoverArrow_tipPath {
      transition:
        transform 150ms ease,
        opacity 250ms ease;
      opacity: 1;
      transform: translateX(0);
    }
  }
`

const Button = styled.a`
  display: flex;
  align-items: center;
  background-color: var(--sc-color-carnation);
  color: var(--sc-color-white);
  margin-bottom: 16px;
  padding-left: 16px;
  padding-top: 4px;
  padding-bottom: 6px;
  padding-right: 12px;
  border-radius: 980px;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  opacity: 1;
  transition: background-color 0.15s ease;

  &:hover,
  &:focus-visible {
    background-color: #360b07;
    color: var(--sc-color-white);

    & ${HoverArrow} {
      opacity: 1;

      & > svg {
        .ctaArrow_svg__HoverArrow_linePath {
          transform: translateX(0px);
          opacity: 1;
        }

        .ctaArrow_svg__HoverArrow_tipPath {
          transform: translateX(3px);
          opacity: 1;
        }
      }
    }
  }

  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 16px;
  }
`

const Sustainability: React.FC = () => {
  return (
    <Container>
      <LeafIcon size={48} />
      <Heading>Our Commitment to Sustainability</Heading>
      <Description>
        We&apos;re dedicated to reducing our environmental impact through
        eco-friendly materials, ethical manufacturing, and sustainable practices
        throughout our supply chain.
      </Description>
      <Button href="#" aria-label="Learn more" className="button-wrapper">
        <span aria-hidden="true">Learn&nbsp;more</span>
        <HoverArrow aria-hidden="true">
          <Arrow />
        </HoverArrow>
      </Button>
    </Container>
  )
}

export default Sustainability
