import React, { useEffect, useRef, useCallback } from "react"
import styled, { keyframes } from "styled-components"
import Checkbox from "../common/Checkbox"
import PropFilter from "../../utils/PropFilter"
import Cancel from "../../public/images/icons/cancel.svg"
import Accordion from "../common/Accordion"
import AccordionItem from "../common/AccordionItem"
import Button from "../common/Button"
import useScrollControl from "../../hooks/useScrollControl"

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
  font-size: 20px;
  cursor: pointer;
  position: absolute;
  right: 15px;
  top: 24px;

  svg > path {
    fill: var(--sc-color-white);
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  text-align: left;
  width: 100%;
  height: 63px;
  padding: 20px;
  color: var(--sc-color-white);
  background-color: var(--sc-color-blue);
`

const Content = styled.div`
  overflow: hidden scroll;
  padding: 16px;
  height: 100vh;
`

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px;
  gap: 16px;
  box-shadow: rgba(156, 156, 156, 0.7) 0px 0px 6px;
`

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
  const [isScrollDisabled, setIsScrollDisabled] = useScrollControl()
  const panelRef = useRef(null)
  const closeButtonRef = useRef(null)
  const applyButtonRef = useRef(null)

  const firstFocusableElement = useRef(null)
  const lastFocusableElement = useRef(null)

  const focusableSelectors =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

  useEffect(() => {
    setIsScrollDisabled(isOpen)
  }, [isOpen, setIsScrollDisabled])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Tab") {
        const focusableElements =
          panelRef.current.querySelectorAll(focusableSelectors)
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]
        firstFocusableElement.current = firstElement
        lastFocusableElement.current = lastElement

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    },
    [focusableSelectors]
  )

  const handleInitialFocus = useCallback(
    (e) => {
      if (e.key === "Tab") {
        e.preventDefault()
        const focusableElements =
          panelRef.current.querySelectorAll(focusableSelectors)
        const firstElement = focusableElements[0]
        firstElement.focus()
        document.removeEventListener("keydown", handleInitialFocus)
      }
    },
    [focusableSelectors]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.addEventListener("keydown", handleInitialFocus)
      return () => {
        document.removeEventListener("keydown", handleKeyDown)
        document.removeEventListener("keydown", handleInitialFocus)
      }
    }
  }, [isOpen, handleKeyDown, handleInitialFocus])

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
            <Content>
              <Accordion>
                <AccordionItem title="Price" defaultOpen={false}>
                  <div>
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
                  </div>
                </AccordionItem>
              </Accordion>
              {attributes.map((attribute, index) => (
                <Accordion key={index}>
                  <AccordionItem
                    title={attribute.attribute_type}
                    defaultOpen={false}
                  >
                    <div>
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
                    </div>
                  </AccordionItem>
                </Accordion>
              ))}
            </Content>
            <BottomContainer>
              <Button type="secondary" size="large" onClick={resetFilters}>
                Clear all
              </Button>
              <Button
                type="primary"
                size="large"
                ref={applyButtonRef}
                onClick={applyFilters}
              >
                See results
              </Button>
            </BottomContainer>
            <CloseButton
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close filter panel"
            >
              <Cancel />
            </CloseButton>
          </PanelContainer>
        </Backdrop>
      )}
    </>
  )
}

export default FilterPanel
