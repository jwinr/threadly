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
import useProductData from '@/hooks/useProductData'

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
`

const AddCartWrapper = styled.div`
  > button {
    min-height: 44px;
    width: 100%;
    font-size: 16px;
  }
`

function ProductDetails() {
  const { slug, variantSku } = useParams() as { slug: string; variantSku: string }
  const { product, categoryName, categorySlug } = useProductData(slug, variantSku)
  const { deliveryDate, dayOfWeek, returnDate } = ShippingInfo()
  const isMobileView = useMobileView()
  const [loading, setLoading] = useState(true)
  const [selectedSizeVariantId, setSelectedSizeVariantId] = useState<string | null>(null)

  useEffect(() => {
    if (product) {
      setLoading(false)
    }
  }, [product])

  return (
    <div>
      <Breadcrumb loading={loading} categoryName={categoryName} categorySlug={categorySlug} />
      <PageWrapper>
        <MainSection>
          <ProductImageGallery loading={loading} product={product} isMobileView={isMobileView} />
          <InfoCardWrapper>
            <ProductInfo
              loading={loading}
              product={product}
              deliveryDate={deliveryDate}
              dayOfWeek={dayOfWeek}
              returnDate={returnDate}
            />
            <ProductAttributes
              product={product}
              loading={loading}
              onSizeVariantSelected={setSelectedSizeVariantId}
            />
            <AddCartWrapper>
              {product && (
                <AddToCartButton
                  sizeVariantId={selectedSizeVariantId}
                  quantity={1}
                  productName={product.name}
                />
              )}
            </AddCartWrapper>
          </InfoCardWrapper>
        </MainSection>
        <ProductOverview loading={loading} product={product} />
      </PageWrapper>
    </div>
  )
}

export default ProductDetails
