import React from "react"
import styled from "styled-components"
import { VscClose } from "react-icons/vsc"

const ActiveFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

const ActiveFilter = styled.button`
  font-size: 14px;
  font-weight: 600;
  color: #596171;
  padding: var(--s1-padding-top) var(--s1-padding-right)
    var(--s1-padding-bottom) var(--s1-padding-left);
  position: relative;
  border-radius: 25px;
  align-items: center;
  display: flex;
  border: 1px solid var(--sc-color-border-gray);
  transition: all 240ms;

  &:hover {
    background-color: #f5f6f8;
  }
`

const AttributeType = styled.span`
  color: inherit; /* use default font color */
`

const AttributeValue = styled.span`
  color: var(--sc-color-blue);
  margin-left: 4px; /* add some spacing between type and value */
`

const CloseIcon = styled(VscClose)`
  margin-left: 5px;
  font-size: 18px;

  &:active {
    color: var(--sc-color-red);
  }
`

const ActiveFilters = ({
  selectedAttributes,
  selectedPriceRanges,
  removeFilter,
  onFilterClick,
}) => {
  const filters = []

  for (const attributeType in selectedAttributes) {
    selectedAttributes[attributeType].forEach((value) => {
      filters.push({
        type: attributeType,
        value,
        isPrice: false,
      })
    })
  }

  selectedPriceRanges.forEach((priceRange) => {
    filters.push({
      type: "Price",
      value: priceRange,
      isPrice: true,
    })
  })

  return (
    <ActiveFiltersContainer>
      {filters.map((filter, index) => (
        <ActiveFilter
          key={index}
          onClick={() => onFilterClick(filter)} // Handle click to open dropdown
        >
          <AttributeType>{filter.type}</AttributeType>:
          <AttributeValue>{filter.value}</AttributeValue>
          <CloseIcon
            onClick={(e) => {
              e.stopPropagation() // Prevent triggering the dropdown when closing the filter
              removeFilter(filter.type, filter.value, filter.isPrice)
            }}
          />
        </ActiveFilter>
      ))}
    </ActiveFiltersContainer>
  )
}

export default ActiveFilters
