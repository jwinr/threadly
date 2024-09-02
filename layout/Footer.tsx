import React from 'react'
import { usePathname } from 'next/navigation'
import styled from 'styled-components'

import Facebook from '@/public/images/icons/facebook.svg'
import TwitterX from '@/public/images/icons/twitter.svg'
import Instagram from '@/public/images/icons/instagram.svg'
import YouTube from '@/public/images/icons/youtube.svg'

import LogoSymbol from '../public/images/logo_dark.svg'
import { GoChecklist, GoShieldCheck } from 'react-icons/go'
import { useMobileView } from '../context/MobileViewContext'
import FooterAccordion from './FooterAccordion'

const FooterContainer = styled.footer`
  display: flex;
  background-color: var(--sc-color-neutral);
  text-align: center;
  position: relative;
  padding: 25px 0px;
  justify-content: space-evenly;

  a {
    line-height: 24px;
    color: var(--sc-color-title);
    transition: var(--hoverTransition);
    transition-property: color, opacity;

    &:hover {
      opacity: 0.6;
    }

    &:focus:not(:focus-visible) {
      --s-focus-ring: 0;
      opacity: 1;
    }
  }

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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;

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
  padding: 0 32px;
  text-align: left;

  @media (max-width: 768px) {
    width: 100%;
  }
`

const FooterTitle = styled.div`
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 10px;
  color: var(--sc-color-title);

  @media (max-width: 768px) {
    font-size: 14px;
  }
`

const FooterLink = styled.div`
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  margin: 4px 0;

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

  svg > path {
    fill: var(--sc-color-icon);
  }

  @media (max-width: 768px) {
    font-size: 20px;
    gap: 10px;
  }
`

const LogoBox = styled.div`
  display: flex;
  justify-content: center;

  svg {
    width: 125px;
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
  const pathname = usePathname()
  const isMobileView = useMobileView()

  // Check if the current route is /login, /signup, /forgot-password or /404
  const isLoginPage = pathname === '/login'
  const isSignupPage = pathname === '/signup'
  const isForgotPassPage = pathname === '/forgot-password'
  const is404Page = pathname === '/404'

  // Render the Footer only if the route is not /login, /signup, /forgot-password or /404
  const renderFooter = !isLoginPage && !isSignupPage && !isForgotPassPage && !is404Page

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
                  <FooterLink>
                    <a href="/about-us">About Threadly</a>
                  </FooterLink>
                  <FooterLink>
                    <a href="/careers">Careers</a>
                  </FooterLink>
                  <FooterLink>
                    <a href="/accessibility">Accessibility Commitment</a>
                  </FooterLink>
                </FooterColumn>
                <FooterColumn>
                  <FooterTitle>Customer Service</FooterTitle>
                  <FooterLink>
                    <a href="/hc">Help Center</a>
                  </FooterLink>
                  <FooterLink>
                    <a href="/return-policy">Returns</a>
                  </FooterLink>
                  <FooterLink>
                    <a href="/shipping-policy">Shipping</a>
                  </FooterLink>
                  <FooterLink>
                    <a href="/contact-us">Contact Us</a>
                  </FooterLink>
                  <FooterLink>
                    <a href="/hc">Order Status</a>
                  </FooterLink>
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
                      <Facebook />
                    </a>
                    <a
                      href="https://www.x.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                    >
                      <TwitterX />
                    </a>
                    <a
                      href="https://www.instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <Instagram />
                    </a>
                    <a
                      href="https://www.youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                    >
                      <YouTube />
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
            <CopyrightText>© Threadly, Inc. All Rights Reserved.</CopyrightText>
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
