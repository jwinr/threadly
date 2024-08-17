import Image from "next/image"
import styled from "styled-components"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import { Pagination } from "swiper/modules"
import { useState, useEffect, useRef } from "react"
import PropFilter from "@/utils/PropFilter"
import VideoIcon from "@/public/images/icons/video.svg"

const FilteredDiv = PropFilter("div")(["mediaType", "zoomed", "slideIndex"])

const AdditionalImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  order: 3; // Make sure additional images are below the main image in mobile view

  @media (min-width: 768px) {
    order: 0; // Reset order in desktop view
  }
`

const VideoPlay = styled(VideoIcon)`
  position: absolute;
  width: 40px;
  height: 40px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0.9;

  > path {
    fill: white;
  }

  @media (max-width: 768px) {
    pointer-events: auto;
  }
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

  img,
  video {
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

  .next-video-container {
    height: 100%;
  }
`

const MainImageContainer = styled(FilteredDiv)`
  max-width: 50%;
  border-radius: 8px;
  border-style: solid;
  border-width: 1px;
  border-color: ${(props) => (props.zoomed ? "#000" : "transparent")};
  height: 100%;
  background-color: var(--sc-color-white);
  overflow: hidden;
  position: relative;
  cursor: ${(props) =>
    props.mediaType === "image"
      ? props.zoomed
        ? "zoom-out"
        : "zoom-in"
      : "default"};
  outline: none;

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

    img,
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
  }
`

const ProductImageGallery = ({ product, isMobileView }) => {
  const [zoomed, setZoomed] = useState(false)
  const [hoveredImage, setHoveredImage] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const mainImageContainerRef = useRef(null)
  const imageRefs = useRef([])

  // Combine videos and images into a single array for indexing
  const media = [
    ...product.videos.map((video) => ({ type: "video", ...video })),
    ...product.images.map((image) => ({ type: "image", ...image })),
  ]

  const handleImageClick = (e) => {
    const mediaItem = media[currentIndex]

    // Disable zoom for video
    if (mediaItem.type !== "image") return

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
    if (!zoomed) return

    const imageRef = imageRefs.current[currentIndex]
    if (imageRef) {
      const { left, top, width, height } =
        mainImageContainerRef.current.getBoundingClientRect()
      const x = ((e.clientX - left) / width) * 100
      const y = ((e.clientY - top) / height) * 100
      imageRef.style.transformOrigin = `${x}% ${y}%`
    }
  }

  const handleMouseLeave = () => {
    if (zoomed) {
      setZoomed(false)
    }
  }

  const handleThumbnailHover = (index) => {
    setCurrentIndex(index)
    setHoveredImage(
      media[index].type === "image"
        ? media[index].image_url
        : media[index].thumbnail_url
    )
  }

  return (
    <>
      {!isMobileView && (
        <AdditionalImageContainer>
          {media.map((item, index) => (
            <AdditionalImageThumbnail
              key={index}
              className={
                hoveredImage ===
                (item.type === "image" ? item.image_url : item.thumbnail_url)
                  ? "additional-image-hovered"
                  : ""
              }
              onMouseOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleThumbnailHover(index)
              }}
            >
              {item.type === "image" ? (
                <Image
                  src={item.image_url}
                  width={100}
                  height={100}
                  alt={`Product Thumbnail ${index} - ${product.name}`}
                />
              ) : (
                <>
                  <Image
                    src={item.thumbnail_url}
                    alt={item.alt_text}
                    width={100}
                    height={100}
                  />
                  <VideoPlay />
                </>
              )}
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
            {media.map((item, index) => (
              <SwiperSlide key={index}>
                {item.type === "image" ? (
                  <Image
                    src={item.image_url}
                    width={250}
                    height={250}
                    alt={`Product Image ${index} - ${product.name}`}
                    priority={index === 0}
                  />
                ) : (
                  <video muted loop autoPlay>
                    <source src={`${item.video_url}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
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
          mediaType={media[currentIndex]?.type}
        >
          <div
            className="image-row"
            style={{
              transform: `translate3d(${-100 * currentIndex}%, 0, 0)`,
            }}
          >
            {media.map((item, index) => (
              <div key={index} className="image-container">
                {item.type === "image" ? (
                  <Image
                    ref={(el) => (imageRefs.current[index] = el)}
                    src={item.image_url}
                    width={500}
                    height={500}
                    quality={90}
                    alt="Inventory item"
                    priority={index === 0}
                    style={{
                      transform:
                        zoomed && currentIndex === index
                          ? "scale(3)"
                          : "scale(1)",
                    }}
                  />
                ) : (
                  <video muted loop autoPlay>
                    <source src={`${item.video_url}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ))}
          </div>
        </MainImageContainer>
      )}
    </>
  )
}

export default ProductImageGallery
