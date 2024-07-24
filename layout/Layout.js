import { useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"
import ToastConfig from "../utils/ToastConfig"
import Footer from "./Footer"
import Navbar from "./navbar/Navbar"
import styled from "styled-components"

const SiteWrapper = styled.div`
  background-color: var(--sc-color-background);
  display: flex;
  justify-content: center;
  position: relative;
  min-height: calc(-63px + 100vh);
`

const ContentWrapper = styled.div`
  width: calc(100% - 0px);
  margin: 0px auto;
  max-width: 1400px;
  background-color: var(--sc-color-background);
`

export default function Layout({ children }) {
  const [openDropdown, setOpenDropdown] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = (dropdown) => {
    setOpenDropdown((prevState) => {
      const newState = prevState === dropdown ? null : dropdown
      return newState
    })
  }

  return (
    <>
      <Navbar openDropdown={openDropdown} handleToggle={handleToggle} />
      <SiteWrapper>
        <ContentWrapper>{children}</ContentWrapper>
      </SiteWrapper>
      <Footer />
      {mounted && <Toaster toastOptions={ToastConfig} aria-live="polite" />}
    </>
  )
}
