import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styled, { css } from 'styled-components'
import StarRatings from '@/components/ReviewStars/StarRatings'
import useCurrencyFormatter from 'src/hooks/useCurrencyFormatter'
import Missing from '@/public/images/icons/block.svg'
import Arrow from '@/public/images/icons/chevronLeft.svg'

const CardContainer = styled.div<{ $isLoading: boolean }>`
  display: flex;
  position: relative;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: var(--sc-color-white);
  border-radius: 8px;
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
    rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  height: 100%;
  width: 100%;

  ${({ $isLoading }) =>
    !$isLoading &&
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
  height: 462px;
  max-height: 624px;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 462px;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    order: 2;
    width: 45%; /* Leaving some room for the add cart button on small displays */
    height: auto;
  }
`

const Title = styled(Link)`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: var(--sc-color-text);
  position: relative;

  @media (max-width: 768px) {
    order: 1;
    width: 100%;
  }
`

const Brand = styled.span`
  font-size: 14px;
  margin-bottom: 4px;
  position: relative;
`

const SlideWrapper = styled.div`
  position: relative;
  padding: 16px;
  z-index: 2;
`

const Swatches = styled.div<{ $hovered: boolean }>`
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
  top: ${({ $hovered }) => ($hovered ? '-40px' : '0')};
  visibility: ${({ $hovered }) => ($hovered ? 'visible' : 'hidden')};
  background-color: white;
  height: 100%;
  line-height: 18px;
  transition: all 0.25s ease;
`

const SwatchWrapper = styled.div<{ $hovered: boolean }>`
  display: flex;
  padding: 16px 16px 0px 16px;
  gap: 8px;
  opacity: ${({ $hovered }) => ($hovered ? '1' : '0')};
  transition: opacity 140ms ease;
`

const SwatchButton = styled.button`
  background: none;
  border: none;
  border-radius: 50%;
  overflow: hidden;
  padding: 0;
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:focus {
    outline: 2px solid var(--sc-color-primary);
  }

  img,
  svg {
    width: 24px;
    height: 24px;
  }

  svg > path {
    fill: var(--sc-color-icon);
  }
`

const MissingSwatch = styled(Missing)`
  width: 24px;
  height: 24px;
`

const ImageSlider = styled.div<{ $activeIndex: number }>`
  display: flex;
  transition: transform 0.3s ease;
  transform: ${({ $activeIndex }) => `translateX(-${$activeIndex * 100}%)`};
  width: 100%;
  height: 100%;
`

const SliderImage = styled(Image)`
  flex-shrink: 0;
  width: 100%;
  height: 462px;
  object-fit: cover;

  @media (max-width: 768px) {
    height: auto;
  }
`

const SliderNav = styled.div<{ $hovered: boolean }>`
  position: absolute;
  bottom: ${({ $hovered }) => ($hovered ? '40px' : '0')};
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 57px;
  transition: all 0.25s ease;
  z-index: 1;
  padding: 0 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.95) -42.5%,
      rgba(0, 0, 0, 0) 100%
    );
    opacity: ${({ $hovered }) => ($hovered ? '0.4' : '0')};
    transition: opacity 0.25s ease;
    z-index: -1;
  }
`

const SliderArrow = styled(Arrow)<{
  $direction: 'left' | 'right'
  $hovered: boolean
}>`
  transform: ${({ $direction }) =>
    $direction === 'left' ? 'none' : 'rotate(180deg)'};
  margin-top: 17px;
  width: 15px;
  height: 15px;
  cursor: pointer;
  opacity: ${({ $hovered }) => ($hovered ? '0.5' : '0')};
  transition: opacity 140ms ease;
  z-index: 2;
  user-select: none;

  &:hover {
    opacity: 1;
  }

  &:focus-visible {
    opacity: 1;
  }

  &:focus:not(:focus-visible) {
    box-shadow: none;
    outline: none;
  }

  > path {
    fill: #fff;
  }
`

