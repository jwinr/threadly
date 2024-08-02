import React from "react"
import styled from "styled-components"
import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion"
import ChevronDown from "@/public/images/icons/chevron-down.svg"
import Link from "next/link"
import {
  RiFacebookFill,
  RiTwitterXFill,
  RiInstagramLine,
  RiYoutubeFill,
} from "react-icons/ri"

const ItemWithChevron = ({ header, ...rest }) => (
  <Item
    {...rest}
    header={
      <>
        {header}
        <ChevronDown />
      </>
    }
  />
)

const AccordionWrapper = styled.div`
  padding: 15px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  border-radius: 8px 8px 0px 0px;
  margin-top: 20px;
  background-color: white;

  svg {
    width: 16px;
  }
`

const AccordionItem = styled(ItemWithChevron)`
  border-bottom: 1px solid #ccc;

  &:last-child {
    border-bottom: none; // We don't need a border for the final item
  }

  .szh-accordion__item {
    &-btn {
      cursor: pointer;
      display: flex;
      align-items: center;
      width: 100%;
      margin: 0;
      padding: 1rem;
      font-weight: bold;
      text-align: left;
      font-size: 19px;
      color: #000;
      background-color: transparent;
      border: none;
      &:hover {
        text-decoration: underline;
      }
    }

    &-content {
      transition: height 0.25s cubic-bezier(0, 0, 0, 1);
    }

    &-panel {
      padding: 0px 15px 15px;
    }
  }

  .chevron-down {
    margin-left: auto;
    transition: transform 0.25s cubic-bezier(0, 0, 0, 1);
  }

  &.szh-accordion__item--expanded {
    .chevron-down {
      transform: rotate(180deg);
    }
  }
`

const FooterLink = styled.div`
  text-decoration: none;
  font-size: 11px;
  margin: 3px;

  &:hover {
    text-decoration: underline;
  }
`

const SocialMedia = styled.div`
  display: flex;
  font-size: 20px;
  gap: 10px;
`

const FooterAccordion = () => {
  return (
    <AccordionWrapper>
      <Accordion transition transitionTimeout={250}>
        <AccordionItem header="About Us">
          <Link href="/about-us">
            <FooterLink>About Nexari</FooterLink>
          </Link>
          <Link href="/careers">
            <FooterLink>Careers</FooterLink>
          </Link>
          <Link href="/accessibility">
            <FooterLink>Accessibility Commitment</FooterLink>
          </Link>
        </AccordionItem>
        <AccordionItem header="Customer Service">
          <Link href="/hc">
            <FooterLink>Help Center</FooterLink>
          </Link>
          <Link href="/return-policy">
            <FooterLink>Returns</FooterLink>
          </Link>
          <Link href="/shipping-policy">
            <FooterLink>Shipping</FooterLink>
          </Link>
          <Link href="/contact-us">
            <FooterLink>Contact Us</FooterLink>
          </Link>
          <Link href="/hc">
            <FooterLink>Order Status</FooterLink>
          </Link>
        </AccordionItem>
        <AccordionItem header="Follow Us">
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
        </AccordionItem>
      </Accordion>
    </AccordionWrapper>
  )
}

export default FooterAccordion
