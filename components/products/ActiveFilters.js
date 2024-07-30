import React from "react"
import styled from "styled-components"
import { VscClose } from "react-icons/vsc"

const ActiveFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 768px) {
    flex-wrap: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;
    padding: 8px 0px;
  }
`

const ActiveFilter = styled.button`
  font-size: 14px;
  font-weight: 600;
  color: #596171;
  height: 42px;
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

  @media (max-width: 768px) {
    height: 36px;
  }
`

const AttributeType = styled.span`
  color: inherit;
`

const AttributeValue = styled.span`
  color: var(--sc-color-blue);
  margin-left: 4px;
`

const CloseIcon = styled(VscClose)`
  margin-left: 5px;
  font-size: 18px;

  &:active {
    color: var(--sc-color-red);
  }
`

const ResetBtn = styled.button`
  font-size: 15px;
  color: var(--sc-color-text);
  padding: 0 12px;
  position: relative;
  align-items: center;
  text-decoration: underline;
  display: flex;
  transition: background-color 0.2s;

  &:hover,
  &:active,
  &:focus-visible {
    text-decoration: none;
  }
`

const ActiveFilters = ({
  selectedAttributes,
  selectedPriceRanges,
  removeFilter,
  onFilterClick,
  clearFilters,
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
      type: ["Price"],
      value: priceRange,
      isPrice: true,
    })
  })

  const handleRemoveFilter = (filter, e) => {
    e.stopPropagation()
    removeFilter(filter.type, filter.value, filter.isPrice)
  }

  return (
    <ActiveFiltersContainer>
      {filters.map((filter, index) => (
        <ActiveFilter key={index} onClick={() => onFilterClick(filter)}>
          <AttributeType>{filter.type}</AttributeType>:
          <AttributeValue>{filter.value}</AttributeValue>
          <CloseIcon onClick={(e) => handleRemoveFilter(filter, e)} />
        </ActiveFilter>
      ))}
      {filters.length > 0 && (
        <ResetBtn onClick={clearFilters} aria-label="Clear all filters">
          Clear all
        </ResetBtn>
      )}
    </ActiveFiltersContainer>
  )
}

export default ActiveFilters
