import styled from 'styled-components'
import { Product } from '@/types/product'

interface ProductOverviewProps {
  product: Product
  loading: boolean
}

interface ProductDescriptionProps {
  description: string
}

const ProductSpecifications = styled.div`
  display: grid;
  grid-template-columns: 1.78fr 1fr;
  flex-direction: column;
  margin-top: 20px;
  background-color: white;
  border-top: 1px solid var(--sc-color-border-gray);
  padding: 64px 0;

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`

const ProductOverviewSection = styled.div`
  flex: 1;
  padding-right: 20px;
  margin-right: 16vw;

  @media (max-width: 767px) {
    margin-bottom: 20px;
  }

  ul {
    font-size: 18px;
    padding-left: 20px;
  }
`

const ProductSpecs = styled.div`
  flex: 1;

  h1 {
    color: var(--sc-color-title);
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 10px;
  }

  p {
    font-size: 15px;
    margin-bottom: 20px;
  }

  ul {
    padding-left: 20px;
  }
`

const Section = styled.div`
  margin-bottom: 20px;

  p {
    font-size: 18px;
    margin-bottom: 20px;
  }

  ul {
    font-size: 15px;
  }
`

const LoaderDescription = styled.div`
  padding: 64px 0;
  border-radius: 8px;
  min-height: 250px;
  width: 75%;
  background-color: #ededed;
  animation: loadingAnimation 1s ease-in-out infinite;
  animation-fill-mode: forwards;

  @media (max-width: 768px) {
    animation:
      enter 0.3s 0.1s forwards,
      loadingAnimation 1s ease-in-out infinite;
  }
`

const LoaderFeatures = styled.div`
  padding: 64px 0;
  border-radius: 8px;
  min-height: 250px;
  width: 75%;
  background-color: #d6d6d6;
  animation: loadingAnimation 1s ease-in-out infinite;
  animation-fill-mode: forwards;

  @media (max-width: 768px) {
    animation:
      enter 0.3s 0.1s forwards,
      loadingAnimation 1s ease-in-out infinite;
  }
`

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
}) => (
  <Section>
    <p>{description}</p>
  </Section>
)

const ProductOverview: React.FC<ProductOverviewProps> = ({
  product,
  loading,
}) => {
  if (loading) {
    return (
      <ProductSpecifications>
        <LoaderDescription />
        <LoaderFeatures />
      </ProductSpecifications>
    )
  }

  return (
    <ProductSpecifications>
      <ProductOverviewSection>
        <ProductDescription description={product?.description || ''} />
      </ProductOverviewSection>
      <ProductSpecs>
        {product?.features?.map((feature, idx) => (
          <Section key={idx}>
            <h1>{feature.feature_title}</h1>
            <ul>
              {Array.isArray(feature.feature_contents) &&
                feature.feature_contents.map((content, contentIdx) => (
                  <li key={contentIdx}>{content}</li>
                ))}
            </ul>
          </Section>
        ))}
      </ProductSpecs>
    </ProductSpecifications>
  )
}

export default ProductOverview
