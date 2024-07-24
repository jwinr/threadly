import React from "react"
import styled from "styled-components"
import { VscClose } from "react-icons/vsc"

const ActiveFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

const ActiveFilter = styled.button`
  font-size: 15px;
  color: var(--sc-color-text);
  background-color: var(--sc-color-white-highlight);
  padding: 8px 12px;
  position: relative;
  border-radius: 4px;
  align-items: center;
  display: flex;
  border: 1px solid transparent;
  transition: background-color 0.2s;

  &:hover {
    border-color: var(--sc-color-border-gray);
  }
`

const CloseIcon = styled(VscClose)`
  margin-left: 5px;
  font-size: 18px;

  &:hover {
    color: var(--sc-color-red);
  }
`

const ActiveFilters = ({
  selectedAttributes,
  selectedPriceRanges,
  removeFilter,
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
        <ActiveFilter key={index}>
          {filter.type}: {filter.value}
          <CloseIcon
            onClick={() =>
              removeFilter(filter.type, filter.value, filter.isPrice)
            }
          />
        </ActiveFilter>
      ))}
    </ActiveFiltersContainer>
  )
}

export default ActiveFilters
