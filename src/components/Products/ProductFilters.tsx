import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { RiArrowDownSLine } from 'react-icons/ri'
import Checkbox from '@/components/Elements/Checkbox'
import { PiSlidersHorizontalLight } from 'react-icons/pi'
import FilterPanel from '@/components/Products/FilterPanel'
import ActiveFilters from '@/components/Products/ActiveFilters'
import Button from '@/components/Elements/Button'
import { Product, Attribute } from '@/types/product'

interface FilterState {
  selectedPriceRanges: string[]
  selectedAttributes: Record<string, string[]>
}

interface ProductFiltersProps {
  inventoryItems: Product[]
  onFilterChange: (filters: Record<string, string[]>) => void
  attributes: Attribute[]
  resetFilters: () => void
  filterState: FilterState
  loading: boolean
  filtersVisible: boolean
}

const Container = styled.div`
  position: relative;
`

const DropdownButton = styled.button<{ $isOpen: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: #596171;
  padding: var(--s1-padding-top) var(--s1-padding-right)
    var(--s1-padding-bottom) var(--s1-padding-left);
  border-radius: 25px;
  position: relative;
  align-items: center;
  display: flex;
  height: 42px;
  width: max-content;
  border: 1px solid var(--sc-color-border-gray);
  transition: background-color 240ms;

  &[aria-expanded='true'] {
    background-color: #f5f6f8;
  }

  &:hover {
    background-color: #f5f6f8;
  }

  &:focus:not(:focus-visible) {
    outline: none;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    height: 36px;
    min-width: max-content;
  }
`

const ArrowIcon = styled.div`
  font-size: 18px;
  color: var(--sc-color-text);
  transition: transform 0.3s ease;
`

const DropdownContent = styled.div`
  position: absolute;
  background-color: var(--sc-color-white);
  border: 1px solid var(--sc-color-border-gray);
  border-radius: 8px;
  box-shadow:
    0px 5px 15px 0px rgba(0, 0, 0, 0.12),
    0px 15px 35px 0px rgba(48, 49, 61, 0.08);
  max-height: 325px;
  overflow: hidden;
  width: max-content;
  top: 48px;
  z-index: 200;

  // Initial hidden state
  opacity: 0;
  transform: scale(0.85);
  transition:
    opacity 240ms ease-in-out,
    transform 240ms ease-in-out,
    visibility 240ms ease-in-out;

  &.fade-in {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
  }

  &.fade-out {
    opacity: 0;
    visibility: hidden;
    transform: scale(0.85);
  }

  button {
    width: 100%;
  }

  label:last-of-type {
    margin-bottom: 8px;
  }
`

const DropdownScrollWrapper = styled.div`
  overflow-y: auto;
  max-height: 400px;
  padding: 12px;
  border-radius: 8px;
`

const FilterWrapper = styled.div<{ $loading: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  ${({ $loading }) =>
    !$loading &&
    css`
      animation: fadeIn 0.2s ease-in-out forwards;
    `}

  @media (max-width: 768px) {
    flex-wrap: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;
    padding: 16px 0px;
  }
`

const AllFiltersBtn = styled.button`
  font-size: 14px;
  font-weight: 600;
  color: #596171;
  padding: var(--s1-padding-top) var(--s1-padding-right)
    var(--s1-padding-bottom) var(--s1-padding-left);
  border-radius: 25px;
  gap: 5px;
  height: 42px;
  position: relative;
  min-width: fit-content;
  align-items: center;
  display: flex;
  border: 1px solid var(--sc-color-border-gray);
  transition: all 240ms;

  &:hover,
  &:focus {
    background-color: #f5f6f8;
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    height: 36px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
`

const ProductFilterContainer = styled.div`
  background-color: var(--sc-color-white);
  grid-area: info;
  display: flex;
  padding: 8px 16px;
  flex-direction: column;
  gap: 6px;
  transition:
    transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
  z-index: 200;
  transform: translateY(0);

  @media (max-width: 768px) {
    top: 108px;
  }
`

const ProductFilters: React.FC<ProductFiltersProps> = ({
  inventoryItems,
  onFilterChange,
  attributes,
  resetFilters,
  filterState,
  loading,
  filtersVisible,
}) => {
  const maxVisibleFilters = 5
  const [isPanelMounted, setIsPanelMounted] = useState(false)
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>(
    filterState.selectedPriceRanges || []
  )
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string[]>
  >(filterState.selectedAttributes || {})

  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const dropdownAttributeRefs = useMemo(
    () => attributes.map(() => React.createRef<HTMLDivElement>()),
    [attributes]
  )
  const dropdownPriceRef = useRef<HTMLDivElement>(null)

  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false)
  const [isAttributeDropdownOpen, setIsAttributeDropdownOpen] = useState<
    Record<string, boolean>
  >({})

  const [tempSelectedAttributes, setTempSelectedAttributes] = useState<
    Record<string, string[]>
  >({})
  const [tempSelectedPriceRanges, setTempSelectedPriceRanges] = useState<
    string[]
  >([])

  // Close any open dropdown menus when the fixed filter container state changes (both visible or hidden)
  useEffect(() => {
    if (filtersVisible || !filtersVisible) {
      setIsPriceDropdownOpen(false)
      setIsAttributeDropdownOpen({})
    }
  }, [filtersVisible])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Check if the click is inside the price dropdown
      if (dropdownPriceRef.current?.contains(target)) {
        return
      }

      // Check if the click is inside any attribute dropdowns
      for (const ref of dropdownAttributeRefs) {
        if (ref.current?.contains(target)) {
          return
        }
      }

      // If the click is not inside any dropdown, close all
      setIsPriceDropdownOpen(false)
      setIsAttributeDropdownOpen({})
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [dropdownPriceRef, dropdownAttributeRefs])

  const applyFilters = useCallback(() => {
    setSelectedAttributes(tempSelectedAttributes)
    setSelectedPriceRanges(tempSelectedPriceRanges)
    const allFilters = {
      ...tempSelectedAttributes,
      price: tempSelectedPriceRanges, // We're destructuring this later in the togglePriceDropdown function
    }
    onFilterChange(allFilters) // Necessary to push the attribute to the URL
    setIsAttributeDropdownOpen({})
    setIsPriceDropdownOpen(false)
  }, [tempSelectedAttributes, tempSelectedPriceRanges, onFilterChange])

  const handleResetFilters = useCallback(() => {
    setSelectedAttributes({})
    setSelectedPriceRanges([])
    setTempSelectedAttributes({})
    setTempSelectedPriceRanges([])
    resetFilters()
  }, [resetFilters])

  const removeFilter = useCallback(
    (type: string, value: string, isPrice = false) => {
      if (isPrice) {
        setSelectedPriceRanges((prev) => {
          const updatedRanges = prev.filter((range) => range !== value)
          if (
            updatedRanges.length === 0 &&
            Object.keys(selectedAttributes).length === 0
          ) {
            applyFilters()
          }
          return updatedRanges
        })
      } else {
        setSelectedAttributes((prev) => {
          const updated = { ...prev }
          updated[type] = updated[type].filter((val) => val !== value)
          if (updated[type].length === 0) {
            delete updated[type]
          }
          if (
            Object.keys(updated).length === 0 &&
            selectedPriceRanges.length === 0
          ) {
            applyFilters()
          }
          return updated
        })
      }
    },
    [applyFilters, selectedAttributes, selectedPriceRanges]
  )

  const predefinedPriceRanges = [
    '$10 - $19.99',
    '$20 - $29.99',
    '$30 - $39.99',
    '$40 - $59.99',
    '$60 - $79.99',
    '$80 - $99.99',
    '$100 - $149.99',
    '$150 - $199.99',
  ]

  const isItemInPriceRange = useCallback(
    (item: Product, priceRange: string) => {
      if (!priceRange || typeof priceRange !== 'string') {
        return false
      }
      const [minPrice, maxPrice] = priceRange
        .split(' - ')
        .map((value) => parseFloat(value.replace('$', '')))

      // Extract all prices from the nested structure and deduplicate
      const prices = Array.from(
        new Set(
          item.color_variants?.flatMap((color) =>
            (color as unknown as { sizes: { price: string }[] }).sizes.map(
              (size) => parseFloat(size.price)
            )
          )
        )
      )

      //console.log(`Item prices: ${prices}, Range: ${minPrice} - ${maxPrice}`)

      // Check if any price is within the range
      return prices.some((price) => price >= minPrice && price <= maxPrice)
    },
    []
  )

  const availablePriceRanges = useMemo(() => {
    return predefinedPriceRanges.filter((range) =>
      inventoryItems?.some((item) => isItemInPriceRange(item as Product, range))
    )
  }, [inventoryItems, isItemInPriceRange])

  const togglePriceDropdown = () => {
    setIsPriceDropdownOpen((prevState) => !prevState)
    setTempSelectedPriceRanges(selectedPriceRanges || [])
    setIsAttributeDropdownOpen({})
  }

  const toggleAttributeDropdown = (attributeType: string) => {
    setIsAttributeDropdownOpen((prevState) => {
      const updatedState = { ...prevState }

      // Close all other dropdowns
      Object.keys(updatedState).forEach((key) => {
        if (key !== attributeType) {
          updatedState[key] = false
        }
      })

      // Toggle the state for the clicked attribute
      updatedState[attributeType] = !updatedState[attributeType]

      // Reset tempSelectedAttributes to the current selectedAttributes when opening the dropdown
      if (updatedState[attributeType]) {
        setTempSelectedAttributes(selectedAttributes)
      }

      return updatedState
    })
  }

  const toggleSelection = (type: string, value: string, isPrice = false) => {
    if (isPrice) {
      setTempSelectedPriceRanges((prevSelected) => {
        return prevSelected.includes(value)
          ? prevSelected.filter((item) => item !== value)
          : [...prevSelected, value]
      })
    } else {
      setTempSelectedAttributes((prevSelected) => {
        const updatedAttributes = { ...prevSelected }
        if (updatedAttributes[type]) {
          updatedAttributes[type] = updatedAttributes[type].includes(value)
            ? updatedAttributes[type].filter((val) => val !== value)
            : [...updatedAttributes[type], value]
        } else {
          updatedAttributes[type] = [value]
        }
        return updatedAttributes
      })
    }
  }

  const handleActiveFilterClick = (filter: {
    isPrice: boolean
    type: string
  }) => {
    if (filter.isPrice) {
      togglePriceDropdown()
    } else {
      toggleAttributeDropdown(filter.type)
    }
  }

  return (
    <>
      <ProductFilterContainer>
        <FilterWrapper $loading={loading}>
          <AllFiltersBtn
            onClick={() => {
              setIsPanelMounted(true)
              setTempSelectedPriceRanges(selectedPriceRanges || [])
              setIsAttributeDropdownOpen({})
              setTimeout(() => {
                setIsPanelOpen(true)
              }, 50)
            }}
            aria-label="Display all filters"
          >
            <PiSlidersHorizontalLight size={28} />
            All Filters
          </AllFiltersBtn>
          {attributes.slice(0, maxVisibleFilters).map((attribute, index) => (
            <Container
              key={attribute.attribute_name}
              ref={dropdownAttributeRefs[index]}
            >
              <DropdownButton
                $isOpen={isAttributeDropdownOpen[attribute.attribute_name]}
                aria-expanded={
                  isAttributeDropdownOpen[attribute.attribute_name]
                }
                aria-controls={`dropdown-${attribute.attribute_name}`}
                onClick={() => {
                  toggleAttributeDropdown(attribute.attribute_name)
                  setIsPriceDropdownOpen(false)
                }}
              >
                <span>{attribute.attribute_name}</span>
                <ArrowIcon>
                  {isAttributeDropdownOpen[attribute.attribute_name] ? (
                    <RiArrowDownSLine className="rotate-arrow" />
                  ) : (
                    <RiArrowDownSLine className="arrow-icon-visible" />
                  )}
                </ArrowIcon>
              </DropdownButton>
              <DropdownContent
                id={`dropdown-${attribute.attribute_name}`}
                aria-hidden={!isAttributeDropdownOpen[attribute.attribute_name]}
                role="menu"
                className={
                  isAttributeDropdownOpen[attribute.attribute_name]
                    ? 'fade-in'
                    : 'fade-out'
                }
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownScrollWrapper>
                  {attribute.attribute_values.map((value) => (
                    <Checkbox
                      key={value}
                      id={`${attribute.attribute_name}-${value}`}
                      label={value}
                      checked={tempSelectedAttributes[
                        attribute.attribute_name
                      ]?.includes(value)}
                      onChange={() =>
                        toggleSelection(attribute.attribute_name, value)
                      }
                    />
                  ))}
                  <Button
                    onPress={applyFilters}
                    type="primary"
                    aria-label="Show results"
                  >
                    Show results
                  </Button>
                </DropdownScrollWrapper>
              </DropdownContent>
            </Container>
          ))}
          <Container ref={dropdownPriceRef}>
            <DropdownButton
              $isOpen={isPriceDropdownOpen}
              aria-expanded={isPriceDropdownOpen}
              aria-controls="dropdown-price"
              onClick={togglePriceDropdown}
            >
              <span>Price</span>
              <ArrowIcon>
                {isPriceDropdownOpen ? (
                  <RiArrowDownSLine className="rotate-arrow" />
                ) : (
                  <RiArrowDownSLine className="arrow-icon-visible" />
                )}
              </ArrowIcon>
            </DropdownButton>
            <DropdownContent
              id="dropdown-price"
              aria-hidden={!isPriceDropdownOpen}
              role="menu"
              className={isPriceDropdownOpen ? 'fade-in' : 'fade-out'}
            >
              <DropdownScrollWrapper>
                {availablePriceRanges.map((priceRange, index) => (
                  <Checkbox
                    key={index}
                    id={`price-${priceRange}`}
                    label={priceRange}
                    checked={tempSelectedPriceRanges.includes(priceRange)}
                    onChange={() => {
                      toggleSelection(priceRange, priceRange, true)
                    }}
                  />
                ))}
                <Button
                  onPress={applyFilters}
                  type="primary"
                  aria-label="Show results"
                >
                  Show results
                </Button>
              </DropdownScrollWrapper>
            </DropdownContent>
          </Container>
        </FilterWrapper>
        <FilterContainer>
          <ActiveFilters
            onFilterClick={handleActiveFilterClick}
            selectedAttributes={selectedAttributes}
            selectedPriceRanges={selectedPriceRanges}
            removeFilter={removeFilter}
            clearFilters={handleResetFilters}
          />
        </FilterContainer>
      </ProductFilterContainer>
      <FilterPanel
        isOpen={isPanelOpen}
        attributes={attributes}
        availablePriceRanges={availablePriceRanges}
        selectedPriceRanges={tempSelectedPriceRanges}
        selectedAttributes={tempSelectedAttributes}
        onClose={() => setIsPanelOpen(false)}
        toggleSelection={toggleSelection}
        resetFilters={handleResetFilters}
        applyFilters={applyFilters}
        isMounted={isPanelMounted}
      />
    </>
  )
}

export default ProductFilters
