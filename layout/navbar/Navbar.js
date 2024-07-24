import { useState } from "react"
import { useRouter } from "next/router"
import styled from "styled-components"
import BannerLogo from "../../public/images/logo.svg"
import CategoryDropdown from "./CategoryDropdown"
import SearchBar from "./SearchBar"
import CartIcon from "./CartIcon"
import UserDropdown from "./UserDropdown"
import { useMobileView } from "../../context/MobileViewContext"

const NavbarContainer = styled.div`
  font-size: 16px;
  color: #000;
  display: flex;
  position: sticky;
  background-color: var(--sc-color-white);
  box-shadow: 0 8px 21px -12px rgba(0, 0, 0, 0.2);
  top: 0;
  z-index: 300;

  @media (max-width: 768px) {
    display: block;
  }
`

const NavbarWrapper = styled.div`
  background-color: var(--sc-color-white) !important;
  border-bottom: 1px solid #e4e4e4;
  padding: 7px 0px 7px 0px;
  width: 100%;
`

const NavbarFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 5px 20px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`

const Logo = styled.a`
  display: flex;
  width: 135px;
  height: 100%;
  align-items: center;
  border: 1px transparent;
  border-radius: 10px;
  padding: 2px;
  margin-right: 20px;

  @media (max-width: 768px) {
    flex: 1 1 auto;
    margin: 0;
    padding-left: 77px; // Using an entire button width x 1.75
    padding-right: 23px; // Button width x 0.75 (smaller value since we have two buttons on the right side) - 10px (margin for the user dropdown button)
    padding-top: 0;
    order: 1; // Center element on mobile layouts
  }
`

const Navbar = ({ openDropdown, handleToggle }) => {
  const router = useRouter()
  const isMobileView = useMobileView()

  // Check if the current route is /login, /signup, /forgot-password or /404
  const isLoginPage = router.pathname === "/login"
  const isSignupPage = router.pathname === "/signup"
  const isForgotPassPage = router.pathname === "/forgot-password"
  const is404Page = router.pathname === "/404"

  // Render the Navbar only if the route is not /login, /signup, /forgot-password or /404
  // This also extends to any invalid path routes, i.e. /<any-nonexistent-path>
  if (isLoginPage || isSignupPage || isForgotPassPage || is404Page) {
    return null
  }

  return (
    <NavbarContainer>
      <NavbarWrapper>
        <NavbarFlex>
          <Logo href="/" aria-label="Home">
            <BannerLogo alt="TechNexus Logo" />
          </Logo>
          <CategoryDropdown
            isOpen={openDropdown === "category"}
            onToggle={() => handleToggle("category")}
          />
          {!isMobileView && <SearchBar />}
          <UserDropdown
            isOpen={openDropdown === "user"}
            onToggle={() => handleToggle("user")}
            aria-label="User Menu"
          />
          <CartIcon aria-label="Shopping Cart" />
          {isMobileView && <SearchBar />}
        </NavbarFlex>
      </NavbarWrapper>
    </NavbarContainer>
  )
}

export default Navbar
