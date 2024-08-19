"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

const PortalWrapper = ({ children }) => {
  const elRef = useRef(null)
  if (!elRef.current) {
    elRef.current = document.createElement("div")
  }

  useEffect(() => {
    let portalRoot = document.getElementById("portal-root")
    if (!portalRoot) {
      portalRoot = document.createElement("div")
      portalRoot.id = "portal-root"
      document.body.appendChild(portalRoot)
    }
    portalRoot.appendChild(elRef.current)
    return () => {
      if (portalRoot.contains(elRef.current)) {
        portalRoot.removeChild(elRef.current)
      }
    }
  }, [])

  return createPortal(children, elRef.current)
}

export default PortalWrapper