const SliderCounter = styled.div<{ $hovered: boolean }>`
  position: absolute;
  left: 0;
  bottom: 30px;
  color: #fff;
  font-size: 12px;
  text-shadow: 0px 1px 5px rgba(0, 0, 0, 0.8);
  margin: 0 10px;
  user-select: none;
  opacity: ${({ $hovered }) => ($hovered ? '1' : '0')};
  z-index: 2;
`

const SliderDot = styled.div<{ $active: boolean; $hovered: boolean }>`
  width: 15%;
  height: 2px;
  background-color: ${({ $active }) =>
    $active ? '#fff' : 'rgba(255, 255, 255, 0.3)'};
  border: none;
  margin: 17px 4px 0px 4px;
  opacity: ${({ $hovered }) => ($hovered ? '1' : '0')};
  cursor: default;
  user-select: none;
  transition: background-color 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: -3px;
    right: -3px;
    z-index: 1;
  }
`

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  position: relative;

  @media (max-width: 768px) {
    order: 3;
    width: 55%; /* Leaving some room for the add cart button on small displays */
  }
`

const Rating = styled.h1`
  font-size: 14px;
  color: rgb(102, 102, 102);
  position: relative;
`

const PriceContainer = styled.div`
  display: flex;
  align-items: baseline;
  color: var(--sc-color-deal-text);
  position: relative;
`

const Price = styled.h1<{ $sale?: boolean }>`
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  margin-top: 8px;
  margin-bottom: 8px;
  margin-right: 5px;
  color: ${(props) => (props.$sale ? 'var(--sc-color-carnation)' : '#353a44')};
  position: relative;

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
  position: relative;
