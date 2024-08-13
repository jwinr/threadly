"use client"

import React, { createContext, useEffect, useState, useContext } from "react"

const MobileViewContext = createContext()

export const MobileViewProvider = ({ children }) => {
  const [isMobileView, setIsMobileView] = useState(false)

  useEffect(() => {
    const mobileBreakpoint = 768
    const mediaQuery = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`)

    const handleMediaQueryChange = (e) => {
      setIsMobileView(e.matches)
    }

    // Set initial state
    setIsMobileView(mediaQuery.matches)

    // Add listener for media query changes
    mediaQuery.addEventListener("change", handleMediaQueryChange)

    // Clean up listener on unmount
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange)
    }
  }, [])

  return (
    <MobileViewContext.Provider value={isMobileView}>
      {children}
    </MobileViewContext.Provider>
  )
}

export const useMobileView = () => useContext(MobileViewContext)
