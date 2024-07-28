import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import AddToCartButton from "../shopping/AddToCartButton"
import styled from "styled-components"
import StarRatings from "../review-stars/StarRatings"
import { LiaTruckMovingSolid } from "react-icons/lia"
import AddToFavoritesButton from "../shopping/AddToFavoritesButton"

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: var(--sc-color-white);
  border-radius: 8px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
  height: 100%;

  @media (max-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  padding: 8px;
  height: 218px;

  img {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 768px) {
    order: 2;
    width: 45%; /* Leaving some room for the add cart button on small displays */
    height: auto;
  }
`

const Title = styled(Link)`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    order: 1;
    width: 100%;
  }
`

const Brand = styled.span`
  font-size: 14px;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;

  button {
    font-size: 12px;
    min-height: auto;

    svg {
      font-size: 16px;
    }
  }
`

const Bookmark = styled.button`
  padding: 10px;
  border-radius: 50%;
  color: var(--sc-color-text);
  display: flex;
  border: 1px solid var(--sc-color-border-gray);
`

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;

  @media (max-width: 768px) {
    order: 3;
    width: 55%; /* Leaving some room for the add cart button on small displays */
  }
`

const Rating = styled.h1`
  font-size: 14px;
  color: rgb(102, 102, 102);
`

const PriceContainer = styled.div`
  display: flex;
  align-items: baseline;
`

const Price = styled.h1`
  font-size: 28px;
  font-weight: 500;
  margin-right: 5px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`

const OriginalPrice = styled.span`
  font-size: 16px;
  font-weight: 400;
  color: gray;
  text-decoration: line-through;
`

const ShippingContainer = styled.div`
  display: flex;
  font-size: 14px;
  align-items: center;

  @media (max-width: 768px) {
    padding: 5px 0;
  }
`

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-right: 5px;
  font-size: 20px;
`

const ProductCard = ({
  link,
  title,
  price,
  discount,
  brand,
  rating,
  image,
  id,
  loading,
}) => {
  if (loading) {
    return
  }

  const [currentImage, setCurrentImage] = useState(
    image.find((image) => image.is_main)
  )

  // Update the currentImage when the image prop changes
  useEffect(() => {
    setCurrentImage(image.find((image) => image.is_main))
  }, [image])

  // Conditional check to ensure currentImage is defined, if not, fallback to a placeholder
  const imageUrl = currentImage
    ? currentImage.image_url
    : "/images/products/placeholder.jpg"

  return (
    <CardContainer>
      <ImageWrapper>
        <Link href={`${link}`} aria-label={`View details of ${title}`}>
          <Image alt={title} src={imageUrl} width={500} height={500} />
        </Link>
      </ImageWrapper>
      <Title href={`${link}`} aria-label={`View details of ${title}`}>
        {title}
      </Title>
      <Details>
        <Brand>{brand}</Brand>
        <Rating>
          <StarRatings reviews={rating} />
        </Rating>
        <PriceContainer>
          <Price>{`$${discount || price}`}</Price>
          {discount && (
            <span>
              reg <OriginalPrice>{`$${price}`}</OriginalPrice>
            </span>
          )}
        </PriceContainer>
        <ShippingContainer>
          <IconContainer>
            <LiaTruckMovingSolid aria-hidden="true" />
          </IconContainer>
          <p>Free Shipping</p>
        </ShippingContainer>
        <ButtonWrapper>
          <AddToCartButton productId={id} quantity={1} productName={title} />
          <AddToFavoritesButton productId={id} productName={title} />
        </ButtonWrapper>
      </Details>
    </CardContainer>
  )
}

export default ProductCard
