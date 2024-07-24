import React, { useEffect, useRef, useState } from "react"
import Head from "next/head"
import FeatureHighlights from "../components/common/FeatureHighlights"
import BrandGrid from "../components/common/BrandGrid"
import HeroBanner from "../components/hero/HeroBanner"
import FeaturedCategories from "../components/common/FeaturedCategories"
import TopDeals from "../components/common/TopDeals"
import NewsletterSignup from "../components/common/NewsletterSignup"
import styled from "styled-components"

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 0 30px;
  max-width: 1200px;
  margin: 0 auto;
`

const Section = styled.section`
  padding: 20px 0;
`

const Title = styled.h2`
  text-align: center;
  font-size: 34px;
  font-weight: 600;
  margin-bottom: 20px;
`

const AnimatedTitle = styled(Title)`
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;

  &.in-view {
    opacity: 1;
    transform: translateY(0);
  }

  &.initial-hidden {
    opacity: 0;
    transform: translateY(20px);
    transition: none;
  }
`

const Home = () => {
  const dealsTitleRef = useRef(null)
  const dealsRef = useRef(null)
  const catTitleRef = useRef(null)
  const catNavRef = useRef(null)

  const [dealsTitleInView, setDealsTitleInView] = useState(false)
  const [dealsInView, setDealsInView] = useState(false)
  const [catTitleInView, setCatTitleInView] = useState(false)
  const [catNavInView, setCatNavInView] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    setTimeout(() => setInitialLoad(false), 0) // Ensure initialLoad is set to false after the initial render
  }, [])

  useEffect(() => {
    const dealsTitleObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDealsTitleInView(true)
          dealsTitleObserver.unobserve(entry.target) // Unobserve to prevent further triggers
        }
      },
      { threshold: 0.1 }
    )

    const dealsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDealsInView(true)
          dealsObserver.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    const catTitleObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCatTitleInView(true)
          catTitleObserver.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    const navObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCatNavInView(true)
          navObserver.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (dealsTitleRef.current) {
      dealsTitleObserver.observe(dealsTitleRef.current)
    }

    if (dealsRef.current) {
      dealsObserver.observe(dealsRef.current)
    }

    if (catTitleRef.current) {
      catTitleObserver.observe(catTitleRef.current)
    }

    if (catNavRef.current) {
      navObserver.observe(catNavRef.current)
    }

    return () => {
      if (dealsTitleRef.current) {
        dealsTitleObserver.unobserve(dealsTitleRef.current)
      }

      if (dealsRef.current) {
        dealsObserver.unobserve(dealsRef.current)
      }

      if (catTitleRef.current) {
        catTitleObserver.unobserve(catTitleRef.current)
      }
      if (catNavRef.current) {
        navObserver.unobserve(catNavRef.current)
      }
    }
  }, [])

  return (
    <>
      <Head>
        <title>TechNexus</title>
        <meta
          name="description"
          content="Shop TechNexus for electronics, computers, laptops & more new tech. Free 2-day shipping on hundreds of items."
        />
      </Head>
      <HomeContainer>
        <Section>
          <HeroBanner />
        </Section>
        <Section>
          <BrandGrid />
        </Section>
        <Section>
          <AnimatedTitle
            ref={dealsTitleRef}
            className={`${initialLoad ? "initial-hidden" : ""} ${
              dealsTitleInView ? "in-view" : ""
            }`}
          >
            Deals you'll love
          </AnimatedTitle>
          <TopDeals
            ref={dealsRef}
            className={`${initialLoad ? "initial-hidden" : ""} ${
              dealsInView ? "in-view" : ""
            }`}
          />
        </Section>
        <Section>
          <FeatureHighlights />
        </Section>
        <Section>
          <AnimatedTitle
            ref={catTitleRef}
            className={`${initialLoad ? "initial-hidden" : ""} ${
              catTitleInView ? "in-view" : ""
            }`}
          >
            Featured categories
          </AnimatedTitle>
          <FeaturedCategories
            ref={catNavRef}
            className={`${initialLoad ? "initial-hidden" : ""} ${
              catNavInView ? "in-view" : ""
            }`}
          />
        </Section>
        <Section>
          <NewsletterSignup />
        </Section>
      </HomeContainer>
    </>
  )
}

export default Home
