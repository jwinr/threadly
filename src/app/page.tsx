'use client'

import styled from 'styled-components'
import HeroBanner from '@/components/Homepage/HeroBanner'
import FeatureHighlights from '@/components/Homepage/FeatureHighlights'
import NewsletterSignup from '@/components/Homepage/NewsletterSignup'

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin: 0 8px;

  @media (max-width: 768px) {
    margin: 0;
  }
`

const Section = styled.section`
  padding: 20px 0;
`

const Title = styled.h2`
  text-align: center;
  font-size: 38px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--sc-color-title);
`

const Categories = styled(Section)`
  max-width: 1000px;
  align-self: center;
`

const Home: React.FC = () => {
  return (
    <>
      <HomeContainer>
        <Section>
          <HeroBanner />
        </Section>
        <Section></Section>
        <Section>
          <Title>Deals you&apos;ll love</Title>
        </Section>
        <Section>
          <FeatureHighlights />
        </Section>
        <Categories>
          <Title>Featured categories</Title>
        </Categories>
        <Section>
          <NewsletterSignup />
        </Section>
      </HomeContainer>
    </>
  )
}

export default Home
