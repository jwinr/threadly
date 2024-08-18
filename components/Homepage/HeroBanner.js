import React, { useEffect, useRef } from "react"
import styled, { keyframes } from "styled-components"
import Image from "next/image"
import HeroImg from "@/public/images/hero_main.jpg"
import Arrow from "@/public/images/icons/ctaArrow.svg"

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(60%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const fadeInUpSub = keyframes`
  from {
    opacity: 0;
    transform: translateY(90%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const fadeInUpCta = keyframes`
  from {
    opacity: 0;
    transform: translateY(120%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const fadeInWithMask = keyframes`
   0% {
    opacity: 0;
    transform: translateY(60%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`

const insetClipPath = keyframes`
  0% {
    clip-path: inset(0 0 0 100%);
  }
  100% {
    clip-path: inset(0 0 0 0);
  }
`

const HoverArrow = styled.div`
  --arrowSpacing: 5px;
  opacity: 1;
  top: 1px;
  position: relative;
  stroke: #fff;
  margin-left: var(--arrowSpacing);
  transition: transform 150ms ease, opacity 250ms ease;

  & > svg {
    stroke-width: 2px;

    .ctaArrow_svg__HoverArrow_linePath {
      transition: opacity 100ms ease;
      opacity: 0;
    }
    .ctaArrow_svg__HoverArrow_tipPath {
      transition: transform 150ms ease, opacity 250ms ease;
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
  height: calc(100vh - 104px); // Viewport - navbar height and section padding
  background-color: white;
  perspective: 1000px;

  @media (max-width: 768px) {
    height: 390px;
  }
`

const ParallaxLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  will-change: transform;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
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
  line-height: 1.2;
  display: flex;
  flex-direction: column;

  h1 {
    font-size: 70px;
    animation: ${fadeInUp} 1.25s ease forwards;
    text-shadow: 2px 4px 6px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 768px) {
    font-size: 26px;
    margin-bottom: 10px;
  }
`

const KnockoutText = styled.div`
  opacity: 0;
  height: 100px;
  animation: ${fadeInWithMask} 1s ease forwards,
    ${insetClipPath} 0.75s ease-out forwards;

  h1 {
    font-size: 70px;
    background: linear-gradient(
      269.94deg,
      #aa6dd3 13.86%,
      #ff8562 84.56%
    ) !important;
    background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    text-shadow: none;
  }

  &::before {
    animation: ${fadeInWithMask} 1s ease forwards,
      ${insetClipPath} 0.75s ease-out forwards;
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    font-size: 70px;
    color: transparent;
    text-shadow: 2px 4px 6px rgba(0, 0, 0, 0.5);
    z-index: -1;
  }
`

const Subheadline = styled.h2`
  font-size: 18px;
  font-weight: 400;
  color: #fff;
  text-shadow: 0px 2px 6px rgb(0 0 0), 1px 2px 5px rgb(0 0 0);
  margin: 32px 0;
  opacity: 0;
  animation: ${fadeInUpSub} 1.25s ease 0.25s forwards;

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 20px;
  }
`

const CtaButton = styled.button`
  display: flex;
  align-items: center;
  background-color: var(--sc-color-carnation);
  color: var(--sc-color-white);
  padding-left: 16px;
  padding-top: 3px;
  padding-bottom: 6px;
  padding-right: 12px;
  border-radius: 16.5px;
  font-size: 15px;
  font-weight: 700;
  opacity: 0;
  transition: transform 0.3s ease, background-color 0.15s ease;
  animation: ${fadeInUpCta} 1.25s ease 0.5s forwards; /* Delayed start */
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 12px;

  &:hover {
    background-color: #360b07;
    transform: scale(1.05);

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

const HeroBanner = () => {
  return (
    <HeroBannerContainer>
      <ParallaxLayer>
        <Image
          src={HeroImg}
          width={1600}
          height={1103}
          quality={85}
          alt="Background"
          priority={true}
        />
      </ParallaxLayer>
      <TextContainer>
        <Headline>
          <h1>Where timeless style meets modern</h1>
          <KnockoutText data-text="confidence.">
            <h1>confidence.</h1>
          </KnockoutText>
        </Headline>
        <Subheadline>
          Redefine your wardrobe with exclusive pieces that speak elegance and
          modernity. Perfect for the trend-savvy individual.
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
