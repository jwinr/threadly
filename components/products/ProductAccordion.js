import { useEffect, useState } from "react"
import styled from "styled-components"
import {
  Accordion,
  ControlledAccordion,
  useAccordionProvider,
  AccordionItem as Item,
} from "@szhsin/react-accordion"
import ProductSpecifications from "../../components/products/ProductSpecifications"
import ProductReviews from "../../components/products/ProductReviews"
import ProductHighlights from "../../components/products/ProductHighlights"
import ProductIncludes from "../../components/products/ProductIncludes"
import ChevronDown from "../../public/images/icons/chevron-down.svg"

const ItemWithChevron = ({ header, itemKey, ...rest }) => (
  <Item
    {...rest}
    itemKey={itemKey}
    header={
      <>
        {header}
        <ChevronDown className="chevron-down" alt="Chevron Down" />
      </>
    }
  />
)

const AccordionWrapper = styled.div`
  padding: 15px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  border-radius: 8px;
  margin-top: 20px;
  background-color: white;
`

const AccordionItem = styled(ItemWithChevron)`
  border-bottom: 1px solid #ccc;

  &:last-child {
    border-bottom: none; // We don't need a border for the final item
  }

  .szh-accordion__item {
    &-btn {
      cursor: pointer;
      display: flex;
      align-items: center;
      width: 100%;
      margin: 0;
      padding: 1rem;
      font-weight: bold;
      text-align: left;
      font-size: 19px;
      color: #000;
      background-color: transparent;
      border: none;
      &:hover {
        text-decoration: underline;
      }
    }

    &-content {
      transition: height 0.25s cubic-bezier(0, 0, 0, 1);
    }

    &-panel {
      padding: 1rem;
    }
  }

  .chevron-down {
    margin-left: auto;
    transition: transform 0.25s cubic-bezier(0, 0, 0, 1);
  }

  &.szh-accordion__item--expanded {
    .chevron-down {
      transform: rotate(180deg);
    }
  }
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

const ProductAccordion = ({ product, openSection }) => {
  const [initialLoad, setInitialLoad] = useState(true)
  const providerValue = useAccordionProvider({
    allowMultiple: false,
    transition: true,
    transitionTimeout: 250,
  })

  const { toggle } = providerValue

  useEffect(() => {
    toggle("reviews", true)
  }, [openSection, toggle])

  useEffect(() => {
    if (initialLoad) {
      toggle("overview", true) // Open the overview section by default
      setInitialLoad(false)
    }

    if (openSection === "reviews") {
      toggle("reviews", true)
      document
        .getElementById("review-section-anchor") // We're placing it within the specifications item to account for the offset caused by the navbar
        .scrollIntoView({ behavior: "smooth" })
    }
  }, [openSection, toggle, initialLoad])

  return (
    <AccordionWrapper>
      <ControlledAccordion providerValue={providerValue}>
        <AccordionItem header="Overview" itemKey="overview" initialEntered>
          <ProductDescription>
            <h1>Description</h1>
            <p>{product.description}</p>
          </ProductDescription>
          <ProductHighlights highlights={product.highlights} />
          <ProductIncludes inclusions={product.inclusions} />
        </AccordionItem>
        <AccordionItem
          header="Specifications"
          itemKey="specifications"
          id="review-section-anchor"
        >
          <ProductSpecifications attributes={product.attributes} />
        </AccordionItem>
        <AccordionItem header="Reviews" itemKey="reviews">
          <ProductReviews
            reviews={product.reviews}
            productId={product.product_id}
          />
        </AccordionItem>
      </ControlledAccordion>
    </AccordionWrapper>
  )
}

export default ProductAccordion
