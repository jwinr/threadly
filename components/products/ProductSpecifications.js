import React from "react"
import styled from "styled-components"
import Popover from "@/components/Elements/Popover"

const ProductSpecs = styled.div`
  grid-area: specs;
`

const SpecsList = styled.ul`
  list-style-type: none;
  padding: 0;
`

const SpecsItem = styled.li`
  display: grid;
  grid-template-columns: 0.5fr 1fr 1fr;
  grid-template-areas: "category name value";
  align-items: center;
  min-height: 23px;
  margin: 0 0 21px;
`

const SpecsCat = styled.div`
  grid-area: category;
  font-size: 16px;
  font-weight: bold;
`

const SpecsName = styled.span`
  grid-area: name;
  font-size: 14px;
  font-weight: bold;
  position: relative;
  gap: 10px;
  display: flex;
  align-items: center;
`

const InfoButton = styled.button`
  appearance: none;
  border: 0;
  background-color: transparent;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  .info-icon {
    appearance: none;
    background-color: transparent;
    border: 2px solid #4fbbff;
    border-radius: 50%;
    width: 17px;
    height: 17px;
    color: #4fbbff;
    background-color: var(--sc-color-white);
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const SpecsValue = styled.span`
  grid-area: value;
  font-size: 14px;
  color: var(--sc-color-text);
`

const LineBreak = styled.div`
  content: "";
  display: block;
  border-top: 1px solid #ccc;
  width: 100%;
  margin: 20px 0;
  height: 0;
`

const ProductSpecifications = ({ attributes }) => {
  let lastCategory = null

  return (
    <ProductSpecs>
      <SpecsList>
        {attributes.map((spec, index) => {
          if (spec.category_name !== lastCategory) {
            lastCategory = spec.category_name
            return (
              <React.Fragment key={`${index}-category`}>
                <LineBreak />
                <SpecsItem key={index}>
                  <SpecsCat>{spec.category_name}</SpecsCat>
                  <SpecsName>
                    {spec.attribute_name}
                    {spec.additional_info && (
                      <Popover
                        trigger="hover"
                        content={spec.additional_info}
                        color="dark"
                        padding="10px"
                        position="top"
                      >
                        <InfoButton>
                          <span className="info-icon">i</span>
                        </InfoButton>
                      </Popover>
                    )}
                  </SpecsName>
                  <SpecsValue>{spec.attribute_value}</SpecsValue>
                </SpecsItem>
              </React.Fragment>
            )
          } else {
            return (
              <SpecsItem key={index}>
                <SpecsName>
                  {spec.attribute_name}
                  {spec.additional_info && (
                    <Popover
                      trigger="hover"
                      content={spec.additional_info}
                      color="dark"
                      padding="10px"
                      position="top"
                    >
                      <InfoButton>
                        <span className="info-icon">i</span>
                      </InfoButton>
                    </Popover>
                  )}
                </SpecsName>
                <SpecsValue>{spec.attribute_value}</SpecsValue>
              </SpecsItem>
            )
          }
        })}
      </SpecsList>
    </ProductSpecs>
  )
}

export default ProductSpecifications
