import React from "react"
import { useRouter } from "next/router"
import styled from "styled-components"
import {
  RiFacebookFill,
  RiTwitterXFill,
  RiInstagramLine,
  RiYoutubeFill,
} from "react-icons/ri"
import LogoSymbol from "../public/images/logo_dark.svg"
import { GoChecklist, GoShieldCheck } from "react-icons/go"
import { useMobileView } from "../context/MobileViewContext"
import FooterAccordion from "./FooterAccordion"

const FooterContainer = styled.footer`
  display: flex;
  background-color: var(--sc-color-neutral);
  text-align: center;
  position: relative;
  padding: 25px 0px;
  justify-content: space-evenly;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 25px;

    &::after {
      /* Don't draw the vertical divider on mobile view */
      display: none;
    }
  }
`

const SlimFooter = styled.div`
  background-color: var(--sc-color-footer-black);
  color: var(--sc-color-white);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 25px 0px;
`

const FooterColumnContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly; /* Distribute the columns evenly */

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding-top: 25px; /* Match the padding of the FooterContainer */
    border-top: 1px solid rgba(243, 245, 248, 0.5);
  }
`

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%; /* Ensuring each column has equal width */

  @media (max-width: 768px) {
    width: 100%;
  }
`

const FooterTitle = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`

const FooterLink = styled.div`
  text-decoration: none;
  font-size: 14px;
  margin: 3px;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 11px;
  }
`

const BottomLinksWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;

  @media (max-width: 768px) {
    margin-top: 10px;
  }
`

const FooterLinkBottom = styled.div`
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: var(--sc-color-white);

  &:hover {
    text-decoration: underline;
  }

  svg {
    margin-right: 5px;
    font-size: 16px;
  }

  @media (max-width: 768px) {
    margin-right: 8px;
  }
`

const SocialMedia = styled.div`
  display: flex;
  font-size: 24px;
  gap: 5px;

  @media (max-width: 768px) {
    font-size: 20px;
    gap: 10px;
  }
`

const LogoBox = styled.div`
  display: flex;
  justify-content: center;

  svg {
    width: 140px;
    fill: var(--sc-color-white);
    margin-bottom: 25px;
  }

  @media (max-width: 768px) {
    svg {
      width: 100px;
    }
  }
`

const CopyrightText = styled.p`
  font-size: 14px;
  opacity: 0.6;
  margin-bottom: 15px;
`

const Footer = () => {
  const router = useRouter()
  const isMobileView = useMobileView()

  // Check if the current route is /login, /signup, /forgot-password or /404
  const isLoginPage = router.pathname === "/login"
  const isSignupPage = router.pathname === "/signup"
  const isForgotPassPage = router.pathname === "/forgot-password"
  const is404Page = router.pathname === "/404"

  // Render the Footer only if the route is not /login, /signup, /forgot-password or /404
  const renderFooter =
    !isLoginPage && !isSignupPage && !isForgotPassPage && !is404Page

  return (
    <>
      {renderFooter && (
        <>
          {isMobileView ? (
            <FooterAccordion />
          ) : (
            <FooterContainer>
              <FooterColumnContainer>
                <FooterColumn>
                  <FooterTitle>About Us</FooterTitle>
                  <a href="/about-us">
                    <FooterLink>About TechNexus</FooterLink>
                  </a>
                  <a href="/careers">
                    <FooterLink>Careers</FooterLink>
                  </a>
                  <a href="/accessibility">
                    <FooterLink>Accessibility Commitment</FooterLink>
                  </a>
                </FooterColumn>
                <FooterColumn>
                  <FooterTitle>Customer Service</FooterTitle>
                  <a href="/hc">
                    <FooterLink>Help Center</FooterLink>
                  </a>
                  <a href="/return-policy">
                    <FooterLink>Returns</FooterLink>
                  </a>
                  <a href="/shipping-policy">
                    <FooterLink>Shipping</FooterLink>
                  </a>
                  <a href="/contact-us">
                    <FooterLink>Contact Us</FooterLink>
                  </a>
                  <a href="/hc">
                    <FooterLink>Order Status</FooterLink>
                  </a>
                </FooterColumn>
                <FooterColumn>
                  <FooterTitle>Follow Us</FooterTitle>
                  <SocialMedia>
                    <a
                      href="https://www.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                    >
                      <RiFacebookFill />
                    </a>
                    <a
                      href="https://www.x.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                    >
                      <RiTwitterXFill />
                    </a>
                    <a
                      href="https://www.instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <RiInstagramLine />
                    </a>
                    <a
                      href="https://www.youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                    >
                      <RiYoutubeFill />
                    </a>
                  </SocialMedia>
                </FooterColumn>
              </FooterColumnContainer>
            </FooterContainer>
          )}
          <SlimFooter>
            <LogoBox>
              <LogoSymbol />
            </LogoBox>
            <CopyrightText>
              © TechNexus, Inc. All Rights Reserved.
            </CopyrightText>
            <BottomLinksWrapper>
              <a href="/terms-of-service">
                <FooterLinkBottom>
                  <GoChecklist />
                  Terms Of Service
                </FooterLinkBottom>
              </a>
              <a href="/privacy-policy">
                <FooterLinkBottom>
                  <GoShieldCheck />
                  Privacy Policy
                </FooterLinkBottom>
              </a>
            </BottomLinksWrapper>
          </SlimFooter>
        </>
      )}
    </>
  )
}

export default Footer
