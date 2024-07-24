import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react"
import { useRouter } from "next/router"

const FilterPanelContext = createContext()

const initialState = {
  currentPage: 1,
  selectedPriceRanges: [],
  selectedAttributes: {},
  filteredItems: [],
  isAttributeDropdownOpen: {},
}

// Load state from sessionStorage
const loadState = (slug) => {
  if (typeof window !== "undefined") {
    const sessionData = sessionStorage.getItem(`filterState_${slug}`)
    return sessionData ? JSON.parse(sessionData) : initialState
  }
  return initialState // Default initial state if not in browser
}

export const useFilterPanel = () => {
  return useContext(FilterPanelContext)
}

export const FilterPanelProvider = ({ children }) => {
  const router = useRouter()
  const { slug } = router.query
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  // Load initial state from session storage
  const [filterState, setFilterState] = useState(initialState)

  // Load state from sessionStorage when slug changes
  useEffect(() => {
    if (slug) {
      const savedState = loadState(slug)
      setFilterState(savedState)
    } else {
      setFilterState(initialState)
    }
  }, [slug])

  // Sync filter state with URL query parameters
  useEffect(() => {
    if (router.query.filters) {
      const queryFilters = JSON.parse(decodeURIComponent(router.query.filters))

      setFilterState((prev) => ({
        ...prev,
        selectedAttributes: queryFilters,
      }))
    }
  }, [router.query.filters])

  // Save filter state to sessionStorage whenever it changes
  useEffect(() => {
    if (slug && router.pathname.startsWith("/categories/")) {
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
