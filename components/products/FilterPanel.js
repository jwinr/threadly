import React, { useState, useEffect, useRef, useCallback } from "react"
import ReactDOM from "react-dom"

import styled, { keyframes } from "styled-components"

import Checkbox from "@/components/Elements/Checkbox"
import PropFilter from "@/utils/PropFilter"
import Cancel from "@/public/images/icons/cancel.svg"
import Accordion from "@/components/Elements/Accordion"
import AccordionItem from "@/components/Elements/AccordionItem"
import Button from "@/components/Elements/Button"
import useScrollControl from "@/hooks/useScrollControl"

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
  height: 100vh;
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
  top: 18px;
  padding: 5px;

  &:hover svg > path {
    fill: #474e5a;
  }

  &:focus:not(:focus-visible) {
    --s-focus-ring: 0;
  }

  svg {
    width: 18px;
    height: 18px;
  }

  svg > path {
    fill: #6c7688;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  text-align: left;
  width: 100%;
  height: 64px;
  padding: 20px;
  color: var(--sc-color-title);
  border-bottom: 1px solid #d8dee4;
  background-color: var(--sc-color-white);
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
  const [shouldRender, setShouldRender] = useState(isOpen)
  const [isScrollDisabled, setIsScrollDisabled] = useScrollControl()
  const panelRef = useRef(null)
  const closeButtonRef = useRef(null)
  const applyButtonRef = useRef(null)

  const firstFocusableElement = useRef(null)
  const lastFocusableElement = useRef(null)

  const focusableSelectors =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

  const hasSelectedFilters = () => {
    return (
      selectedPriceRanges.length > 0 ||
      Object.values(selectedAttributes).some((attr) => attr.length > 0)
    )
  }

  // Update shouldRender based on isOpen. If isOpen becomes false, set a timeout to delay the removal of the panel by 300ms.
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
    } else {
      const timeoutId = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timeoutId)
    }
  }, [isOpen])

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
      {isMounted &&
        shouldRender &&
        ReactDOM.createPortal(
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
                <Button
                  type="secondary"
                  size="large"
                  onClick={resetFilters}
                  disabled={!hasSelectedFilters()}
                >
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
          </Backdrop>,
          document.body
        )}
    </>
  )
}

export default FilterPanel
