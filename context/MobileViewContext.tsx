'use client'

import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'

interface MobileViewContextType {
  isMobileView: boolean
}

const MobileViewContext = createContext<MobileViewContextType | undefined>(undefined)

export const MobileViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMobileView, setIsMobileView] = useState(false)

  useEffect(() => {
    const mobileBreakpoint = 768
    const mediaQuery = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`)

    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setIsMobileView(e.matches)
    }

    setIsMobileView(mediaQuery.matches)

    mediaQuery.addEventListener('change', handleMediaQueryChange)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange)
    }
  }, [])

  return (
    <MobileViewContext.Provider value={{ isMobileView }}>{children}</MobileViewContext.Provider>
  )
}

export const useMobileView = () => {
  const context = useContext(MobileViewContext)
  if (!context) {
    throw new Error('useMobileView must be used within a MobileViewProvider')
  }
  return context.isMobileView
}
