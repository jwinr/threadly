import React from "react"
import styled from "styled-components"

const ProductHighs = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  padding-top: 15px;

  h1 {
    font-weight: bold;
    text-align: left;
    font-size: 16px;
    margin-bottom: 15px;
  }
`

const HighlightList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

const SpecsItem = styled.li`
  margin-bottom: 10px;
`

const SpecsContent = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
`

const Text = styled.li`
  font-size: 14px;
  line-height: 1.5;
  margin-left: 1.5rem; /* Indent the text content under the title */
  list-style: disc;
`

const ProductFeatures = ({ features }) => {
  // Group features by title
  const groupedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.feature_title]) {
      acc[feature.feature_title] = []
    }
    acc[feature.feature_title].push(feature.feature_content)
    return acc
  }, {})

  return (
    <ProductHighs>
      <h1>Highlights</h1>
      {Object.keys(groupedFeatures).map((title, index) => (
        <SpecsItem key={index}>
          <SpecsContent>
            <Title>{title}</Title>
            <HighlightList>
              {groupedFeatures[title].map((content, idx) => (
                <Text key={idx}>{content}</Text>
              ))}
            </HighlightList>
          </SpecsContent>
        </SpecsItem>
      ))}
    </ProductHighs>
  )
}

export default ProductFeatures
