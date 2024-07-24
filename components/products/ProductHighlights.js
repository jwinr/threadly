import React from "react"
import styled from "styled-components"

const ProductHighs = styled.div`
  grid-template-columns: 1fr 3fr;
  display: grid;
  padding-top: 15px;

  li {
    margin-bottom: 0.5rem;
  }

  h1 {
    font-weight: bold;
    text-align: left;
    font-size: 16px;
    padding-top: 15px;
  }
`

const HighlightList = styled.ul`
  list-style-type: none;
  padding: 1rem 1rem 0rem 0rem;
`

const SpecsItem = styled.li`
  margin-bottom: 10px;
`

const SpecsContent = styled.div`
  display: flex;
  flex-direction: column;
`

const Text = styled.span`
  font-size: 14px;
`

const Title = styled.div`
  font-size: 14px;
  font-weight: bold;
`

const ProductHighlights = ({ highlights }) => {
  return (
    <ProductHighs>
      <h1>Highlights</h1>
      <HighlightList>
        {highlights.map((high, index) => (
          <SpecsItem key={index}>
            <SpecsContent>
              <Title>{high.highlight_title}</Title>
              <Text>{high.highlight_text}</Text>
            </SpecsContent>
            {index < highlights.length - 1}
          </SpecsItem>
        ))}
      </HighlightList>
    </ProductHighs>
  )
}

export default ProductHighlights
