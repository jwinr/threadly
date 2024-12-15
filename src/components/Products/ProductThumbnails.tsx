import Image from 'next/image'
import styled from 'styled-components'
import { ProductImage } from '@/types/product'

interface ProductThumbnailProps {
  hoveredImage: number | null
  onThumbnailHover: (index: number) => void
  loading: boolean
  images: ProductImage[]
}

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
  border-radius: 6px;
  cursor: pointer;
  width: 128px;
  min-height: 128px;
  display: grid;
  align-content: center;
  overflow: hidden;
  position: relative;
  background-color: white;

  img {
    width: 100%;
    height: 100%;
  }
`

const LoaderThumbnailContainer = styled.div`
  width: 128px;
  height: 128px;
  border-radius: 6px;
  background-color: #ededed;
  animation: loadingAnimation 1s ease-in-out infinite;
  animation-fill-mode: forwards;
`

const ProductThumbnails: React.FC<ProductThumbnailProps> = ({
  hoveredImage,
  onThumbnailHover,
  loading,
  images,
}) => {
  if (loading || !images) {
    return (
      <AdditionalImageContainer>
        {[...Array(4)].map((_, index) => (
          <LoaderThumbnailContainer key={index} />
        ))}
      </AdditionalImageContainer>
    )
  }

  return (
    <AdditionalImageContainer>
      {images.map((item, index) => (
        <AdditionalImageThumbnail
          key={index}
          className={hoveredImage === index ? 'additional-image-hovered' : ''}
          onMouseOver={() => {
            onThumbnailHover(index)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onThumbnailHover(index);
            }
          }}
          tabIndex={0}
        >
          <Image
            src={item.image_url}
            width={100}
            height={100}
            alt={item.alt_text || 'Product image'}
            priority={true}
          />
        </AdditionalImageThumbnail>
      ))}
    </AdditionalImageContainer>
  )
}

export default ProductThumbnails
