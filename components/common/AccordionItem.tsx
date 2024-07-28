import React, {
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react"
import styled from "styled-components"
import { AccordionContext } from "./Accordion"

const AccordionItemContainer = styled.div`
  border-bottom: 1px solid #ddd;
`

const AccordionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 16px;
`

const MediaContainer = styled.div`
  margin-right: 16px;
`

const TitleContainer = styled.div`
  flex-grow: 1;
`

const Title = styled.div`
  font-weight: bold;
`

const Subtitle = styled.div`
  color: #666;
`

const ActionsContainer = styled.div`
  margin-left: 16px;
`

const AccordionContent = styled.div`
  padding: 16px;
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
  const { openIndex, setOpenIndex, registerItem, getItemIndex } =
    useContext(AccordionContext)
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const itemRef = useRef<number>(Math.random())

  useEffect(() => {
    registerItem(itemRef.current)
  }, [registerItem])

  useEffect(() => {
    setIsOpen(openIndex === getItemIndex(itemRef.current))
  }, [openIndex, getItemIndex])

  const toggleOpen = () => {
    const newOpenState = isOpen ? -1 : getItemIndex(itemRef.current)
    setOpenIndex(newOpenState)
    setIsOpen(newOpenState === getItemIndex(itemRef.current))
  }

  useEffect(() => {
    if (onChange) {
      onChange(isOpen)
    }
  }, [isOpen, onChange])

  return (
    <AccordionItemContainer>
      <AccordionHeader onClick={toggleOpen}>
        {media && <MediaContainer>{media}</MediaContainer>}
        <TitleContainer>
          <Title>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </TitleContainer>
        {actions && <ActionsContainer>{actions}</ActionsContainer>}
      </AccordionHeader>
      {isOpen && <AccordionContent>{children}</AccordionContent>}
    </AccordionItemContainer>
  )
}

export default AccordionItem
