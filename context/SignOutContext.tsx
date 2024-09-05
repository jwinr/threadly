'use client'

import React, { ReactNode, createContext, useContext, useState } from 'react'

interface SignOutContextType {
  isSigningOut: boolean
  setIsSigningOut: React.Dispatch<React.SetStateAction<boolean>>
}

const SignOutContext = createContext<SignOutContextType | undefined>(undefined)

export const SignOutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isSigningOut, setIsSigningOut] = useState(false)

  return (
    <SignOutContext.Provider value={{ isSigningOut, setIsSigningOut }}>
      {children}
    </SignOutContext.Provider>
  )
}

export const useSignOut = () => {
  const context = useContext(SignOutContext)
  if (!context) {
    throw new Error('useSignOut must be used within a SignOutProvider')
  }
  return context
}
