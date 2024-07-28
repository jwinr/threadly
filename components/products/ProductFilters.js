import React, { useState, useEffect, useRef } from "react"
import { RiArrowDownSLine } from "react-icons/ri"
import styled, { css, keyframes } from "styled-components"
import Checkbox from "../common/Checkbox"
import { useToast } from "@/context/ToastContext"
import { PiSlidersHorizontalLight } from "react-icons/pi"
import { useMobileView } from "../../context/MobileViewContext"
import FilterPanel from "./FilterPanel"
import ActiveFilters from "./ActiveFilters"
import Button from "../common/Button"

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.85);
  }
`

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
  width: 100%;
  border: 1px solid var(--sc-color-border-gray);
  transition: all 240ms;

  &:hover {
    background-color: #f5f6f8;
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
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 12px;
  width: max-content;
  top: 48px;
  z-index: 200;
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.12),
    0px 15px 35px 0px rgba(48, 49, 61, 0.08);
  animation: ${({ isOpen, isAnimating }) =>
    isAnimating
      ? css`
          ${isOpen ? fadeIn : fadeOut} 240ms ease-in-out forwards
        `
      : "none"};

  button {
    width: 100%;
  }
`

const FilterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

const AllFiltersBtn = styled.button`
  font-size: 14px;
  font-weight: 600;
  color: #596171;
  padding: var(--s1-padding-top) var(--s1-padding-right)
    var(--s1-padding-bottom) var(--s1-padding-left);
  border-radius: 25px;
  gap: 5px;
  position: relative;
  align-items: center;
  display: flex;
  border: 1px solid var(--sc-color-border-gray);
  transition: all 240ms;

  &:hover {
    background-color: #f5f6f8;
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

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
`

const isItemInPriceRange = (item, priceRange) => {
  if (!priceRange || typeof priceRange !== "string") {
    return false
  }
  const [minPrice, maxPrice] = priceRange
    .split(" - ")
    .map((value) => parseFloat(value.replace("$", "")))

  return item.price >= minPrice && item.price <= maxPrice
}

