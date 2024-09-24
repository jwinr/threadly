import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styled from 'styled-components'

const Title = styled.h2`
  text-align: center;
  font-size: 38px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--sc-color-title);
`

const CardContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
`

const CardImage = styled.div`
  width: 100%;
  height: 100%;
  transform: scale(1.3);
  transform-origin: 50% 0;
  transition: transform 0.6s cubic-bezier(0.7, 0, 0, 1);

  img {
    object-fit: cover;
  }
`

const CardOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background-color: #f1564f;
  mask-image: linear-gradient(0deg, #000 15%, rgba(0, 0, 0, 0.5) 54.75%);
  transform: scaleY(1.2);
  transform-origin: 50% 0;
  transition: transform 0.6s cubic-bezier(0.7, 0, 0, 1);
  z-index: 5;
`

const Card = styled(Link)`
  background-color: #fe887d;
  border-radius: 16px;
  overflow: hidden;
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  user-select: none;
  cursor: pointer;

  &:focus,
  :focus-visible {
    border-radius: 16px !important;
  }

  &:hover ${CardImage}, &:focus ${CardImage} {
    transform: scale(1.2); // Scale the image back to original size
  }

  &:hover ${CardOverlay}, &:focus ${CardOverlay} {
    transform: scaleY(
      1
    ); // Move the overlay when the card is hovered or focused
  }
`

const CardText = styled.div`
  font-size: 22px;
  font-weight: 700;
  padding: 20px;
  color: white;
  z-index: 10;
`

const FeaturedCategories: React.FC = () => {
  return (
    <div>
      <Title>What's new and trending</Title>
      <CardContainer>
        <Card
          href="/categories/best-sellers-men"
          passHref
          className="button-wrapper"
        >
          <CardOverlay />
          <CardImage>
            <Image
              src={'/images/model_3.jpg'}
              alt="Best Sellers for Men"
              fill={true}
            />
          </CardImage>
          <CardText>Mens' Best Sellers</CardText>
        </Card>
        <Card
          href="/categories/new-arrivals-men"
          passHref
          className="button-wrapper"
        >
          <CardOverlay />
          <CardImage>
            <Image
              src={'/images/model_2.jpg'}
              alt="New Arrivals for Men"
              fill={true}
            />
          </CardImage>
          <CardText>Mens' New Arrivals</CardText>
        </Card>
        <Card
          href="/categories/best-sellers-women"
          passHref
          className="button-wrapper"
        >
          <CardOverlay />
          <CardImage>
            <Image
              src={'/images/model_4.jpg'}
              alt="Best Sellers for Women"
              fill={true}
            />
          </CardImage>
          <CardText>Womens' Best Sellers</CardText>
        </Card>
        <Card
          href="/categories/new-arrivals-women"
          passHref
          className="button-wrapper"
        >
          <CardOverlay />
          <CardImage>
            <Image
              src={'/images/model_1.jpg'}
              alt="New Arrivals for Women"
              fill={true}
            />
          </CardImage>
          <CardText>Womens' New Arrivals</CardText>
        </Card>
      </CardContainer>
    </div>
  )
}

export default FeaturedCategories
