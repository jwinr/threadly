import { useEffect, useState } from "react"
import styled from "styled-components"
import ProductSpecifications from "@/components/Products/ProductSpecifications"
import ProductReviews from "@/components/Products/ProductReviews"
import ProductHighlights from "@/components/Products/ProductHighlights"
import ProductIncludes from "@/components/Products/ProductIncludes"
import Accordion from "@/components/Elements/Accordion"
import AccordionItem from "@/components/Elements/AccordionItem"

const AccordionWrapper = styled.div`
  padding: 15px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  border-radius: 8px;
  margin-top: 20px;
  background-color: white;
`

const ProductDescription = styled.div`
  p {
    font-size: 14px;
    display: inline-block;
    position: relative;
  }

  p::after {
    position: absolute;
    content: "";
    border-bottom: 1px solid #ccc;
    width: 100%;
    transform: translateX(-50%);
    bottom: -15px;
    left: 50%;
  }

  h1 {
    font-weight: bold;
    text-align: left;
    font-size: 16px;
  }
`

const ProductAccordion = ({ product }) => {
  return (
    <AccordionWrapper>
      <Accordion>
        <AccordionItem title="Overview" defaultOpen>
          <ProductDescription>
            <h1>Description</h1>
            <p>{product.description}</p>
          </ProductDescription>
          <ProductHighlights highlights={product.highlights} />
          <ProductIncludes inclusions={product.inclusions} />
        </AccordionItem>
        <AccordionItem title="Specifications" id="review-section-anchor">
          <ProductSpecifications attributes={product.attributes} />
        </AccordionItem>
        <AccordionItem title="Reviews">
          <ProductReviews
            reviews={product.reviews}
            productId={product.product_id}
          />
        </AccordionItem>
      </Accordion>
    </AccordionWrapper>
  )
}

export default ProductAccordion