function ProductFilters({
  inventoryItems,
  onFilterChange,
  attributes,
  resetFilters,
  filterState,
  onFilteredItemsChange,
}) {
  const { showToast } = useToast()
  const isMobileView = useMobileView()
  const [isPanelMounted, setIsPanelMounted] = useState(false)

  const [selectedPriceRanges, setSelectedPriceRanges] = useState([])
  const [selectedAttributes, setSelectedAttributes] = useState(
    filterState.selectedAttributes || {}
  )

  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [filteredItems, setFilteredItems] = useState(inventoryItems)
  const [isSticky, setIsSticky] = useState(false)

  const dropdownAttributeRef = useRef(
    Array(attributes.length).fill(null)
  ).current.map(() => useRef(null))
  const dropdownPriceRef = useRef(null)

  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false)
  const [isAttributeDropdownOpen, setIsAttributeDropdownOpen] = useState({})

  const [tempSelectedAttributes, setTempSelectedAttributes] = useState({})
  const [tempSelectedPriceRanges, setTempSelectedPriceRanges] = useState([])

  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 75)
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const applyFilters = () => {
    setSelectedAttributes(tempSelectedAttributes)
    setSelectedPriceRanges(tempSelectedPriceRanges)
    onFilterChange(tempSelectedAttributes) // Necessary to push the attribute to the URL
    setIsAttributeDropdownOpen({})
    setIsPriceDropdownOpen(false)
  }

  const handleResetFilters = () => {
    setSelectedAttributes({})
    setSelectedPriceRanges([])
    setTempSelectedAttributes({})
    setTempSelectedPriceRanges([])
    resetFilters()
  }

  const getActiveFilterCount = () => {
    const attributeCount = Object.values(selectedAttributes).reduce(
      (acc, values) => acc + values.length,
      0
    )
    const priceRangeCount = selectedPriceRanges.length
    return attributeCount + priceRangeCount
  }

  const removeFilter = (type, value, isPrice = false) => {
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
  }

  function handleClickOutside(event) {
    const allDropdownRefs = [dropdownPriceRef, ...dropdownAttributeRef].map(
      (ref) => ref.current
    )

    if (!allDropdownRefs.some((ref) => ref && ref.contains(event.target))) {
      // Reset certain states when we click outside of an active dropdown
      setIsPriceDropdownOpen(false)
      setIsAttributeDropdownOpen({})
      setTempSelectedAttributes({})
    }
  }

  const handleTabKey = (event) => {
    if (event.key === "Tab") {
      const allRefs = [dropdownPriceRef, ...dropdownAttributeRef].map(
        (ref) => ref.current
      )
      allRefs.forEach((dropdownRef, index) => {
        if (dropdownRef) {
          const focusableElements = dropdownRef.querySelectorAll(
            'input[type="checkbox"], button'
          )
          const lastFocusableElement =
            focusableElements[focusableElements.length - 1]
          if (document.activeElement === lastFocusableElement) {
            if (index === 0) {
              setIsPriceDropdownOpen(false)
            } else {
              const attributeType = attributes[index - 1].attribute_type
              setIsAttributeDropdownOpen((prev) => ({
                ...prev,
                [attributeType]: false,
              }))
              // Reset the temporary states when we tab into a new dropdown
              setTempSelectedAttributes({})
            }
          }
        }
      })
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleTabKey)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleTabKey)
    }
  }, [tempSelectedAttributes, tempSelectedPriceRanges])

  const predefinedPriceRanges = [
    "$25 - $49.99",
    "$50 - $74.99",
    "$75 - $99.99",
    "$100 - $149.99",
    "$150 - $199.99",
    "$200 - $249.99",
    "$250 - $499.99",
    "$500 - $749.99",
    "$750 - $999.99",
    "$1000 - $1249.99",
    "$1250 - $1499.99",
    "$1500 - $1749.99",
  ]

  const availablePriceRanges = predefinedPriceRanges.filter((range) =>
    inventoryItems.some((item) => isItemInPriceRange(item, range))
  )

  const togglePriceDropdown = () => {
    setIsAnimating(true)
    setIsPriceDropdownOpen((prevState) => !prevState)
    setIsAttributeDropdownOpen({})
  }

  const toggleAttributeDropdown = (attributeType) => {
    setIsAnimating(true)
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

  const toggleSelection = (type, value, isPrice = false) => {
    if (isPrice) {
      setTempSelectedPriceRanges((prevSelected) => {
        const updatedSelectedPriceRanges = prevSelected.includes(value)
          ? prevSelected.filter((item) => item !== value)
          : [...prevSelected, value]

        return updatedSelectedPriceRanges
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

  const filterItems = () => {
    let filtered = [...inventoryItems]

    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter((item) => {
        const isInRange = selectedPriceRanges.some((range) =>
          isItemInPriceRange(item, range)
        )
        return isInRange
      })
    }

    for (const attributeType in selectedAttributes) {
      const selectedValues = selectedAttributes[attributeType]
      if (selectedValues.length > 0) {
        filtered = filtered.filter((item) => {
          const hasAttribute = item.attributes.some(
            (attribute) =>
              attribute.attribute_type === attributeType &&
              selectedValues.includes(attribute.attribute_value)
          )
          return hasAttribute
        })
      }
    }

    if (filtered.length === 0 && inventoryItems.length > 0) {
      // If no items meet the filter criteria, reset the filters
      resetFilters()
      setSelectedAttributes({})
      setSelectedPriceRanges([])
      setTempSelectedAttributes({})
      setTempSelectedPriceRanges([])
      // And show a message to the user
      showToast("We couldn't find any products with those filters", {
        type: "caution",
      })
    }
    // Update the state with the filtered items
    setFilteredItems(filtered)
    // Pass filtered items to the parent component
    onFilteredItemsChange(filtered)
  }

  // Watch for if we need to call the filter reset..
  useEffect(() => {
    filterItems()
  }, [selectedPriceRanges, selectedAttributes, inventoryItems])

  const handleActiveFilterClick = (filter) => {
    if (filter.isPrice) {
      togglePriceDropdown()
    } else {
      toggleAttributeDropdown(filter.type)
    }
  }

  const containerClass = `brand-filter-container ${isSticky ? "sticky" : ""}`

  return (
    <>
      <div className={containerClass}>
        <FilterWrapper>
          {attributes.map((attribute, index) => (
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
              {isAttributeDropdownOpen[attribute.attribute_type] && (
                <DropdownContent
                  isOpen={isAttributeDropdownOpen[attribute.attribute_type]}
                  isAnimating={isAnimating}
                  onAnimationEnd={() => setIsAnimating(false)}
                >
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
                </DropdownContent>
              )}
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
            {isPriceDropdownOpen && (
              <DropdownContent
                isOpen={isPriceDropdownOpen}
                isAnimating={isAnimating}
                onAnimationEnd={() => setIsAnimating(false)}
              >
                {availablePriceRanges.map((priceRange, index) => (
                  <Checkbox
                    key={index}
                    id={`price-${priceRange}`}
                    label={priceRange}
                    checked={tempSelectedPriceRanges.includes(priceRange)}
                    onChange={() =>
                      toggleSelection(priceRange, priceRange, true)
                    }
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
              </DropdownContent>
            )}
          </Container>
          <AllFiltersBtn
            onClick={() => {
              setIsPanelMounted(true)
              setTimeout(() => {
                setIsPanelOpen(true)
              }, 50)
            }}
            aria-label="Display all filters"
          >
            <PiSlidersHorizontalLight size={28} />
            All Filters
          </AllFiltersBtn>
        </FilterWrapper>
        <FilterContainer>
          <ActiveFilters
            onFilterClick={handleActiveFilterClick}
            selectedAttributes={selectedAttributes}
            selectedPriceRanges={selectedPriceRanges}
            removeFilter={removeFilter}
          />
          {getActiveFilterCount() > 1 && (
            <ResetBtn
              onClick={handleResetFilters}
              aria-label="Clear all filters"
            >
              Clear all
            </ResetBtn>
          )}
        </FilterContainer>
      </div>
      <FilterPanel
        isOpen={isPanelOpen}
        attributes={attributes}
        availablePriceRanges={availablePriceRanges}
        selectedPriceRanges={tempSelectedPriceRanges}
        selectedAttributes={tempSelectedAttributes}
        onClose={() => {
          setIsPanelOpen(false)
        }}
        toggleSelection={toggleSelection}
        resetFilters={handleResetFilters}
        applyFilters={applyFilters}
        isMounted={isPanelMounted}
      />
    </>
  )
}

export default ProductFilters
