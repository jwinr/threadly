'use client'

import React, { useState, ReactNode, FC, useCallback } from 'react'
import Footer from './Footer'
import Navigation from './navbar/Navigation'
import styled from 'styled-components'

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
`

interface LayoutProps {
  children: ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const handleToggle = useCallback((dropdown: string) => {
    setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown))
  }, [])

  return (
    <>
      <Navigation openDropdown={openDropdown} handleToggle={handleToggle} />
      <SiteWrapper>
        <ContentWrapper>{children}</ContentWrapper>
      </SiteWrapper>
      <Footer />
    </>
  )
}

export default Layout
