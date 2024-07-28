import React, { useState, useEffect, useRef, useCallback } from "react"
import styled, { keyframes, css } from "styled-components"
import Checkbox from "../common/Checkbox"
import PropFilter from "../../utils/PropFilter"
import ChevronDown from "../../public/images/icons/chevron-down.svg"
import { VscClose } from "react-icons/vsc"
import Accordion from "../common/Accordion"
import AccordionItem from "../common/AccordionItem"

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`

const slideOut = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
`

const PanelContainer = styled(PropFilter("div")(["isOpen"]))`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 480px;
  max-height: 100%;
  height: 100vh;
  background-color: var(--sc-color-white);
  box-shadow: -4px 0 6px rgba(0, 0, 0, 0.1);
  z-index: 400;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  animation: ${({ isOpen }) => (isOpen ? slideIn : slideOut)} 0.3s ease forwards;

  @media (max-width: 768px) {
    width: auto;
  }
`

const Backdrop = styled(PropFilter("div")(["isOpen"]))`
  position: fixed;
  inset: 0;
  background-color: rgba(51, 51, 51, 0.8);
  backdrop-filter: blur(4px);
  z-index: 300;
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
  transition: opacity 0.3s ease-in-out;
  pointer-events: ${({ isOpen }) => (isOpen ? "auto" : "none")};
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 36px;
  cursor: pointer;
  color: var(--sc-color-white);
  position: absolute;
  right: 15px;
  top: 12px;
`

const ResetButton = styled.button`
  color: var(--sc-color-text-dark);
  border: 1px solid var(--sc-color-border-gray);
  padding: 10px 15px;
  margin: 10px 0;
  width: 100%;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: var(--sc-color-white-highlight);
  }

  &:focus-visible {
    background-color: var(--sc-color-white-highlight);
  }
`

const ApplyButton = styled.button`
  background-color: var(--sc-color-blue);
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 10px 0;
  width: 100%;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    background-color: var(--sc-color-dark-blue);
  }

  &:focus-visible {
    background-color: var(--sc-color-dark-blue);
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  text-align: left;
  width: 100%;
  height: 64px;
  padding: 20px;
  color: var(--sc-color-white);
  background-color: var(--sc-color-blue);
`

const Content = styled.div`
  overflow-y: auto;
  padding: 5px 12px 5px 24px;
  height: 100vh;
`

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px;
  gap: 16px;
  box-shadow: rgba(156, 156, 156, 0.7) 0px 0px 6px;
`

const AccordionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 10px 15px 10px;
  cursor: pointer;

  & h3 {
    font-size: 18px;
  }
`

const AccordionContent = styled(PropFilter("div")(["isOpen"]))`
  padding: 5px;
  overflow: hidden;
  transition: max-height 0.3s ease;

  label:last-child {
    margin-bottom: 17px; // Space for the last checkbox
  }
`

const StyledChevron = styled(PropFilter(ChevronDown)(["isOpen"]))`
  transition: transform 0.25s cubic-bezier(0, 0, 0, 1);
  ${({ isOpen }) =>
    isOpen &&
    css`
      transform: rotate(180deg);
    `}
`

const useScrollControl = () => {
  const [isScrollDisabled, setIsScrollDisabled] = useState(false)

  const disableScroll = useCallback(() => {
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflowY = "hidden"
    document.body.style.paddingRight = `${scrollBarWidth}px`
    document.body.style.touchAction = "none"
    document.body.style.overscrollBehavior = "none"
  }, [])

  const enableScroll = useCallback(() => {
    document.body.style.overflowY = "auto"
    document.body.style.paddingRight = "inherit"
    document.body.style.touchAction = "auto"
    document.body.style.overscrollBehavior = "auto"
  }, [])

  useEffect(() => {
    if (isScrollDisabled) {
      disableScroll()
    } else {
      enableScroll()
    }

    return () => {
      enableScroll()
    }
  }, [isScrollDisabled, disableScroll, enableScroll])

  return [setIsScrollDisabled]
}

