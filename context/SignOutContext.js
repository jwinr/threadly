"use client"

import React, { createContext, useState, useContext } from "react"

const SignOutContext = createContext()

export const SignOutProvider = ({ children }) => {
  const [isSigningOut, setIsSigningOut] = useState(false)

  return (
    <SignOutContext.Provider value={{ isSigningOut, setIsSigningOut }}>
      {children}
    </SignOutContext.Provider>
  )
}

export const useSignOut = () => useContext(SignOutContext)