`

interface ProductCardProps {
  link: string
  title: string
  price: number
  discount?: number
  brand: string
  rating: number
  image: { image_url: string }[]
  id: string
  swatch: string
  allColors: ColorOption[]
  loading: boolean
}

interface ColorOption {
  color_variant_id: string
  color_swatch_url?: string
  color: string
  images: { image_url: string }[]
}

const ProductCard: React.FC<ProductCardProps> = ({
  link,
  title,
  price,
  discount,
  brand,
  rating,
  image,
  loading,
  allColors,
}) => {
  const formatCurrency = useCurrencyFormatter()
  const isOnSale = !!discount
  const [currentImage, setCurrentImage] = useState<{
    image_url: string
  } | null>(null)
  const [hovered, setHovered] = useState(false)
  const [imgHovered, setImgHovered] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [variantImages, setVariantImages] = useState(image)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (image && image.length > 0) {
      setCurrentImage(image[0]) // Using the first image as the main one
      setActiveImageIndex(0)
      setVariantImages(image) // Initially setting variantImages to the default images
    } else {
      setCurrentImage(null)
    }
  }, [image])

  const handleSwatchClick = (colorVariantId: string) => {
    const selectedColor = allColors.find(
      (colorOption: ColorOption) =>
        colorOption.color_variant_id === colorVariantId
    )
    if (selectedColor) {
      const colorImages = selectedColor.images || []
      if (colorImages.length > 0) {
        setCurrentImage(colorImages[0]) // Update with the first image of the selected color
        setActiveImageIndex(0)
        setVariantImages(colorImages) // Update the variantImages to the selected color's images
      } else {
        setCurrentImage(null)
        setVariantImages([])
      }
    }
  }

  const handleImageNavClick = (index: number) => {
    if (index >= 0 && index < variantImages.length) {
      setActiveImageIndex(index)
      setCurrentImage(variantImages[index])
    }
  }

  const handlePrevClick = () => {
    if (activeImageIndex > 0) {
      handleImageNavClick(activeImageIndex - 1)
    } else {
      handleImageNavClick(variantImages.length - 1) // Loop back to the last image
    }
  }

  const handleNextClick = () => {
    if (activeImageIndex < variantImages.length - 1) {
      handleImageNavClick(activeImageIndex + 1)
    } else {
      handleImageNavClick(0) // Loop back to the first image
    }
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<SVGElement>,
    direction: 'prev' | 'next'
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (direction === 'prev') {
        handlePrevClick()
      } else {
        handleNextClick()
      }
    }
  }

  const handleFocus = () => {
    setHovered(true)
    setImgHovered(true)
  }

  const handleBlur = () => {
    // Delay setting hovered to false to allow focus to move within the CardContainer
    setTimeout(() => {
      if (
        cardRef.current &&
        !cardRef.current.contains(document.activeElement)
      ) {
        setHovered(false)
        setImgHovered(false)
      }
    }, 0)
  }

  const handleMouseLeave = () => {
    // Only set hovered to false if no element inside is focused
    if (cardRef.current && !cardRef.current.contains(document.activeElement)) {
      setHovered(false)
      setImgHovered(false)
    }
  }

  if (loading || !currentImage) {
    return null
  }

  return (
    <CardContainer
      $isLoading={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
    >
      <ImageWrapper
        onMouseEnter={() => setImgHovered(true)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <Link
          href={`${link}`}
          aria-label={`View details of ${title}`}
          tabIndex={-1}
          onMouseEnter={() => setHovered(true)}
        >
          <ImageSlider $activeIndex={activeImageIndex}>
            {variantImages.map((img, index) => (
              <SliderImage
                key={index}
                alt={title}
                src={img.image_url}
                width={500}
                height={500}
              />
            ))}
          </ImageSlider>
        </Link>
        <SliderNav $hovered={imgHovered}>
          <SliderCounter $hovered={imgHovered}>
            {activeImageIndex + 1}/{variantImages.length}
          </SliderCounter>
          <SliderArrow
            $hovered={imgHovered}
            $direction="left"
            onClick={handlePrevClick}
            onKeyDown={(e: React.KeyboardEvent<SVGElement>) =>
              handleKeyDown(e, 'prev')
            }
            tabIndex={0}
            role="button"
            aria-label="Previous image"
          />
          {variantImages.map((img, index) => (
            <SliderDot
              $hovered={imgHovered}
              key={index}
              $active={index === activeImageIndex}
            />
          ))}
          <SliderArrow
            $hovered={hovered}
            $direction="right"
            onClick={handleNextClick}
            onKeyDown={(e: React.KeyboardEvent<SVGElement>) =>
              handleKeyDown(e, 'next')
            }
            tabIndex={0}
            role="button"
            aria-label="Next image"
          />
        </SliderNav>
      </ImageWrapper>
      <SlideWrapper>
        <Swatches $hovered={hovered}>
          <SwatchWrapper
            $hovered={hovered}
            onMouseEnter={() => setImgHovered(false)}
          >
            {allColors.map((colorOption: ColorOption) => (
              <SwatchButton
                key={colorOption.color_variant_id}
                onClick={() => handleSwatchClick(colorOption.color_variant_id)}
                aria-label={`Select ${colorOption.color}`}
              >
                {colorOption.color_swatch_url ? (
                  <Image
                    src={colorOption.color_swatch_url}
                    alt={colorOption.color}
                    width={24}
                    height={24}
                  />
                ) : (
                  <MissingSwatch />
                )}
              </SwatchButton>
            ))}
          </SwatchWrapper>
        </Swatches>

        <Details>
          <Title
            href={`${link}`}
            aria-label={`View details of ${title}`}
            onFocus={() => setHovered(true)}
            onBlur={handleBlur}
          >
            {title}
          </Title>
          <Brand>{brand}</Brand>
          <Rating>
            <StarRatings reviews={rating} />
          </Rating>
          <PriceContainer>
            <Price $sale={isOnSale}>{formatCurrency(discount || price)}</Price>
            {discount && (
              <span>
                reg <OriginalPrice>{formatCurrency(price)}</OriginalPrice>
              </span>
            )}
          </PriceContainer>
          {discount && <Sale>Sale</Sale>}
        </Details>
      </SlideWrapper>
    </CardContainer>
  )
}

export default ProductCard
