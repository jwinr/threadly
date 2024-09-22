'use client'

import styled from 'styled-components'
import Link from 'next/link'
import Spool from '@/public/images/spool.svg'

const Container = styled.main`
  display: flex;
  flex-direction: column;
  padding: 80px;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 4px,
      var(--sc-color-divider) 4px,
      var(--sc-color-divider) 8px
    );
    opacity: 0.75;
  }

  &::before {
    left: 0px;
  }

  &::after {
    right: 0px;
  }

  @media (max-width: 768px) {
    padding: 40px;
    max-width: 100%;
    padding: 30px;
  }
`

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 600;
  color: var(--sc-color-title);
  margin-bottom: 16px;
`

const Message = styled.p`
  font-size: 1.5rem;
  margin-bottom: 24px;
  font-weight: 500;
`

const SubMessage = styled.p`
  font-size: 1.2rem;
`

const HomeLink = styled(Link)`
  font-size: 1.2rem;
`

const Icon = styled(Spool)`
  position: absolute;
  right: 0;
  bottom: 0;
  height: 50%;
  fill: var(--sc-color-carnation);
  opacity: 0.4;

  @media (max-width: 1024px) {
    height: 35%;
  }

  @media (max-width: 768px) {
    height: 35%;
    bottom: 10%;
  }
`

export default function NotFound() {
  return (
    <Container>
      <section aria-labelledby="page-title">
        <Title id="page-title">Page not found!</Title>
        <Message>
          Sorry, but the page you were looking for could not be found.
        </Message>
        <SubMessage>
          You can <HomeLink href="/">return to our front page</HomeLink>, or
          contact us if you can't find what you're looking for.
        </SubMessage>
      </section>
      <Icon />
    </Container>
  )
}
