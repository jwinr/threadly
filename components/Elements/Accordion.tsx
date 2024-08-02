import React, {
  useState,
  createContext,
  ReactNode,
  useMemo,
  useCallback,
} from "react"

import styled from "styled-components"

interface AccordionProps {
  children: ReactNode
}

interface AccordionContextProps {
  openIndex: number
  setOpenIndex: (index: number) => void
  registerItem: (index: number) => void
  getItemIndex: (key: number) => number
}

export const AccordionContext = createContext<AccordionContextProps>({
  openIndex: -1,
  setOpenIndex: () => {},
  registerItem: () => {},
  getItemIndex: () => -1,
})

const Accordion: React.FC<AccordionProps> = ({ children }) => {
  const [openIndex, setOpenIndex] = useState<number>(-1)
  const [items, setItems] = useState<number[]>([])

  const registerItem = useCallback((index: number) => {
    setItems((prevItems) => {
      if (!prevItems.includes(index)) {
        return [...prevItems, index]
      }
      return prevItems
    })
  }, [])

  const getItemIndex = useCallback(
    (key: number) => {
      return items.indexOf(key)
    },
    [items]
  )

  const value = useMemo(
    () => ({
      openIndex,
      setOpenIndex,
      registerItem,
      getItemIndex,
    }),
    [openIndex, registerItem, getItemIndex]
  )

  return (
    <AccordionContext.Provider value={value}>
      <AccordionContainer>{children}</AccordionContainer>
    </AccordionContext.Provider>
  )
}

const AccordionContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export default Accordion
