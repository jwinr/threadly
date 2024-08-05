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

const AccordionItemContainer = styled.div`
  border-bottom: 1px solid var(--sc-color-divider);
`

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
  transform: translateY(0px);
  transform: ${({ isOpen }) =>
    isOpen ? "translateY(0px)" : "translateY(-15px)"};
`

const Content = styled.div`
  padding: 12px;
`

const ChevronDiv = styled.div<{ isOpen: boolean }>`
  margin-right: 12px;
  transition: transform 0.3s ease;
  transform: ${({ isOpen }) => (isOpen ? "rotate(-180deg)" : "rotate(0deg)")};

  svg {
    width: 12px;
    height: 12px;
    fill: #474e5a;
  }
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
  const { openIndices, setOpenIndex, registerItem, getItemIndex } =
    useContext(AccordionContext)
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [height, setHeight] = useState(0)
  const [isRendered, setIsRendered] = useState(defaultOpen)
  const itemRef = useRef<number>(Math.random())
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerItem(itemRef.current)
  }, [registerItem])

  useEffect(() => {
    const index = getItemIndex(itemRef.current)
    setIsOpen(openIndices.includes(index))
    if (openIndices.includes(index)) {
      setIsRendered(true)
    }
  }, [openIndices, getItemIndex])

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        setHeight(contentRef.current.scrollHeight)
        setIsRendered(true)
      } else {
        setHeight(0)
        const timeout = setTimeout(() => setIsRendered(false), 300)
        return () => clearTimeout(timeout)
      }
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
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault()
      toggleOpen()
    }
  }

  return (
    <AccordionItemContainer>
      <AccordionHeader
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${itemRef.current}`}
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
      >
        {isRendered && (
          <ContentDiv isOpen={isOpen}>
            <Content ref={contentRef}>
              {React.Children.map(children, (child) =>
                React.isValidElement(child)
                  ? React.cloneElement(child as React.ReactElement<any>, {
                      tabIndex: isOpen ? 0 : -1,
                    })
                  : child
              )}
            </Content>
          </ContentDiv>
        )}
      </ClippingDiv>
    </AccordionItemContainer>
  )
}

export default AccordionItem
