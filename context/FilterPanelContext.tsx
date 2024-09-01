'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/router'

interface FilterState {
  currentPage: number
  selectedPriceRanges: string[]
  selectedAttributes: Record<string, string[]>
  filteredItems: any[]
  isAttributeDropdownOpen: Record<string, boolean>
}

interface FilterPanelContextType {
  isPanelOpen: boolean
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>
  filterState: FilterState
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>
}

const FilterPanelContext = createContext<FilterPanelContextType | undefined>(undefined)

const initialState: FilterState = {
  currentPage: 1,
  selectedPriceRanges: [],
  selectedAttributes: {},
  filteredItems: [],
  isAttributeDropdownOpen: {},
}

// Load state from sessionStorage
const loadState = (slug: string): FilterState => {
  if (typeof window !== 'undefined') {
    const sessionData = sessionStorage.getItem(`filterState_${slug}`)
    return sessionData ? JSON.parse(sessionData) : initialState
  }
  return initialState // Default initial state if not in browser
}

export const useFilterPanel = () => {
  const context = useContext(FilterPanelContext)
  if (!context) {
    throw new Error('useFilterPanel must be used within a FilterPanelProvider')
  }
  return context
}

interface FilterPanelProviderProps {
  children: ReactNode
}

export const FilterPanelProvider: React.FC<FilterPanelProviderProps> = ({ children }) => {
  const router = useRouter()
  const { slug } = router.query
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  // Load initial state from session storage
  const [filterState, setFilterState] = useState<FilterState>(initialState)

  // Load state from sessionStorage when slug changes
  useEffect(() => {
    if (slug && typeof slug === 'string') {
      const savedState = loadState(slug)
      setFilterState(savedState)
    } else {
      setFilterState(initialState)
    }
  }, [slug])

  // Sync filter state with URL query parameters
  useEffect(() => {
    if (router.query.filters) {
      const queryFilters = JSON.parse(decodeURIComponent(router.query.filters as string))

      setFilterState((prev) => ({
        ...prev,
        selectedAttributes: queryFilters,
      }))
    }
  }, [router.query.filters])

  // Save filter state to sessionStorage whenever it changes
  useEffect(() => {
    if (slug && typeof slug === 'string' && router.pathname.startsWith('/categories/')) {
      sessionStorage.setItem(`filterState_${slug}`, JSON.stringify(filterState))
    }
  }, [filterState, slug, router.pathname])

  return (
    <FilterPanelContext.Provider
      value={{
        isPanelOpen,
        setIsPanelOpen,
        filterState,
        setFilterState,
      }}
    >
      {children}
    </FilterPanelContext.Provider>
  )
}
