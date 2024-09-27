import Image from 'next/image'
import styled, { keyframes } from 'styled-components'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'
import { useEffect, useState, useRef, MouseEvent } from 'react'
import { ProductImage } from '@/types/product'

interface Product {
  images?: ProductImage[]
}

interface ProductImageGalleryProps {
  product: Product
  isMobileView: boolean
  loading: boolean
  hoveredImage: number
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

const CarouselContainer = styled.div`
  display: flex;
  width: 100%;
  background-color: white;
  height: 290px;
  order: 2; // Make sure main image is below the product details in mobile view
`

const LoaderImageContainer = styled.div`
  width: 100%;
  height: 500px;
  border-radius: 8px;
  background-color: #d6d6d6;
  animation: ${loadingAnimation} 2s ease-in-out infinite;
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
  border-color: ${({ $zoomed }) => ($zoomed ? '#000' : 'transparent')};
  height: 500px;
  background-color: var(--sc-color-white);
  overflow: hidden;
  position: relative;
  cursor: ${({ $zoomed }) => ($zoomed ? 'zoom-out' : 'zoom-in')};
  outline: none;

  .zoomed-image {
    position: absolute;
    top: 0;
    left: 0;
    width: ${({ $zoomed }) => ($zoomed ? '150%' : '100%')};
    height: ${({ $zoomed }) => ($zoomed ? '150%' : '100%')};
    transform-origin: ${({ $zoomed }) =>
      $zoomed ? 'center center' : 'center center'};
    transform: ${({ $zoomed }) => ($zoomed ? 'scale(1.5)' : 'scale(1)')};
    transition: transform 0.3s ease;
    pointer-events: none;
    z-index: 10;
  }

  .image-row {
    display: flex;
    transition: transform 0.5s ease;
    height: 100%;
    width: 100%;
  }

  .image-container {
    width: 575px;
    flex-basis: 100%;
    min-width: 100%;
    height: 500px;
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
  hoveredImage,
}) => {
  const [zoomed, setZoomed] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(hoveredImage)
  const mainImageContainerRef = useRef<HTMLDivElement | null>(null)
  const imageRefs = useRef<(HTMLImageElement | null)[]>([])
  const zoomedImageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    setCurrentIndex(hoveredImage)
  }, [hoveredImage])

  if (loading) {
    return (
      <>
        <LoaderImageContainer />
      </>
    )
  }

  const handleImageClick = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      mainImageContainerRef.current?.getBoundingClientRect() || {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      }

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

    const { left, top, width, height } =
      mainImageContainerRef.current.getBoundingClientRect()

    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    zoomedImageRef.current.style.transformOrigin = `${x}% ${y}%`
  }

  const handleMouseLeave = () => {
    if (zoomed) {
      setZoomed(false)
    }
  }

  return (
    <>
      {isMobileView ? (
        <CarouselContainer>
          <Swiper
            pagination={{ dynamicBullets: true }}
            modules={[Pagination]}
            spaceBetween={10}
          >
            {product?.images?.map((item, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={item.image_url}
                  width={250}
                  height={250}
                  alt={item.alt_text ? item.alt_text : ''}
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
            {product?.images?.map((item, index) => (
              <div key={index} className="image-container">
                <Image
                  ref={(el) => {
                    imageRefs.current[index] = el
                  }}
                  src={item.image_url}
                  width={880}
                  height={880}
                  quality={80}
                  alt={item.alt_text ? item.alt_text : ''}
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
          {zoomed && (
            <Image
              className="zoomed-image"
              ref={zoomedImageRef}
              src={product.images?.[currentIndex]?.image_url || ''}
              width={2000}
              height={2000}
              quality={100}
              alt={product.images?.[currentIndex]?.alt_text || ''}
            />
          )}
        </MainImageContainer>
      )}
    </>
  )
}

export default ProductImageGallery
