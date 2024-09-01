import React from 'react'
import styled from 'styled-components'
import Accordion from '@/components/Elements/Accordion'
import AccordionItem from '@/components/Elements/AccordionItem'

const AccordionWrapper = styled.div`
  padding: 15px 15px 0px 15px;
  box-shadow:
    rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  border-radius: 8px 8px 0px 0px;
  margin-top: 20px;
  background-color: white;

  svg {
    width: 16px;
  }
`

const FooterLink = styled.div`
  font-size: 15px;
  margin: 3px;

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
`

const FooterAccordion: React.FC = () => {
  return (
    <AccordionWrapper>
      <Accordion>
        <AccordionItem title="About Us">
          <FooterLink>
            <a href="/about-us">About Threadly</a>
          </FooterLink>
          <FooterLink>
            <a href="/careers">Careers</a>
          </FooterLink>
          <FooterLink>
            <a href="/accessibility">Accessibility Commitment</a>
          </FooterLink>
        </AccordionItem>
        <AccordionItem title="Customer Service">
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
        </AccordionItem>
        <AccordionItem title="Follow Us">
          <FooterLink>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              Facebook
            </a>
          </FooterLink>
          <FooterLink>
            <a
              href="https://www.x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              Twitter
            </a>
          </FooterLink>
          <FooterLink>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              Instagram
            </a>
          </FooterLink>
          <FooterLink>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              YouTube
            </a>
          </FooterLink>
        </AccordionItem>
      </Accordion>
    </AccordionWrapper>
  )
}

export default FooterAccordion
