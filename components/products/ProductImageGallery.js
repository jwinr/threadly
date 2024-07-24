import Image from "next/image"
import styled from "styled-components"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import { Pagination } from "swiper/modules"
import { useState, useRef } from "react"
import PropFilter from "../../utils/PropFilter"

const AdditionalImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  order: 3; // Make sure additional images are below the main image in mobile view

  @media (min-width: 768px) {
    order: 0; // Reset order in desktop view
  }
`

const AdditionalImageThumbnail = styled.div`
  border: 1px solid var(--sc-color-divider);
  border-radius: 6px;
  cursor: pointer;
  padding: 3px;
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
  border-radius: 8px;
  width: 100%;
  background-color: white;
  height: 290px;
  order: 2; // Make sure main image is below the product details in mobile view

  .swiper-slide {
    display: flex;
    justify-content: center;
  }

  img {
    width: 360px;
    object-fit: contain;
  }
`

const MainImageContainer = styled(PropFilter("div")(["zoomed", "slideIndex"]))`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border-style: solid;
  border-width: 1px;
  border-color: ${(props) => (props.zoomed ? "#000" : "transparent")};
  width: 100%;
  background-color: var(--sc-color-white);
  overflow: hidden;
  position: relative;
  cursor: ${(props) => (props.zoomed ? "zoom-out" : "zoom-in")};
  user-select: none;
  outline: none;

  .image-row {
    display: flex;
    transition: transform 0.5s ease;
    height: 100%;
    width: 100%;
  }

  .image-container {
    flex: 0 0 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    outline: none;

    @media (max-width: 1024px) {
      padding: 25px; // Spacing for the image slides on tablet displays
    }

    img {
      width: auto;
      height: auto;
      transition: transform 0.3s ease;
      transform: ${(props) => (props.zoomed ? "scale(3)" : "scale(1)")};

      @media (max-width: 1024px) {
        width: 100%; // Constrain the image on tablets
      }
    }
  }
`

const ProductImageGallery = ({
  product,
  hoveredImage,
  setHoveredImage,
  isMobileView,
}) => {
  const [zoomed, setZoomed] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const mainImageContainerRef = useRef(null)
  const imageRefs = useRef([])

  const handleImageClick = (e) => {
    const imageRef = imageRefs.current[currentIndex]
    if (imageRef) {
      const { left, top, width, height } =
        mainImageContainerRef.current.getBoundingClientRect()
      const x = ((e.clientX - left) / width) * 100
      const y = ((e.clientY - top) / height) * 100
      imageRef.style.transformOrigin = `${x}% ${y}%`
      setZoomed((prevZoomed) => !prevZoomed)
    }
  }

  const handleMouseMove = (e) => {
    if (zoomed) {
      const imageRef = imageRefs.current[currentIndex]
      if (imageRef) {
        const { left, top, width, height } =
          mainImageContainerRef.current.getBoundingClientRect()
        const x = ((e.clientX - left) / width) * 100
        const y = ((e.clientY - top) / height) * 100
        imageRef.style.transformOrigin = `${x}% ${y}%`
      }
    }
  }

  const handleMouseLeave = () => {
    if (zoomed) {
      setZoomed(false)
    }
  }

  const handleThumbnailHover = (index) => {
    setCurrentIndex(index)
    setHoveredImage(product.images[index].image_url)
  }

  return (
    <>
      {!isMobileView && (
        <AdditionalImageContainer>
          {product.images.map((image, index) => (
            <AdditionalImageThumbnail
              key={index}
              className={
                hoveredImage === image.image_url
                  ? "additional-image-hovered"
                  : ""
              }
              onMouseOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleThumbnailHover(index)
              }}
            >
              <Image
                src={image.image_url}
                width={500}
                height={500}
                alt={`Product Thumbnail ${index} - ${product.name}`}
              />
            </AdditionalImageThumbnail>
          ))}
        </AdditionalImageContainer>
      )}
      {isMobileView ? (
        <CarouselContainer>
          <Swiper
            pagination={{ dynamicBullets: true }}
            modules={[Pagination]}
            spaceBetween={10}
          >
            {product.images.map((image, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={image.image_url}
                  width={250}
                  height={250}
                  alt={`Product Image ${index} - ${product.name}`}
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
          zoomed={zoomed}
          slideIndex={currentIndex}
        >
          <div
            className="image-row"
            style={{
              transform: `translate3d(${-100 * currentIndex}%, 0, 0)`,
            }}
          >
            {product.images.map((image, index) => (
              <div key={index} className="image-container">
                <Image
                  ref={(el) => (imageRefs.current[index] = el)}
                  src={image.image_url}
                  width={500}
                  height={500}
                  alt="Inventory item"
                  priority={index === 0}
                  style={{
                    transform:
                      zoomed && currentIndex === index
                        ? "scale(3)"
                        : "scale(1)",
                  }}
                />
              </div>
            ))}
          </div>
        </MainImageContainer>
      )}
    </>
  )
}

export default ProductImageGallery
