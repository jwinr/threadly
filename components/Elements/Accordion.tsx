import React, {
  ReactNode,
  RefObject,
  createContext,
  useCallback,
  useMemo,
  useState,
} from 'react'

import styled from 'styled-components'

interface AccordionProps {
  children: ReactNode
}

interface AccordionContextProps {
  openIndices: number[]
  setOpenIndex: (index: number) => void
  registerItem: (index: number, ref: RefObject<HTMLDivElement>) => void
  getItemIndex: (key: number) => number
  focusNextItem: (currentRef: RefObject<HTMLDivElement>) => void
  focusPrevItem: (currentRef: RefObject<HTMLDivElement>) => void
}

export const AccordionContext = createContext<AccordionContextProps>({
  openIndices: [],
  setOpenIndex: () => {},
  registerItem: () => {},
  getItemIndex: () => -1,
  focusNextItem: () => {},
  focusPrevItem: () => {},
})

const Accordion: React.FC<AccordionProps> = ({ children }) => {
  const [openIndices, setOpenIndices] = useState<number[]>([])
  const [items, setItems] = useState<
    { index: number; ref: RefObject<HTMLDivElement> }[]
  >([])

  const registerItem = useCallback(
    (index: number, ref: RefObject<HTMLDivElement>) => {
      setItems((prevItems) => {
        if (!prevItems.some((item) => item.index === index)) {
          return [...prevItems, { index, ref }]
        }
        return prevItems
      })
    },
    []
  )

  const getItemIndex = useCallback(
    (key: number) => {
      return items.findIndex((item) => item.index === key)
    },
    [items]
  )

  const setOpenIndex = useCallback((index: number) => {
    setOpenIndices((prevIndices) =>
      prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index)
        : [...prevIndices, index]
    )
  }, [])

  const focusNextItem = useCallback(
    (currentRef: RefObject<HTMLDivElement>) => {
      const currentIndex = items.findIndex((item) => item.ref === currentRef)
      const nextIndex = (currentIndex + 1) % items.length
      items[nextIndex]?.ref.current?.focus()
    },
    [items]
  )

  const focusPrevItem = useCallback(
    (currentRef: RefObject<HTMLDivElement>) => {
      const currentIndex = items.findIndex((item) => item.ref === currentRef)
      const prevIndex = (currentIndex - 1 + items.length) % items.length
      items[prevIndex]?.ref.current?.focus()
    },
    [items]
  )

  const value = useMemo(
    () => ({
      openIndices,
      setOpenIndex,
      registerItem,
      getItemIndex,
      focusNextItem,
      focusPrevItem,
    }),
    [
      openIndices,
      setOpenIndex,
      registerItem,
      getItemIndex,
      focusNextItem,
      focusPrevItem,
    ]
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
