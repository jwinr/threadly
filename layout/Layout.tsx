import React, { useState, ReactNode, FC } from "react"
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

interface LayoutProps {
  children: ReactNode
  categories: any
}

const Layout: FC<LayoutProps> = ({ children, categories }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const handleToggle = (dropdown: string) => {
    setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown))
  }

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
