import React, {
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  KeyboardEvent,
} from "react"
import styled from "styled-components"
import { AccordionContext } from "./Accordion"
import Chevron from "@/public/images/icons/chevron-down.svg"

const AccordionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  padding: 12px;

  &:hover {
    background-color: #f5f6f8;
  }

  &:focus:not(:focus-visible) {
    box-shadow: none;
  }
`

const MediaContainer = styled.div`
  margin-right: 16px;
`

const TitleContainer = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
`

const Title = styled.div`
  color: #353a44;
  font-size: 16px;
  font-weight: 700;
`

const Subtitle = styled.div`
  color: #666;
`

const ActionsContainer = styled.div`
  margin-left: 16px;
`

const ClippingDiv = styled.div<{ isOpen: boolean; height: number }>`
  transition: height 300ms ease, overflow 300ms ease, opacity 300ms ease;
  overflow: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  height: ${({ height }) => height}px;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
`

const ContentDiv = styled.div<{ isOpen: boolean }>`
  transition-property: transform;
  transition-duration: 300ms;
  transition-timing-function: ease;
  transform: ${({ isOpen }) =>
    isOpen ? "translateY(0px)" : "translateY(-15px)"};
`

const Content = styled.div<{ isOpen: boolean }>`
  padding: 12px;
  transition: visibility 300ms ease;
  visibility: ${({ isOpen }) =>
    isOpen
      ? "visible"
      : "hidden"}; // Don't allow us to tab into contents that shouldn't be visible
`

const ChevronDiv = styled.div<{ isOpen: boolean }>`
  margin-right: 12px;
  transition: transform 0.3s ease;
  transform: ${({ isOpen }) => (isOpen ? "rotate(0deg)" : "rotate(-90deg)")};

  svg {
    width: 12px;
    height: 12px;
    fill: #474e5a;
  }
`

const Separator = styled.span`
  background-color: #d8dee4;
  flex: 0 0 1px;
`

interface AccordionItemProps {
  title: ReactNode
  children: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
  defaultOpen?: boolean
  media?: ReactNode
  onChange?: (isOpen: boolean) => void
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  subtitle,
  actions,
  defaultOpen = false,
  media,
  onChange,
}) => {
  const {
    openIndices,
    setOpenIndex,
    registerItem,
    getItemIndex,
    focusNextItem,
    focusPrevItem,
  } = useContext(AccordionContext)
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [height, setHeight] = useState(0)
  const itemRef = useRef<number>(Math.random())
  const contentRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerItem(itemRef.current, headerRef)
  }, [registerItem])

  useEffect(() => {
    const index = getItemIndex(itemRef.current)
    setIsOpen(openIndices.includes(index))
  }, [openIndices, getItemIndex])

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0)
    }
  }, [isOpen, children])

  const toggleOpen = () => {
    const index = getItemIndex(itemRef.current)
    setOpenIndex(index)
  }

  useEffect(() => {
    if (onChange) {
      onChange(isOpen)
    }
  }, [isOpen, onChange])

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case " ":
      case "Enter":
        event.preventDefault()
        toggleOpen()
        break
      case "ArrowDown":
        event.preventDefault()
        focusNextItem(headerRef)
        break
      case "ArrowUp":
        event.preventDefault()
        focusPrevItem(headerRef)
        break
    }
  }

  return (
    <>
      <div>
        <AccordionHeader
          onClick={toggleOpen}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-expanded={isOpen}
          aria-controls={`accordion-content-${itemRef.current}`}
          ref={headerRef}
        >
          <ChevronDiv isOpen={isOpen}>
            <Chevron />
          </ChevronDiv>
          {media && <MediaContainer>{media}</MediaContainer>}
          <TitleContainer>
            <Title>{title}</Title>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
          </TitleContainer>
          {actions && <ActionsContainer>{actions}</ActionsContainer>}
        </AccordionHeader>
        <ClippingDiv
          isOpen={isOpen}
          id={`accordion-content-${itemRef.current}`}
          height={height}
          role="region"
          aria-labelledby={`accordion-header-${itemRef.current}`}
        >
          <ContentDiv isOpen={isOpen}>
            <Content isOpen={isOpen} ref={contentRef}>
              {React.Children.map(children, (child) =>
                React.isValidElement(child)
                  ? React.cloneElement(child as React.ReactElement<any>)
                  : child
              )}
            </Content>
          </ContentDiv>
        </ClippingDiv>
      </div>
      <Separator />
    </>
  )
}

export default AccordionItem
