import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  RefObject,
} from 'react'
import styled, { css } from 'styled-components'
import { RiArrowDownSLine } from 'react-icons/ri'
import Checkbox from '@/components/Elements/Checkbox'
import { PiSlidersHorizontalLight } from 'react-icons/pi'
import FilterPanel from '@/components/Products/FilterPanel'
import ActiveFilters from '@/components/Products/ActiveFilters'
import Button from '@/components/Elements/Button'

interface Attribute {
  attribute_type: string
  attribute_values: string[]
}

interface FilterState {
  selectedPriceRanges?: string[]
  selectedAttributes?: Record<string, string[]>
}

interface ProductFiltersProps {
  inventoryItems?: { price: number }[]
  onFilterChange: (filters: Record<string, string[] | string[]>) => void
  attributes: Attribute[]
  resetFilters: () => void
  filterState: FilterState
  loading: boolean
  filtersVisible: boolean
}

const Container = styled.div`
  position: relative;
`

const DropdownButton = styled.button`
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
  transition: all 240ms;

  &:hover,
  &:focus {
    background-color: #f5f6f8;
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
  max-height: 275px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: max-content;
  top: 48px;
  z-index: 200;

  box-shadow:
    0px 5px 15px 0px rgba(0, 0, 0, 0.12),
    0px 15px 35px 0px rgba(48, 49, 61, 0.08);
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
  max-height: 275px;
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

  const dropdownAttributeRef = useRef<(RefObject<HTMLDivElement> | null)[]>(
    Array(attributes.length).fill(null)
  ).current.map(() => useRef<HTMLDivElement>(null))
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
      if (
        dropdownPriceRef.current &&
        !dropdownPriceRef.current.contains(event.target as Node)
      ) {
        setIsPriceDropdownOpen(false)
      }
      dropdownAttributeRef.forEach((ref, index) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          const attributeType = attributes[index].attribute_type
          setIsAttributeDropdownOpen((prev) => ({
            ...prev,
            [attributeType]: false,
          }))
        }
      })
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [attributes, dropdownAttributeRef, dropdownPriceRef])

  useEffect(() => {
    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return
      }

      const allRefs = [dropdownPriceRef, ...dropdownAttributeRef].map(
        (ref) => ref.current
      )

      allRefs.forEach((dropdownRef, index) => {
        if (!dropdownRef) {
          return
        }

        const focusableElements = dropdownRef.querySelectorAll(
          'input[type="checkbox"], button'
        )
        const lastFocusableElement =
          focusableElements[focusableElements.length - 1]

        if (document.activeElement !== lastFocusableElement) {
          return
        }

        // Close dropdowns if the last focusable element is reached
        if (index === 0) {
          setIsPriceDropdownOpen(false)
        } else {
          const attributeType = attributes[index - 1].attribute_type
          setIsAttributeDropdownOpen((prev) => ({
            ...prev,
            [attributeType]: false,
          }))
          setTempSelectedAttributes({})
        }
      })
    }

    document.addEventListener('keydown', handleTabKey)

    return () => {
      document.removeEventListener('keydown', handleTabKey)
    }
  }, [attributes, dropdownAttributeRef, dropdownPriceRef])

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
    '$25 - $49.99',
    '$50 - $74.99',
    '$75 - $99.99',
    '$100 - $149.99',
    '$150 - $199.99',
    '$200 - $249.99',
    '$250 - $499.99',
    '$500 - $749.99',
    '$750 - $999.99',
    '$1000 - $1249.99',
    '$1250 - $1499.99',
    '$1500 - $1749.99',
  ]

  const isItemInPriceRange = useCallback(
    (item: { price: number }, priceRange: string) => {
      if (!priceRange || typeof priceRange !== 'string') {
        return false
      }
      const [minPrice, maxPrice] = priceRange
        .split(' - ')
        .map((value) => parseFloat(value.replace('$', '')))
      return item.price >= minPrice && item.price <= maxPrice
    },
    []
  )

  const availablePriceRanges = useMemo(() => {
    return predefinedPriceRanges.filter((range) =>
      inventoryItems?.some((item) => isItemInPriceRange(item, range))
    )
  }, [inventoryItems, isItemInPriceRange])

  const togglePriceDropdown = () => {
    setIsPriceDropdownOpen((prevState) => !prevState)
    setTempSelectedPriceRanges(selectedAttributes.price || []) // Extract the price from the attribute result
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
              setTempSelectedPriceRanges(selectedAttributes.price || [])
              setTempSelectedAttributes(selectedAttributes)
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
              key={attribute.attribute_type}
              ref={dropdownAttributeRef[index]}
            >
              <DropdownButton
                onClick={() => {
                  toggleAttributeDropdown(attribute.attribute_type)
                  setIsPriceDropdownOpen(false)
                }}
              >
                <span>{attribute.attribute_type}</span>
                <ArrowIcon>
                  {isAttributeDropdownOpen[attribute.attribute_type] ? (
                    <RiArrowDownSLine className="rotate-arrow" />
                  ) : (
                    <RiArrowDownSLine className="arrow-icon-visible" />
                  )}
                </ArrowIcon>
              </DropdownButton>
              <DropdownContent
                className={
                  isAttributeDropdownOpen[attribute.attribute_type]
                    ? 'fade-in'
                    : 'fade-out'
                }
              >
                <DropdownScrollWrapper>
                  {attribute.attribute_values.map((value, valueIndex) => (
                    <Checkbox
                      key={valueIndex}
                      id={`${attribute.attribute_type}-${value}`}
                      label={value}
                      checked={tempSelectedAttributes[
                        attribute.attribute_type
                      ]?.includes(value)}
                      onChange={() =>
                        toggleSelection(attribute.attribute_type, value)
                      }
                      data-type={attribute.attribute_type}
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
            <DropdownButton onClick={togglePriceDropdown}>
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
                    data-type="price"
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
