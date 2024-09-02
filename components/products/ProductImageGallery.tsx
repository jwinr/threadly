import Image from 'next/image'
import styled, { keyframes } from 'styled-components'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'
import { useState, useRef, MouseEvent } from 'react'

interface Product {
  name: string
  images: Array<{ image_url: string; alt_text: string }>
}

interface ProductImageGalleryProps {
  product: Product
  isMobileView: boolean
  loading: boolean
}

const loadingAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
`

const AdditionalImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  order: 3; // Make sure additional images are below the main image in mobile view

  @media (min-width: 768px) {
    order: 0; // Reset order in desktop view
  }
`

const LoaderThumbnails = styled.div`
  border-radius: 6px;
  width: 70px;
  height: 70px;
  display: grid;
  align-content: center;
  overflow: hidden;
  position: relative;
  background-color: #d6d6d6;
  animation:
    enter 0.3s forwards,
    ${loadingAnimation} 2s ease-in-out infinite;
  animation-fill-mode: forwards;

  @media (max-width: 768px) {
    animation:
      enter 0.3s 0.1s forwards,
      ${loadingAnimation} 2s ease-in-out infinite;
  }
`

const LoaderThumbnailsContainer = styled.div`
  display: grid;
  gap: 16px;
`

const AdditionalImageThumbnail = styled.div`
  border: 1px solid var(--sc-color-border-gray);
  border-radius: 6px;
  cursor: pointer;
  width: 70px;
  height: 70px;
  display: grid;
  align-content: center;
  overflow: hidden;
  position: relative;
  background-color: white;

  &:focus-visible {
    border: 2px solid var(--sc-color-blue-highlight);
    padding: 2px; // Retain the image size when the border is present
  }

  img {
    width: 100%;
    height: 100%;
  }
`

const CarouselContainer = styled.div`
  display: flex;
  width: 100%;
  background-color: white;
  height: 290px;
  order: 2; // Make sure main image is below the product details in mobile view
`

const LoaderImageContainer = styled.div`
  max-width: 50%;
  min-width: 50%;
  border-radius: 8px;
  background-color: #d6d6d6;
  animation:
    enter 0.3s forwards,
    ${loadingAnimation} 2s ease-in-out infinite;
  animation-fill-mode: forwards;

  @media (max-width: 768px) {
    animation:
      enter 0.3s 0.1s forwards,
      ${loadingAnimation} 2s ease-in-out infinite;
  }
`

const MainImageContainer = styled.div<{ $zoomed: boolean }>`
  max-width: 50%;
  min-width: 50%;
  border-radius: 8px;
  border-style: solid;
  border-width: 1px;
  border-color: ${($zoomed) => ($zoomed ? '#000' : 'transparent')};
  height: 100%;
  background-color: var(--sc-color-white);
  overflow: hidden;
  position: relative;
  cursor: ${($zoomed) => ($zoomed ? 'zoom-out' : 'zoom-in')};
  outline: none;

  .zoomed-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 200%; // Double the size for zoom effect
    height: 200%; // Double the size for zoom effect
    transform-origin: center center; // Will be updated dynamically
    transform: scale(1.5); // Initial zoom
    pointer-events: none;
    z-index: 10;
    transition:
      transform 0.1s ease,
      transform-origin 0.1s ease; // Smooth transition
  }

  .image-row {
    display: flex;
    transition: transform 0.5s ease;
    height: 100%;
    width: 100%;
  }

  .image-container {
    width: 100%;
    flex-basis: 100%;
    min-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
    user-select: none;
    position: relative;

    @media (max-width: 1024px) {
      padding: 25px;
      user-select: auto;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
  }
`

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  product,
  isMobileView,
  loading,
}) => {
  const [zoomed, setZoomed] = useState(false)
  const [hoveredImage, setHoveredImage] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const mainImageContainerRef = useRef<HTMLDivElement | null>(null)
  const imageRefs = useRef<(HTMLImageElement | null)[]>([])
  const zoomedImageRef = useRef<HTMLImageElement | null>(null)

  if (loading) {
    return (
      <>
        <LoaderThumbnailsContainer>
          {Array.from({ length: 4 }, (_, index) => (
            <LoaderThumbnails key={index} />
          ))}
        </LoaderThumbnailsContainer>
        <LoaderImageContainer />
      </>
    )
  }

  const handleImageClick = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = mainImageContainerRef.current!.getBoundingClientRect()

    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    if (zoomedImageRef.current) {
      // Set the transform-origin immediately
      zoomedImageRef.current.style.transformOrigin = `${x}% ${y}%`

      // Trigger the zoom effect immediately after setting the transform-origin
      if (!zoomed) {
        zoomedImageRef.current.style.transform = 'scale(2)'
      } else {
        zoomedImageRef.current.style.transform = 'scale(1)'
      }
    }

    setZoomed((prevZoomed) => !prevZoomed)
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!zoomed || !mainImageContainerRef.current || !zoomedImageRef.current) {
      return
    }

    const { left, top, width, height } = mainImageContainerRef.current.getBoundingClientRect()

    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    zoomedImageRef.current.style.transformOrigin = `${x}% ${y}%`
  }

  const handleMouseLeave = () => {
    if (zoomed) {
      setZoomed(false)
    }
  }

  const handleThumbnailHover = (index: number) => {
    setCurrentIndex(index)
    setHoveredImage(index)
  }

  return (
    <>
      {!isMobileView && (
        <AdditionalImageContainer>
          {product.images.map((item, index) => (
            <AdditionalImageThumbnail
              key={index}
              className={hoveredImage === index ? 'additional-image-hovered' : ''}
              onMouseOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleThumbnailHover(index)
              }}
            >
              <Image src={item.image_url} width={100} height={100} alt={item.alt_text} />
            </AdditionalImageThumbnail>
          ))}
        </AdditionalImageContainer>
      )}
      {isMobileView ? (
        <CarouselContainer>
          <Swiper pagination={{ dynamicBullets: true }} modules={[Pagination]} spaceBetween={10}>
            {product.images.map((item, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={item.image_url}
                  width={250}
                  height={250}
                  alt={item.alt_text}
                  priority={index === 0}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </CarouselContainer>
      ) : (
        <MainImageContainer
          ref={mainImageContainerRef}
          onClick={handleImageClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          $zoomed={zoomed}
        >
          <div
            className="image-row"
            style={{
              transform: `translate3d(${-100 * currentIndex}%, 0, 0)`,
            }}
          >
            {product.images.map((item, index) => (
              <div key={index} className="image-container">
                <Image
                  ref={(el) => {
                    imageRefs.current[index] = el
                  }}
                  src={item.image_url}
                  width={880}
                  height={880}
                  quality={80}
                  alt={item.alt_text}
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
          {zoomed && (
            <Image
              className="zoomed-image"
              ref={zoomedImageRef}
              src={product.images[currentIndex].image_url}
              width={2000}
              height={2000}
              quality={100}
              alt={product.images[currentIndex].alt_text}
            />
          )}
        </MainImageContainer>
      )}
    </>
  )
}

export default ProductImageGallery
