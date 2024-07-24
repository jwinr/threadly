import React, { useState, useEffect, useRef } from "react"
import { RiArrowDownSLine } from "react-icons/ri"
import styled from "styled-components"
import Checkbox from "../common/Checkbox"
import toast from "react-hot-toast"
import { PiSlidersHorizontalLight } from "react-icons/pi"
import { useMobileView } from "../../context/MobileViewContext"
import FilterPanel from "./FilterPanel"
import ActiveFilters from "./ActiveFilters"

const Container = styled.div`
  position: relative;
`

const DropdownButton = styled.button`
  font-size: 15px;
  color: var(--sc-color-text);
  padding: 8px 12px;
  border-radius: 4px;
  position: relative;
  align-items: center;
  display: flex;
  width: 100%;
  border: 1px solid var(--sc-color-border-gray);
  transition: background-color 0.2s;

  &:hover,
  &:active,
  &:focus-visible {
    background-color: var(--sc-color-white-highlight);
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
  border: 1px solid #d1d5db;
  border-radius: 8px;
  max-height: 275px;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
  width: max-content;
  top: 43px;
  z-index: 200;
`

const FilterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

const AllFiltersBtn = styled.button`
  font-size: 15px;
  color: var(--sc-color-text);
  padding: 0 12px;
  gap: 5px;
  border-radius: 4px;
  position: relative;
  align-items: center;
  display: flex;
  border: 1px solid var(--sc-color-border-gray);
  transition: background-color 0.2s;

  &:hover,
  &:active,
  &:focus-visible {
    background-color: var(--sc-color-white-highlight);
  }
`

const ShowResultsButton = styled.button`
  background-color: var(--sc-color-blue);
  color: white;
  border: none;
  padding: 10px 15px;
  margin-top: 10px;
  width: 100%;
  border-radius: 4px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;

  &:hover {
    background-color: var(--sc-color-dark-blue);
  }

  &:focus-visible {
    background-color: var(--sc-color-dark-blue);
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

  const [showResultsButtonVisible, setShowResultsButtonVisible] =
    useState(false)

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
    setShowResultsButtonVisible(false) // Prevent the results button from appearing on dropdowns we didn't touch
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
      setShowResultsButtonVisible(false)
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
              setShowResultsButtonVisible(false)
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
  }, [
    showResultsButtonVisible,
    tempSelectedAttributes,
    tempSelectedPriceRanges,
  ])

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
    setIsPriceDropdownOpen((prevState) => !prevState)
    setIsAttributeDropdownOpen({})
  }

  const toggleAttributeDropdown = (attributeType) => {
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

  const checkFilterVisibility = (priceRanges, attributes) => {
    const hasPriceFilters = priceRanges.length > 0
    const hasAttributeFilters = Object.values(attributes).some(
      (attr) => attr.length > 0
    )
    setShowResultsButtonVisible(hasPriceFilters || hasAttributeFilters)
  }

  const toggleSelection = (type, value, isPrice = false) => {
    if (isPrice) {
      setTempSelectedPriceRanges((prevSelected) => {
        const updatedSelectedPriceRanges = prevSelected.includes(value)
          ? prevSelected.filter((item) => item !== value)
          : [...prevSelected, value]

        // Check if there are any filters selected to decide the visibility of the "Show results" button
        checkFilterVisibility(
          updatedSelectedPriceRanges,
          tempSelectedAttributes
        )
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

        // Check if there are any filters selected to decide the visibility of the "Show results" button
        checkFilterVisibility(tempSelectedPriceRanges, updatedAttributes)
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
      toast(
        "We couldn't find any products with those filters. Your filters have been reset.",
        {
          duration: 500,
          style: { borderLeft: "5px solid #fdc220" },
          icon: (
            <FontAwesomeIcon
              icon={faExclamationCircle}
              style={{
                color: "#fdc220",
                animation:
                  "toastZoom 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
                animationDelay: "100ms",
              }}
            />
          ),
          position: isMobileView ? "bottom-center" : "bottom-right", // Use 'bottom-center' for mobile view
        }
      )
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
                <DropdownContent>
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
                  {showResultsButtonVisible && (
                    <ShowResultsButton onClick={applyFilters}>
                      Show results
                    </ShowResultsButton>
                  )}
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
              <DropdownContent>
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
                {showResultsButtonVisible && (
                  <ShowResultsButton
                    onClick={applyFilters}
                    aria-label="Show results"
                  >
                    Show results
                  </ShowResultsButton>
                )}
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
