import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { useRouter } from "next/router"
import Image from "next/image"
import { useMobileView } from "@/context/MobileViewContext"

import BannerDesktop from "@/public/images/herobanner_large.png"
import BannerMobile from "@/public/images/herobanner_mobile.png"

const HeroBannerContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 12px;
  overflow: hidden;
  margin: 20px 0;
  height: 500px;

  @media (max-width: 768px) {
    height: 390px;
  }
`

const HeroContent = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 200;
  width: 100%;
  top: 55%;
  left: 27.5%;
  width: 45%;

  @media (max-width: 768px) {
    -webkit-box-pack: start;
    justify-content: flex-start;
    text-align: left;
    position: absolute;
    top: 45%;
    right: initial;
    bottom: initial;
    left: 6.5%;
    width: 52%;
    align-items: flex-start;
  }
`

const HeroTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--sc-color-text-dark);

  @media (max-width: 768px) {
    font-size: 26px;
  }
`

const CtaButton = styled.button`
  background-color: var(--sc-color-white);
  color: var(--sc-color-text-dark);
  border: 1px solid var(--sc-color-border-gray);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 18px;
  transition: transform 0.3s ease;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 12px;

  &:hover {
    background-color: var(--sc-color-white-highlight);
    transform: scale(1.05);
  }

  &:focus-visible {
    background-color: var(--sc-color-white-highlight);
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 16px;
  }

  &.initial-hidden {
    opacity: 0;
    transition: none;
  }
`

const BackgroundImage = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;

  @media (max-width: 768px) {
    width: 390px;
  }
`

const HeroBanner = () => {
  const [initialLoad, setInitialLoad] = useState(true)
  const isMobileView = useMobileView()
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => setInitialLoad(false), 0) // Ensure initialLoad is set to false after the initial render
  }, [])

  const handleClick = () => {
    router.push("/categories")
  }

  const imageProps = isMobileView
    ? { src: BannerMobile, width: 390, height: 390 }
    : { src: BannerDesktop, width: 1140, height: 500 }

  return (
    <HeroBannerContainer>
      <BackgroundImage>
        <Image
          src={imageProps.src}
          width={imageProps.width}
          height={imageProps.height}
          alt="Smarter Graphics"
          quality={100}
          priority={true}
        />
      </BackgroundImage>
      <HeroContent>
        <HeroTitle>AI-ready GPUs from $299</HeroTitle>
        <CtaButton
          onClick={handleClick}
          className={initialLoad ? "initial-hidden" : ""}
          aria-label="Shop Now and explore categories"
          role="button"
        >
          Shop now
        </CtaButton>
      </HeroContent>
    </HeroBannerContainer>
  )
}

export default HeroBanner
