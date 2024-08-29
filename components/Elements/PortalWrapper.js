"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

const PortalWrapper = ({ children }) => {
  const [mounted, setMounted] = useState(false)
  const elRef = useRef(null)

  useEffect(() => {
    elRef.current = document.createElement("div")
    let portalRoot = document.getElementById("portal-root")
    if (!portalRoot) {
      portalRoot = document.createElement("div")
      portalRoot.id = "portal-root"
      document.body.appendChild(portalRoot)
    }
    portalRoot.appendChild(elRef.current)
    setMounted(true)

    return () => {
      if (portalRoot.contains(elRef.current)) {
        portalRoot.removeChild(elRef.current)
      }
    }
  }, [])

  if (!mounted) {
    return null
  }

  return createPortal(children, elRef.current)
}

export default PortalWrapper
