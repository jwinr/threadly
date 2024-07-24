import React, { useState } from "react"
import styled, { keyframes } from "styled-components"

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10%);
  }
  to {
    opacity: 1;
    transform: translateY(0%);
  }
`

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
`

const InfoButton = styled.button`
  appearance: none;
  border: 0;
  background-color: transparent;
  padding-left: 10px;
  margin: 0;
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

const InfoTooltip = styled.div`
  position: absolute;
  background-color: var(--sc-color-text);
  color: var(--sc-color-white);
  padding: 10px;
  border-radius: 5px;
  font-size: 13px;
  font-weight: normal;
  bottom: calc(100% + 15px);
  text-align: left;
  box-shadow: 0 0 10px rgba(black, 0.3);
  animation: ${fadeIn} 0.2s ease;

  &:after {
    border-right: solid 10px transparent;
    border-left: solid 10px transparent;
    border-top: solid 10px var(--sc-color-text);
    transform: translateX(-50%);
    position: absolute;
    z-index: -1;
    content: "";
    top: 100%;
    left: 50%;
    height: 0;
    width: 0;
  }

  .attribute-name {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
  }
`

const SpecsNameWithIcon = ({ hasAdditionalInfo, attribute_name, children }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  const handleMouseEnter = () => {
    setShowTooltip(true)
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
  }

  return (
    <SpecsName>
      {children}
      {hasAdditionalInfo && (
        <InfoButton
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className="info-icon">i</span>
          {showTooltip && (
            <InfoTooltip>
              <div className="attribute-name">{attribute_name}</div>
              {hasAdditionalInfo}
            </InfoTooltip>
          )}
        </InfoButton>
      )}
    </SpecsName>
  )
}

const Tooltip = ({ attribute_name, hasAdditionalInfo }) => {
  if (!hasAdditionalInfo) {
    return null // Don't render the InfoTooltip if there's no additional info
  }

  return (
    <InfoTooltip>
      <div className="attribute-name">{attribute_name}</div>
      {hasAdditionalInfo}
    </InfoTooltip>
  )
}

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
                  <SpecsNameWithIcon
                    hasAdditionalInfo={spec.additional_info}
                    attribute_name={spec.attribute_name}
                  >
                    {spec.attribute_name}
                  </SpecsNameWithIcon>
                  <SpecsValue>{spec.attribute_value}</SpecsValue>
                </SpecsItem>
                {spec.additional_info && (
                  <Tooltip
                    attribute_name={spec.attribute_name}
                    hasAdditionalInfo={spec.additional_info}
                  />
                )}
              </React.Fragment>
            )
          } else {
            return (
              <SpecsItem key={index}>
                <SpecsNameWithIcon
                  hasAdditionalInfo={spec.additional_info}
                  attribute_name={spec.attribute_name}
                >
                  {spec.attribute_name}
                </SpecsNameWithIcon>
                <SpecsValue>{spec.attribute_value}</SpecsValue>
                {spec.additional_info && (
                  <Tooltip
                    attribute_name={spec.attribute_name}
                    hasAdditionalInfo={spec.additional_info}
                  />
                )}
              </SpecsItem>
            )
          }
        })}
      </SpecsList>
    </ProductSpecs>
  )
}

export default ProductSpecifications
