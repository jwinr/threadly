import Image from 'next/image'
import styled from 'styled-components'
import { ProductImage } from '@/types/product'

interface ProductThumbnailsProps {
  hoveredImage: number
  onThumbnailHover: (index: number) => void
  loading: boolean
  images: ProductImage[]
}

const AdditionalImageContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  width: 50%;
  order: 3; // Make sure additional images are below the main image in mobile view

  @media (min-width: 768px) {
    order: 0; // Reset order in desktop view
  }
`

const AdditionalImageThumbnail = styled.div`
  border: 1px solid var(--sc-color-border-gray);
  border-radius: 6px;
  cursor: pointer;
  width: auto;
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

const ProductThumbnails: React.FC<ProductThumbnailsProps> = ({
  hoveredImage,
  onThumbnailHover,
  loading,
  images,
}) => {
  if (loading) {
    return (
      <>
        <span>Loading...</span>
      </>
    )
  }

  return (
    <AdditionalImageContainer>
      {images.map((item: { image_url: string; alt_text: string }, index: number) => (
        <AdditionalImageThumbnail
          key={index}
          className={hoveredImage === index ? 'additional-image-hovered' : ''}
          onMouseOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onThumbnailHover(index)
          }}
        >
          <Image src={item.image_url} width={100} height={100} alt={item.alt_text} />
        </AdditionalImageThumbnail>
      ))}
    </AdditionalImageContainer>
  )
}

export default ProductThumbnails