const FilterPanel = ({
  isOpen,
  attributes,
  availablePriceRanges,
  selectedPriceRanges,
  selectedAttributes,
  onClose,
  toggleSelection,
  resetFilters,
  applyFilters,
  isMounted,
}) => {
  console.log(
    "selectedAttributes received in FilterPanel: ",
    selectedAttributes
  )
  const [setIsScrollDisabled] = useScrollControl()
  const [openSections, setOpenSections] = useState({})
  const panelRef = useRef(null)
  const dropdownPriceRef = useRef(null)
  const closeButtonRef = useRef(null)
  const applyButtonRef = useRef(null)
  const dropdownAttributeRef = attributes.map(() => useRef(null))

  useEffect(() => {
    setIsScrollDisabled(isOpen)
  }, [isOpen, setIsScrollDisabled])

  const toggleSection = (type) => {
    setOpenSections((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const handleKeyDown = (e, type) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      toggleSection(type)
    }
  }

  const handleTabKey = (event) => {
    if (event.key === "Tab") {
      const allRefs = [
        dropdownPriceRef,
        ...dropdownAttributeRef,
        applyButtonRef,
      ].map((ref) => ref.current)
      allRefs.forEach((dropdownRef, index) => {
        if (dropdownRef) {
          const focusableElements = dropdownRef.querySelectorAll(
            'input[type="checkbox"], button'
          )
          const lastFocusableElement =
            focusableElements[focusableElements.length - 1]
          if (document.activeElement === lastFocusableElement) {
            if (index === 0) {
              toggleSection("price")
            } else if (index === allRefs.length - 1) {
              event.preventDefault()
              closeButtonRef.current.focus()
            } else {
              const attributeType = attributes[index - 1].attribute_type
              toggleSection(attributeType)
            }
          }
        }
      })

      if (document.activeElement === applyButtonRef.current) {
        event.preventDefault()
        closeButtonRef.current.focus()
      }
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleTabKey)
    return () => {
      document.removeEventListener("keydown", handleTabKey)
    }
  }, [handleTabKey])

  return (
    <>
      {isMounted && (
        <Backdrop isOpen={isOpen} onClick={onClose}>
          <PanelContainer
            ref={panelRef}
            isOpen={isOpen}
            onClick={(e) => e.stopPropagation()}
          >
            <Header>
              <h2>All filters</h2>
            </Header>
            <CloseButton
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close filter panel"
            >
              <VscClose />
            </CloseButton>
            <Content>
              <Accordion>
                <AccordionItem
                  title="Price"
                  id="header-price"
                  tabIndex={0}
                  role="button"
                  aria-expanded={openSections["price"] ? "true" : "false"}
                  aria-controls="content-price"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSection("price")
                  }}
                  onKeyDown={(e) => handleKeyDown(e, "price")}
                >
                  <AccordionContent
                    id="content-price"
                    aria-labelledby="header-price"
                    isOpen={openSections["price"]}
                  >
                    {availablePriceRanges.map((priceRange, index) => (
                      <Checkbox
                        key={index}
                        id={`price-${priceRange}`}
                        label={priceRange}
                        checked={selectedPriceRanges.includes(priceRange)}
                        onChange={() =>
                          toggleSelection("price", priceRange, true)
                        }
                        data-type="price"
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {attributes.map((attribute, index) => (
                <Accordion key={index} ref={dropdownAttributeRef[index]}>
                  <AccordionItem
                    title={attribute.attribute_type}
                    id={`header-${attribute.attribute_type}`}
                    tabIndex={0}
                    role="button"
                    aria-expanded={
                      openSections[attribute.attribute_type] ? "true" : "false"
                    }
                    aria-controls={`content-${attribute.attribute_type}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSection(attribute.attribute_type)
                    }}
                    onKeyDown={(e) =>
                      handleKeyDown(e, attribute.attribute_type)
                    }
                  >
                    <AccordionContent
                      id={`content-${attribute.attribute_type}`}
                      aria-labelledby={`header-${attribute.attribute_type}`}
                      isOpen={openSections[attribute.attribute_type]}
                      aria-live="polite"
                    >
                      {attribute.attribute_values.map((value, valueIndex) => (
                        <Checkbox
                          key={valueIndex}
                          id={`attribute-${attribute.attribute_type}-${value}`}
                          label={value}
                          checked={selectedAttributes[
                            attribute.attribute_type
                          ]?.includes(value)}
                          onChange={() =>
                            toggleSelection(attribute.attribute_type, value)
                          }
                          data-type={attribute.attribute_type}
                        />
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </Content>
            <BottomContainer>
              <ResetButton onClick={resetFilters}>Clear all</ResetButton>
              <ApplyButton ref={applyButtonRef} onClick={applyFilters}>
                See results
              </ApplyButton>
            </BottomContainer>
          </PanelContainer>
        </Backdrop>
      )}
    </>
  )
}

export default FilterPanel
