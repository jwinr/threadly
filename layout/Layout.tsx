import React, { useState, ReactNode, FC, useCallback } from "react"
import Footer from "./Footer"
import Navbar from "./navbar/Navbar"
import styled from "styled-components"

const SiteWrapper = styled.div`
  background-color: var(--sc-color-background);
  display: flex;
  justify-content: center;
  position: relative;
  min-height: calc(100vh - 63px);
`

const ContentWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  max-width: 1400px;
  background-color: var(--sc-color-background);
`

interface LayoutProps {
  children: ReactNode
  categories: Category[]
}

interface Category {
  name: string
}

const Layout: FC<LayoutProps> = ({ children, categories }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const handleToggle = useCallback((dropdown: string) => {
    setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown))
  }, [])

  return (
    <>
      <Navbar
        openDropdown={openDropdown}
        handleToggle={handleToggle}
        categories={categories}
      />
      <SiteWrapper>
        <ContentWrapper>{children}</ContentWrapper>
      </SiteWrapper>
      <Footer />
    </>
  )
}

export default Layout
