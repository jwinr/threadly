import React, { FC } from "react"
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
  top: 0;
  height: 64px;
  z-index: 300;

  @media (max-width: 768px) {
    display: block;
    height: 125px;
  }
`

const NavbarWrapper = styled.div`
  background-color: var(--sc-color-white) !important;
  padding: 7px 0px 7px 0px;
  box-shadow: rgba(0, 0, 0, 0.04) 0px -1px 2px, rgba(0, 0, 0, 0.04) 0px 1px 2px,
    rgba(0, 0, 0, 0.04) 0px 3px 4px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0px 0px 0px 0px;
    height: 100%;
  }
`

const NavbarFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  gap: 20px;
  padding: 5px 20px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0;
  }
`

const MobileFlexContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    position: relative;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 20px;
  }
`

const Logo = styled.a`
  display: flex;
  width: 125px;
  height: 100%;
  align-items: center;
  border: 1px transparent;
  border-radius: 10px;
  padding: 2px;

  &:focus:not(:focus-visible) {
    --s-focus-ring: 0;
  }

  @media (max-width: 768px) {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 44px;
    width: 75px;
    transform: translate(-50%, -50%);
    padding: 0;
    margin: 0;
  }
`

interface NavbarProps {
  openDropdown: string | null
  handleToggle: (dropdown: string) => void
  categories: any // Replace 'any' with the specific type if you know it
}

const Navbar: FC<NavbarProps> = ({
  openDropdown,
  handleToggle,
  categories,
}) => {
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
        {!isMobileView && (
          <>
            <NavbarFlex>
              <Logo href="/" aria-label="Home">
                <BannerLogo alt="Threadly Logo" />
              </Logo>
              <CategoryDropdown
                isOpen={openDropdown === "category"}
                onToggle={() => handleToggle("category")}
              />
              <SearchBar />
              <UserDropdown
                isOpen={openDropdown === "user"}
                onToggle={() => handleToggle("user")}
                aria-label="User Menu"
              />
              <CartIcon aria-label="Shopping Cart" />
            </NavbarFlex>
          </>
        )}
        {isMobileView && (
          <MobileFlexContainer>
            <CategoryDropdown
              isOpen={openDropdown === "category"}
              onToggle={() => handleToggle("category")}
            />
            <Logo href="/" aria-label="Home">
              <BannerLogo alt="Threadly Logo" />
            </Logo>
            <UserDropdown
              isOpen={openDropdown === "user"}
              onToggle={() => handleToggle("user")}
              aria-label="User Menu"
            />
            <CartIcon aria-label="Shopping Cart" />
          </MobileFlexContainer>
        )}
        {isMobileView && <SearchBar />}
      </NavbarWrapper>
    </NavbarContainer>
  )
}

export default Navbar
