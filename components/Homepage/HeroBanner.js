import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { useMobileView } from "@/context/MobileViewContext"

import Image from "next/image"
import HeroOne from "@/public/images/hero_slide1.jpg"
import HeroTwo from "@/public/images/hero_slide2.jpg"
import HeroThree from "@/public/images/hero_slide3.jpg"

const HeroBannerContainer = styled.div`
  position: relative;
  display: flex;
  border-radius: 12px;
  overflow: hidden;
  height: calc(100vh - 104px); // Viewport - navbar height and section padding
  box-shadow: 0px 8px 16px -8px rgba(0, 0, 0, 0.1),
    0px 13px 27px -12px rgba(50, 50, 93, 0.25);
  background-color: slategray;

  @media (max-width: 768px) {
    height: 390px;
  }
`

const Headline = styled.h1`
  position: relative;
  font-size: 56px;
  font-weight: 700;
  color: var(--sc-color-white);
  text-shadow: 0px 1px 18px rgba(0, 0, 0, 1);
  z-index: 100;
  margin-bottom: 20px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 26px;
    margin-bottom: 10px;
  }
`

const Subheadline = styled.h2`
  position: relative;
  font-size: 18px;
  font-weight: 400;
  color: var(--sc-color-white);
  text-shadow: 1px 2px 5px rgba(0, 0, 0, 1);
  z-index: 100;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 20px;
  }
`

const TextContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 5%;
  transform: translateY(-50%);
  z-index: 100;
  pointer-events: none;
  max-width: 500px;

  @media (max-width: 768px) {
    top: 40%;
    left: 5%;
  }
`

const CtaButton = styled.button`
  background-color: var(--sc-color-carnation);
  color: var(--sc-color-white);
  padding: 6px 12px;
  border-radius: 16.5px;
  font-size: 15px;
  font-weight: 700;
  transition: transform 0.3s ease;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 12px;

  &:hover {
    background-color: #154ca5;
    transform: scale(1.05);
  }

  &:focus-visible {
    background-color: var(--sc-color-white-highlight);
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 16px;
  }
`

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: opacity 1s ease-in-out;

  img {
    object-fit: cover;
    transition: transform 2s ease;
  }

  &.active img {
    transform: scale(1.1);
  }

  &.inactive {
    opacity: 0;
  }
`

const GradientOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.1) 70%,
    rgba(0, 0, 0, 0.5) 100%
  );
  z-index: 50;
`

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  color: var(--sc-color-title);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25),
    0 8px 16px -8px rgba(0, 0, 0, 0.3);
  z-index: 100;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 240ms ease;
  font-size: 16px;
  font-weight: 800;

  &:hover {
    opacity: 0.8;
  }

  &:focus {
    outline: none;
  }

  &.prev {
    left: 20px;
  }

  &.next {
    right: 20px;
  }
`

const HeroBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const slides = [HeroOne, HeroTwo, HeroThree]

  const handleNextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length)
  }

  const handlePrevSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide()
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <HeroBannerContainer>
      {slides.map((slide, index) => (
        <ImageWrapper
          key={index}
          className={index === activeIndex ? "active" : "inactive"}
        >
          <Image
            src={HeroOne}
            fill={true}
            quality={85}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt=""
          />
          <GradientOverlay />
        </ImageWrapper>
      ))}
      <TextContainer>
        {activeIndex === 0 && (
          <>
            <Headline>Tech solutions to power your growth</Headline>
            <Subheadline>
              <b>
                At Threadly, we have one single goal in mind – to make you a
                satisfied customer.
              </b>{" "}
              That single focus is our shared commitment and promise to you, and
              it drives everything we do. We’re here to help you improve
              productivity and innovation by giving you more than any other
              retailer.
            </Subheadline>
            <CtaButton>Explore now</CtaButton>
          </>
        )}
        {activeIndex === 1 && (
          <>
            <Headline>Work your way, anywhere</Headline>
            <Subheadline>
              From home to the office, find the tech that adapts to your
              lifestyle.
            </Subheadline>
            <CtaButton>Explore now</CtaButton>
          </>
        )}
        {activeIndex === 2 && (
          <>
            <Headline>Precision engineering for peak performance</Headline>
            <Subheadline>
              Upgrade your build with top-tier components designed for
              reliability and efficiency. At Threadly, we offer the tech you
              need to stay ahead.
            </Subheadline>
            <CtaButton>Explore now</CtaButton>
          </>
        )}
      </TextContainer>

      <NavigationButton className="prev" onClick={handlePrevSlide}>
        &lt;
      </NavigationButton>
      <NavigationButton className="next" onClick={handleNextSlide}>
        &gt;
      </NavigationButton>
    </HeroBannerContainer>
  )
}

export default HeroBanner
