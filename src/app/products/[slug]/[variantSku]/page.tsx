'use client'

import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Breadcrumb from '@/components/Elements/Breadcrumb'
import { useParams } from 'next/navigation'
import { useMobileView } from '@/context/MobileViewContext'
import ShippingInfo from '@/components/Shopping/ShippingInfo'
import ProductImageGallery from '@/components/Products/ProductImageGallery'
import ProductInfo from '@/components/Products/ProductInfo'
import ProductAttributes from '@/components/Products/ProductAttributes'
import ProductOverview from '@/components/Products/ProductOverview'
import AddToCartButton from '@/components/Shopping/AddToCartButton'
import useProductData from 'src/hooks/useProductData'
import ProductThumbnails from '@/components/Products/ProductThumbnails'
import { Product } from '@/types/product'

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px 15px 75px 15px; // Leave some room for the breadcrumb component on mobile view

  @media (min-width: 768px) {
    padding: 45px 75px 75px 75px;
  }
`

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`

const InfoCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`

const AddCartWrapper = styled.div`
  > button {
    min-height: 44px;
    width: 100%;
    font-size: 16px;
  }
`

function ProductDetails() {
  const { slug, variantSku } = useParams()
  const { product, categoryName, categorySlug } = useProductData(
    slug as string,
    variantSku as string
  )
  const { deliveryDate, dayOfWeek, returnDate } = ShippingInfo()
  const isMobileView = useMobileView()
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedSizeVariantId, setSelectedSizeVariantId] = useState<
    string | undefined
  >()
  const [hoveredImage, setHoveredImage] = useState<number>(0)

  useEffect(() => {
    if (!product) {
      setLoading(false)
    }
  }, [product])

  const handleThumbnailHover = (index: number) => {
    setHoveredImage(index)
  }

  return (
    <div>
      <Breadcrumb
        loading={loading}
        categoryName={categoryName}
        categorySlug={categorySlug}
      />
      <PageWrapper>
        <MainSection>
          <ProductImageGallery
            loading={loading}
            product={product as Product}
            isMobileView={isMobileView}
            hoveredImage={hoveredImage}
          />
          <InfoCardWrapper>
            <ProductInfo
              loading={loading}
              product={product as Product}
              deliveryDate={deliveryDate}
              dayOfWeek={dayOfWeek}
              returnDate={returnDate}
            />
            <ProductAttributes
              product={product as Product}
              loading={loading}
              onSizeVariantSelected={setSelectedSizeVariantId}
            />
            <AddCartWrapper>
              <AddToCartButton
                loading={loading}
                sizeVariantId={Number(selectedSizeVariantId) || 0}
                quantity={1}
                productName={product?.name || ''}
              />
            </AddCartWrapper>
          </InfoCardWrapper>
        </MainSection>
        {!isMobileView && (
          <ProductThumbnails
            loading={loading}
            images={
              (product && 'images' in product ? product.images : []) as {
                image_url: string
                alt_text: string
              }[]
            }
            hoveredImage={hoveredImage}
            onThumbnailHover={handleThumbnailHover}
          />
        )}
        <ProductOverview loading={loading} product={product as Product} />
      </PageWrapper>
    </div>
  )
}

export default ProductDetails
