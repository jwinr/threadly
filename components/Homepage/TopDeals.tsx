import React, { useState, useEffect, forwardRef } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartButton from '@/components/Shopping/AddToCartButton'
import { useMobileView } from '@/context/MobileViewContext'

const Container = styled.div`
  background-color: #dff3ff;
  border-radius: 12px;
  gap: 20px;
  display: flex;
  padding: 15px;
  height: 100%;
  justify-content: space-between;

  @media (max-width: 768px) {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
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
  scroll-snap-align: start;

  a {
    color: var(--sc-color-text);

    &:focus:not(:focus-visible) {
      --s-focus-ring: 0;
    }
  }

  @media (max-width: 768px) {
    width: auto;
    min-width: 60%;
    scroll-snap-align: center;
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
  color: var(--sc-color-deal-text);
`

const OriginalPrice = styled.span`
  font-size: 12px;
  color: var(--sc-color-deal-text);
  text-decoration: line-through;
`

const Price = styled.h1`
  font-size: 14px;
  font-weight: bold;
  color: var(--sc-color-carnation);
`

const SaleText = styled.span`
  font-size: 12px;
  color: var(--sc-color-carnation);
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

interface Deal {
  category: string
  slug: string
  name: string
  image_url: string
  price: number
  discount_amount: number
  product_id: number
}

interface TopDealsProps {
  className?: string
}

const TopDeals = forwardRef<HTMLDivElement, TopDealsProps>((props, ref) => {
  const [deals, setDeals] = useState<Deal[]>([])
  const isMobileView = useMobileView()

  useEffect(() => {
    const fetchDeals = async () => {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY
      if (!apiKey) {
        console.error('API key is missing')
        return
      }

      try {
        const response = await fetch('/api/deals', {
          headers: {
            'x-api-key': apiKey,
          },
        })
        const data = await response.json()
        setDeals(data)
      } catch (error) {
        console.error('Error fetching deals:', error)
      }
    }

    fetchDeals()
  }, [])

  const loveDeals = deals.filter((deal) => deal.category === 'deals_love')

  return (
    <Container ref={ref} className={props.className}>
      {isMobileView
        ? loveDeals.map((deal, index) => (
            <ItemContainer key={index}>
              <Link
                href={`products/${deal.slug}`}
                aria-label={`View details of ${deal.name}`}
              >
                <ImgContainer>
                  <Image
                    alt={deal.name}
                    src={deal.image_url || '/images/products/placeholder.jpg'}
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
                    <SaleText>Sale</SaleText>
                  </PriceContainer>
                </DetailWrapper>
              </Link>
              <ButtonWrapper>
                <AddToCartButton
                  sizeVariantId={deal.product_id}
                  quantity={1}
                  productName={deal.name}
                />
              </ButtonWrapper>
            </ItemContainer>
          ))
        : loveDeals.map((deal, index) => (
            <ItemContainer key={index}>
              <Link
                href={`products/${deal.slug}`}
                aria-label={`View details of ${deal.name}`}
              >
                <ImgContainer>
                  <Image
                    alt={deal.name}
                    src={deal.image_url || '/images/products/placeholder.jpg'}
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
                    <SaleText>Sale</SaleText>
                  </PriceContainer>
                </DetailWrapper>
              </Link>
              <ButtonWrapper>
                <AddToCartButton
                  sizeVariantId={deal.product_id}
                  quantity={1}
                  productName={deal.name}
                />
              </ButtonWrapper>
            </ItemContainer>
          ))}
    </Container>
  )
})

TopDeals.displayName = 'TopDeals'

export default TopDeals
