import styled from "styled-components"

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

const ProductDescription = ({ description }) => (
  <Section>
    <p>{description}</p>
  </Section>
)

const ProductOverview = ({ product, loading }) => {
  if (loading) {
    return <p>Blahggghh</p>
  }

  // Group features by title
  const groupedFeatures = product.features.reduce((acc, feature) => {
    if (!acc[feature.feature_title]) {
      acc[feature.feature_title] = []
    }
    acc[feature.feature_title].push(feature.feature_content)
    return acc
  }, {})

  return (
    <ProductSpecifications>
      <ProductOverviewSection>
        <ProductDescription description={product.description} />
        {groupedFeatures["Feature"] && (
          <ul>
            {groupedFeatures["Feature"].map((content, idx) => (
              <li key={idx}>{content}</li>
            ))}
          </ul>
        )}
      </ProductOverviewSection>
      <ProductSpecs>
        <Section>
          <h1>How it Fits</h1>
          {groupedFeatures["How it Fits"] && (
            <ul>
              {groupedFeatures["How it Fits"].map((content, idx) => (
                <li key={idx}>{content}</li>
              ))}
            </ul>
          )}
        </Section>
        <Section>
          <h1>Composition & Care</h1>
          {groupedFeatures["Composition & Care"] && (
            <ul>
              {groupedFeatures["Composition & Care"].map((content, idx) => (
                <li key={idx}>{content}</li>
              ))}
            </ul>
          )}
        </Section>
      </ProductSpecs>
    </ProductSpecifications>
  )
}

export default ProductOverview
