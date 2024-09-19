'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface PortalWrapperProps {
  children: ReactNode
}

const PortalWrapper: React.FC<PortalWrapperProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false)
  const elRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    elRef.current = document.createElement('div')
    let portalRoot = document.getElementById('portal-root')
    if (!portalRoot) {
      portalRoot = document.createElement('div')
      portalRoot.id = 'portal-root'
      document.body.appendChild(portalRoot)
    }
    portalRoot.appendChild(elRef.current)
    setMounted(true)

    return () => {
      if (elRef.current && portalRoot?.contains(elRef.current)) {
        portalRoot.removeChild(elRef.current)
      }
    }
  }, [])

  if (!mounted || !elRef.current) {
    return null
  }

  return createPortal(children, elRef.current)
}

export default PortalWrapper
