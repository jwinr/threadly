import React from 'react'
import styled, { keyframes } from 'styled-components'
import Image from 'next/image'
import HeroImg from '@/public/images/hero_main.jpg'
import Arrow from '@/public/images/icons/ctaArrow.svg'
import KnockoutText from './KnockoutText'

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const fadeInUpSub = keyframes`
  from {
    opacity: 0;
    filter: blur(3px);
    transform: translateY(175%);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
`

const fadeInUpCta = keyframes`
  from {
    opacity: 0;
    filter: blur(2px);
    transform: translateY(325%);
  }
  to {
    opacity: 1;
    transform: translateY(0%);
  }
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

const HeroBannerContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 12px;
  overflow: hidden;
  height: calc(100vh - 104px); // Viewport subtracted by the navbar height and section padding
  background-color: white;
  perspective: 1000px;

  @media (max-width: 768px) {
    height: 390px;
  }
`

const ImageWrapper = styled.div`
  position: absolute;

  img {
    pointer-events: none;
    object-fit: cover;
    max-width: 100%;
    height: 100%;
    border-radius: 12px;
  }
`

const TextContainer = styled.div`
  position: relative;
  z-index: 10;
  max-width: 500px;
  margin-left: 5%;
  color: white;
  opacity: 1;
  transform-style: preserve-3d;
  will-change: transform, opacity;

  @media (max-width: 768px) {
    top: 40%;
    left: 5%;
  }
`

const Headline = styled.div`
  font-weight: 700;
  color: #fff;
  display: flex;
  flex-direction: column;
  animation: ${fadeInUp} 1.25s ease forwards;

  h1 {
    font-size: 76px;
    line-height: 1.04;
    letter-spacing: -0.03em;
    text-shadow: 2px 4px 6px rgba(0, 0, 0, 0.75);
  }

  @media (max-width: 768px) {
    font-size: 26px;
    margin-bottom: 10px;
  }
`

const Subheadline = styled.h2`
  font-size: 18px;
  letter-spacing: 0.2px;
  font-weight: 400;
  line-height: 1.55;
  color: #fff;
  text-shadow:
    0px 2px 6px rgb(0 0 0),
    1px 2px 5px rgb(0 0 0);
  margin-top: 10px;
  margin-bottom: 32px;
  opacity: 0;
  animation: ${fadeInUpSub} 1.5s 0.25s ease forwards;

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 20px;
  }
`

const CtaButton = styled.button`
  display: flex;
  align-items: center;
  position: absolute;
  background-color: var(--sc-color-carnation);
  color: var(--sc-color-white);
  margin-bottom: 16px;
  padding-left: 16px;
  padding-top: 3px;
  padding-bottom: 6px;
  padding-right: 12px;
  border-radius: 16.5px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.6;
  opacity: 0;
  transition:
    transform 0.3s ease,
    background-color 0.15s ease;
  animation: ${fadeInUpCta} 1.25s ease 0.75s forwards;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 12px;

  &:hover {
    background-color: #360b07;

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

  &:focus-visible {
    background-color: var(--sc-color-white-highlight);
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 16px;
  }
`

const HeroBanner: React.FC = () => {
  return (
    <HeroBannerContainer>
      <ImageWrapper>
        <Image
          src={HeroImg}
          width={1920}
          height={1080}
          quality={85}
          alt="Background"
          priority={true}
        />
      </ImageWrapper>
      <TextContainer>
        <Headline>
          <h1>Discover your unique style with lasting</h1>
          <KnockoutText text="confidence" />
        </Headline>

        <Subheadline>
          Find the perfect blend of modern trends and classic style with our stylish, affordable
          pieces—crafted to enhance your everyday look.
        </Subheadline>
        <CtaButton>
          Explore now
          <HoverArrow>
            <Arrow />
          </HoverArrow>
        </CtaButton>
      </TextContainer>
    </HeroBannerContainer>
  )
}

export default HeroBanner
