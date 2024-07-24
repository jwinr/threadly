import React, { useState, useEffect, forwardRef, useRef } from "react"
import styled from "styled-components"
import Image from "next/image"
import Link from "next/link"
import AddToCartButton from "../shopping/AddToCartButton"
import { Swiper, SwiperSlide } from "swiper/react"
import { Scrollbar, FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/scrollbar"
import "swiper/css/free-mode"
import { useMobileView } from "../../context/MobileViewContext"

const Container = styled.div`
  background-color: #dff3ff;
  border-radius: 12px;
  gap: 20px;
  display: flex;
  padding: 15px;
  height: 100%;
  justify-content: space-between;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;

  &.in-view {
    opacity: 1;
    transform: translateY(0);
  }

  .swiper {
    padding-bottom: 13px; // Allow the swiper scrollbar to be positioned beneath the product cards
    margin-bottom: -13px; // Fix the padding offset
  }

  .swiper-scrollbar {
    transition: opacity 0.5s ease-out;
    opacity: 1;
  }

  .swiper-scrollbar-hidden {
    opacity: 0;
  }
`

const ItemContainer = styled.div`
  padding: 8px;
  background-color: var(--sc-color-white);
  border-radius: 8px;
  width: 202px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;

  @media (max-width: 768px) {
    width: auto;
  }
`

const ImgContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 186px;
  width: 186px;

  img {
    width: 100%;
    height: auto;
    padding: 0 3px; // Spacing for the tab selector outline
  }

  @media (max-width: 768px) {
    height: 117px;
    width: auto;
  }
`

const DetailWrapper = styled.div`
  padding: 5px;
  margin-bottom: 20px;
`

const PriceContainer = styled.div`
  display: flex;
  line-height: 1.4;
  flex-direction: column;
`

const PriceText = styled.span`
  font-size: 12px;
  color: gray;
`

const OriginalPrice = styled.span`
  font-size: 12px;
  color: gray;
  text-decoration: line-through;
`

const Price = styled.h1`
  font-size: 14px;
  font-weight: bold;
`

const ButtonWrapper = styled.div`
  font-size: 12px;
  margin: 4px;
  width: calc(100% - 8px);
  min-width: 110px;

  button {
    min-height: auto;
    width: 100%;

    @media (max-width: 768px) {
      height: 32px;
    }
  }
`

const Title = styled.span`
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    -webkit-line-clamp: 3;
  }
`

const TopDeals = forwardRef((props, ref) => {
  const [deals, setDeals] = useState([])
  const isMobileView = useMobileView()
  const timeoutRef = useRef(null)
  const swiperRef = useRef(null)

  useEffect(() => {
    fetch(`/api/deals`, {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      },
    })
      .then((response) => response.json())
      .then((data) => setDeals(data))
      .catch((error) => console.error("Error fetching deals:", error))
  }, [])

  const handleInteraction = () => {
    const scrollbar = swiperRef.current.querySelector(".swiper-scrollbar")
    if (scrollbar) {
      scrollbar.classList.remove("swiper-scrollbar-hidden")
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      if (scrollbar) {
        scrollbar.classList.add("swiper-scrollbar-hidden")
      }
    }, 1000)
  }

  useEffect(() => {
    if (isMobileView) {
      const handleTouchStart = () => handleInteraction()
      const handleMouseMove = () => handleInteraction()

      window.addEventListener("touchstart", handleTouchStart)
      window.addEventListener("mousemove", handleMouseMove)

      return () => {
        window.removeEventListener("touchstart", handleTouchStart)
        window.removeEventListener("mousemove", handleMouseMove)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }
  }, [isMobileView])

  const loveDeals = deals.filter((deal) => deal.category === "deals_love")

  return (
    <Container ref={ref} className={props.className}>
      {isMobileView ? (
        <Swiper
          ref={swiperRef}
          modules={[FreeMode, Scrollbar]}
          slidesPerView={2}
          spaceBetween={10}
          freeMode={true}
          scrollbar={{ draggable: true }}
          onTouchStart={handleInteraction}
          onTouchMove={handleInteraction}
          onMouseMove={handleInteraction}
        >
          {loveDeals.map((deal, index) => (
            <SwiperSlide key={index}>
              <ItemContainer>
                <Link
                  href={`products/${deal.slug}`}
                  aria-label={`View details of ${deal.name}`}
                >
                  <ImgContainer>
                    <Image
                      alt={deal.name}
                      src={deal.image_url || "/images/products/placeholder.jpg"}
                      width={1540}
                      height={649}
                    />
                  </ImgContainer>
                  <DetailWrapper>
                    <Title>{deal.name}</Title>
                    <PriceContainer>
                      <Price>
                        ${(deal.price - deal.discount_amount).toFixed(2)}
                      </Price>
                      <PriceText>
                        reg <OriginalPrice>${deal.price}</OriginalPrice>
                      </PriceText>
                    </PriceContainer>
                  </DetailWrapper>
                </Link>
                <ButtonWrapper>
                  <AddToCartButton
                    productId={deal.product_id}
                    quantity={1}
                    productName={deal.name}
                  />
                </ButtonWrapper>
              </ItemContainer>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        loveDeals.map((deal, index) => (
          <ItemContainer key={index}>
            <Link
              href={`products/${deal.slug}`}
              aria-label={`View details of ${deal.name}`}
            >
              <ImgContainer>
                <Image
                  alt={deal.name}
                  src={deal.image_url || "/images/products/placeholder.jpg"}
                  width={1540}
                  height={649}
                />
              </ImgContainer>
              <DetailWrapper>
                <Title>{deal.name}</Title>
                <PriceContainer>
                  <Price>
                    ${(deal.price - deal.discount_amount).toFixed(2)}
                  </Price>
                  <PriceText>
                    reg <OriginalPrice>${deal.price}</OriginalPrice>
                  </PriceText>
                </PriceContainer>
              </DetailWrapper>
            </Link>
            <ButtonWrapper>
              <AddToCartButton
                productId={deal.product_id}
                quantity={1}
                productName={deal.name}
              />
            </ButtonWrapper>
          </ItemContainer>
        ))
      )}
    </Container>
  )
})

export default TopDeals
