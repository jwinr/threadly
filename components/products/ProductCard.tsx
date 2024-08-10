import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import AddToCartButton from "../Shopping/AddToCartButton"
import styled, { css } from "styled-components"
import StarRatings from "../ReviewStars/StarRatings"
import Truck from "../../public/images/icons/truck.svg"
import AddToFavoritesButton from "../Shopping/AddToFavoritesButton"
import useCurrencyFormatter from "../../hooks/useCurrencyFormatter"

const CardContainer = styled.div<{ isLoading: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: var(--sc-color-white);
  border-radius: 8px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
  height: 100%;
  max-height: 475px;
  min-height: 475px;

  ${({ isLoading }) =>
    !isLoading &&
    css`
      animation: fadeIn 0.2s ease-in-out forwards;
    `}

  @media (max-width: 768px) {
    min-height: 100%;
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
  margin-bottom: 4px;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;

  button {
    min-height: 32px;
  }
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
  color: var(--sc-color-deal-text);
`

const Price = styled.h1<{ sale?: boolean }>`
  font-size: 24px;
  font-weight: 500;
  line-height: 1;
  margin-top: 8px;
  margin-bottom: 8px;
  margin-right: 5px;
  color: ${(props) => (props.sale ? "var(--sc-color-carnation)" : "#353a44")};

  @media (max-width: 768px) {
    font-size: 16px;
  }
`

const OriginalPrice = styled.span`
  font-size: 16px;
  font-weight: 400;
  color: var(--sc-color-deal-text);
  text-decoration: line-through;
`

const Sale = styled.span`
  display: flex;
  font-weight: 600;
  line-height: 1;
  margin-bottom: 8px;
  color: var(--sc-color-carnation);
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

interface ProductCardProps {
  link: string
  title: string
  price: number
  discount?: number
  brand: string
  rating: number
  image: { is_main: boolean; image_url: string }[]
  id: string
  loading: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({
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
  const formatCurrency = useCurrencyFormatter()
  const isOnSale = !!discount
  const [currentImage, setCurrentImage] = useState<{
    is_main: boolean
    image_url: string
  } | null>(null)

  useEffect(() => {
    if (image) {
      const mainImage = image.find((img) => img.is_main) || image[0]
      setCurrentImage(mainImage)
    }
  }, [image])

  if (loading || !currentImage) {
    return null
  }

  const imageUrl = currentImage.image_url || "/images/products/placeholder.jpg"

  return (
    <CardContainer isLoading={loading}>
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
          <Price sale={isOnSale}>{formatCurrency(discount || price)}</Price>
          {discount && (
            <span>
              reg <OriginalPrice>{formatCurrency(price)}</OriginalPrice>
            </span>
          )}
        </PriceContainer>
        {discount && <Sale>Sale</Sale>}
        <ShippingContainer>
          <IconContainer>
            <Truck />
          </IconContainer>
          <p>Free shipping</p>
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
