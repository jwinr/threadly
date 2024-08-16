import React, { useEffect, useRef } from "react"
import styled from "styled-components"
import Image from "next/image"
import HeroImg from "@/public/images/hero_main.jpg"

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

const Headline = styled.h1`
  font-size: 56px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0px 2px 11px rgb(0 0 0);
  margin-bottom: 20px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 26px;
    margin-bottom: 10px;
  }
`

const Subheadline = styled.h2`
  font-size: 18px;
  font-weight: 400;
  color: #fff;
  text-shadow: 0px 2px 6px rgb(0 0 0), 1px 2px 5px rgb(0 0 0);
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 20px;
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

const HeroBanner = () => {
  const textContainerRef = useRef(null)
  const headlineRef = useRef(null)
  const subheadlineRef = useRef(null)
  const buttonRef = useRef(null)

  const handleScroll = () => {
    const scrollTop = window.scrollY

    if (headlineRef.current && subheadlineRef.current && buttonRef.current) {
      const fadeOutDistance = 300
      const headlineMovement = scrollTop / 4 // Movement factor for headline
      const subheadlineMovement = scrollTop / 6 // Slower movement factor for subheadline

      const headlineOpacity = Math.max(1 - scrollTop / fadeOutDistance, 0)
      const subheadlineOpacity = Math.max(
        1 - (scrollTop - 200) / fadeOutDistance,
        0
      )

      // Calculate button offset based on subheadline's movement
      const buttonOffset = subheadlineMovement // Adjust the divisor for finer control
      const buttonOpacity = subheadlineOpacity

      headlineRef.current.style.transform = `translateY(${headlineMovement}px)`
      headlineRef.current.style.opacity = headlineOpacity

      subheadlineRef.current.style.transform = `translateY(${subheadlineMovement}px)`
      subheadlineRef.current.style.opacity = subheadlineOpacity

      buttonRef.current.style.transform = `translateY(${buttonOffset}px)`
      buttonRef.current.style.opacity = buttonOpacity
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <HeroBannerContainer>
      <ParallaxLayer>
        <Image
          src={HeroImg}
          width={1920}
          height={1080}
          quality={85}
          alt="Background"
          priority={true}
        />
      </ParallaxLayer>
      <TextContainer ref={textContainerRef}>
        <Headline ref={headlineRef}>Embrace the Outdoors.</Headline>
        <Subheadline ref={subheadlineRef}>
          Stay warm, stylish, and ready for any adventure with Canada Goose.
        </Subheadline>
        <CtaButton ref={buttonRef}>Explore now</CtaButton>
      </TextContainer>
    </HeroBannerContainer>
  )
}

export default HeroBanner
