import React, { useState, useEffect, useContext, useRef } from "react"
import { UserContext } from "@/context/UserContext"
import { CartContext } from "@/context/CartContext"
import { useSignOut } from "@/context/SignOutContext"
import styled from "styled-components"
import AccountIcon from "@/public/images/icons/account.svg"
import { signOut } from "aws-amplify/auth"
import { useRouter } from "next/navigation"
import SigningOutOverlay from "@/components/Auth/SigningOutOverlay"
import Popover from "@/components/Elements/Popover"

import Profile from "@/public/images/icons/account.svg"
import Order from "@/public/images/icons/order.svg"
import Favorite from "@/public/images/icons/favorite.svg"
import Logout from "@/public/images/icons/logout.svg"

const UserButton = styled.button`
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  color: var(--sc-color-text);
  padding-left: 16px;
  padding-right: 8px;
  height: 40px;
  border-radius: 10px;
  align-items: center;
  background-color: ${({ isOpen }) => (isOpen ? "#f7f7f7" : "#fff")};
  display: flex;

  svg {
    fill: var(--sc-color-icon);

    @media (max-width: 768px) {
      width: 20px;
      height: 20px;
    }
  }

  &:hover {
    background-color: var(--sc-color-white-highlight);

    svg {
      opacity: 1;
    }
  }

  &:focus-visible {
    svg {
      opacity: 1;
    }
  }

  &:hover .arrow-icon,
  &.arrow-icon-visible .arrow-icon svg {
    opacity: 1;
  }

  &:focus:not(:focus-visible) {
    --s-focus-ring: 0;
  }

  &.initial-hidden {
    opacity: 0;
    transform: translateY(20px);
    transition: none;
  }

  @media (max-width: 768px) {
    order: 2; // Between the logo and cart icon on mobile layouts
    margin-left: auto;
    margin-right: 8px;
    font-size: 30px;
    height: 44px;
    width: 44px;
    padding: 0;
    justify-content: center;
    background-color: transparent;

    &:active {
      background-color: var(--sc-color-white-highlight);
    }
  }
`

export const BtnText = styled.div`
  padding: 0 5px;
  color: var(--sc-color-gray-700);

  @media (max-width: 768px) {
    display: none;
  }
`

const Menu = styled.div`
  width: 240px;

  & a:focus {
    text-decoration: underline;
    outline: none;
  }
`

const MenuItem = styled.li`
  display: flex;
  align-items: center;
  padding: 4px 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--sc-color-carnation);
  min-width: 160px;
  margin-left: 4px;
  margin-right: 6px;
  cursor: pointer;
  border-radius: 6px;

  &:hover {
    background-color: #f5f6f8;
  }

  &:focus:not(:focus-visible) {
    --s-focus-ring: 0;
    box-shadow: none;
  }

  span {
    margin-left: 5px;
  }

  & svg {
    width: 16px;
    height: 16px;
    margin-right: 6px;

    > path {
      fill: var(--sc-color-icon);
    }
  }
`

const IconContainer = styled.div`
  justify-content: center;
  display: flex;

  svg {
    width: 16px;
    height: 16px;
    margin-right: 5px;

    path {
      fill: var(--sc-color-icon);
    }
  }

  @media (max-width: 768px) {
    svg {
      width: 18px;
      height: 18px;
      margin-right: 0;
    }
  }
`

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { userAttributes } = useContext(UserContext)
  const { setCart } = useContext(CartContext)
  const { isSigningOut, setIsSigningOut } = useSignOut()
  const router = useRouter()
  const dropdownRef = useRef(null)

  const given_name = userAttributes ? userAttributes.given_name : null

  const signOutHandler = async () => {
    setIsSigningOut(true) // Show the overlay

    try {
      await signOut() // Sign out the user
      setTimeout(() => {
        router.push("/")
        setCart([]) // Clear the cart state
        setIsSigningOut(false)
      }, 1100)
    } catch (error) {
      console.error("Error signing out:", error)
      setIsSigningOut(false)
    }
  }

  // Event handlers to set the proper aria-label state
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  const handleEscapePress = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscapePress)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapePress)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapePress)
    }
  }, [isOpen])

  const dropdownContent = (
    <DropdownMenu user={given_name} handleSignOut={signOutHandler} />
  )

  return (
    <>
      <SigningOutOverlay visible={isSigningOut} />
      <div ref={dropdownRef}>
        <Popover
          trigger="click"
          content={dropdownContent}
          position="bottom"
          showArrow={false}
          padding="4px 0"
          fixed={true}
        >
          <UserButton
            onClick={() => setIsOpen(!isOpen)}
            $isOpen={isOpen}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close user dropdown" : "Open user dropdown"}
          >
            <IconContainer>
              <AccountIcon />
            </IconContainer>
            <BtnText>{given_name ? `Hi, ${given_name}` : "Sign in"}</BtnText>
          </UserButton>
        </Popover>
      </div>
    </>
  )
}

function DropdownMenu({ handleSignOut, user }) {
  return (
    <Menu>
      {user ? (
        <>
          <DropdownItem href="/account">
            <Profile />
            <span>Profile</span>
          </DropdownItem>
          <DropdownItem href="/orders">
            <Order />
            <span>Orders</span>
          </DropdownItem>
          <DropdownItem href="/favorites">
            <Favorite />
            <span>Favorites</span>
          </DropdownItem>
          <DropdownItem onClick={handleSignOut}>
            <Logout />
            <span>Logout</span>
          </DropdownItem>
        </>
      ) : (
        <>
          <DropdownItem href="/login">
            <span>Sign in</span>
          </DropdownItem>
          <DropdownItem href="/signup">
            <span>Create Account</span>
          </DropdownItem>
          <DropdownItem href="/orders">
            <span>Orders</span>
          </DropdownItem>
        </>
      )}
    </Menu>
  )
}

function DropdownItem({ children, href, onClick }) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) onClick()
    if (href) router.push(href)
  }

  return <MenuItem onClick={handleClick}>{children}</MenuItem>
}

export default UserDropdown
