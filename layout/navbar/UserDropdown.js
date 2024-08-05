import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react"
import { UserContext } from "@/context/UserContext"
import { CartContext } from "@/context/CartContext"
import { useSignOut } from "@/context/SignOutContext"
import styled from "styled-components"
import * as DropdownStyles from "./DropdownStyles"
import ChevronDown from "@/public/images/icons/chevron-down.svg"
import AccountIcon from "@/public/images/icons/account.svg"
import { CSSTransition } from "react-transition-group"
import Backdrop from "../Backdrop"
import { signOut } from "aws-amplify/auth"
import PropFilter from "@/utils/PropFilter"
import { useRouter } from "next/router"
import SigningOutOverlay from "@/components/Auth/SigningOutOverlay"
import useScrollControl from "@/hooks/useScrollControl"

const Dropdown = styled(DropdownStyles.Dropdown)`
  right: ${(props) => props.right}px; // Dynamic right position

  @media (max-width: 768px) {
    right: 0px !important;
  }
`

const UserButton = styled(DropdownStyles.Button)`
  @media (max-width: 768px) {
    order: 2; // Between the logo and cart icon on mobile layouts
  }
`

const IconContainer = styled.div`
  justify-content: center;
  display: flex;

  svg {
    width: 16px;
    height: 16px;

    path {
      fill: var(--sc-color-icon);
    }
  }

  @media (max-width: 768px) {
    svg {
      width: 18px;
      height: 18px;
    }
  }
`

const UserDropdown = ({ isOpen: parentIsOpen, onToggle }) => {
  const { userAttributes } = useContext(UserContext)
  const { setCart } = useContext(CartContext)
  const [isMounted, setIsMounted] = useState(false)
  const { isSigningOut, setIsSigningOut } = useSignOut()
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {}, [parentIsOpen])

  const handleSignOut = async (setIsSigningOut, router, setCart) => {
    setIsSigningOut(true) // Show the overlay and popup

    try {
      await signOut()
      localStorage.removeItem("userAttributes") // Remove user attributes from local storage on logout
      setTimeout(() => {
        router.push("/")
        setCart([]) // Clear the cart state
        setIsSigningOut(false)
      }, 1100) // Add a 1100ms delay
    } catch (error) {
      console.error("Error signing out:", error)
      setIsSigningOut(false) // Hide the overlay and popup on error
    }
  }

  // Use userAttributes to assign the given_name. If userAttributes is not available, set given_name to null.
  // This is so we can conditionally display “Hi, {user}” if user is available, otherwise display “Sign in”.
  const given_name = userAttributes ? userAttributes.given_name : null

  const signOutHandler = async () => {
    await handleSignOut(setIsSigningOut, router, setCart)
  }

  return (
    <>
      <SigningOutOverlay visible={isSigningOut} />
      <NavItem
        isOpen={isMounted && parentIsOpen}
        onToggle={onToggle}
        user={given_name}
        isSigningOut={isSigningOut}
      >
        <DropdownMenu
          isOpen={isMounted && parentIsOpen}
          user={given_name}
          handleSignOut={signOutHandler}
        />
      </NavItem>
    </>
  )
}

function NavItem(props) {
  const { isOpen, onToggle, user, isSigningOut } = props
  const userBtnRef = useRef(null)
  const [dropdownRight, setDropdownRight] = useState(0)
  const [isScrollDisabled, setIsScrollDisabled] = useScrollControl()
  const [isMounted, setIsMounted] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    setTimeout(() => setInitialLoad(false), 0) // Ensure initialLoad is set to false after the initial render

    if (isOpen) {
      setIsScrollDisabled(true)
      if (userBtnRef.current) {
        const rect = userBtnRef.current.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        // Calculate the right position while keeping the dropdown within the viewport
        const rightPosition = viewportWidth - rect.right - 15 // Offset for the additional padding/margin
        setDropdownRight(rightPosition)
        userBtnRef.current.focus()
      }
    } else {
      setIsScrollDisabled(false)
    }
  }, [isOpen, setIsScrollDisabled])

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onToggle()
      userBtnRef.current.focus() // Return focus to the button when closed
    }
  }

  // Prevent the dropdown from being opened by clicking on the backdrop component as it closes
  const handleToggle = useCallback(() => {
    if (isOpen) {
      onToggle()
    }
  }, [isOpen, onToggle])

  return (
    <>
      <Backdrop
        className={initialLoad ? "initial-hidden" : isOpen ? "visible" : ""}
        onClick={handleToggle}
      />
      <UserButton
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        ref={userBtnRef}
        isOpen={isOpen}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`${initialLoad ? "initial-hidden" : ""} ${
          isOpen ? "arrow-icon-visible" : ""
        }`}
      >
        <IconContainer>
          <AccountIcon />
        </IconContainer>
        <DropdownStyles.BtnText>
          {user ? `Hi, ${user}` : "Sign in"}
        </DropdownStyles.BtnText>
        <div className={`arrow-icon ${isOpen ? "rotate-arrow" : ""}`}>
          <ChevronDown />
        </div>
      </UserButton>
      {React.cloneElement(props.children, {
        dropdownRight: dropdownRight,
        setOpen: onToggle,
        className: `${
          initialLoad ? "initial-hidden" : isOpen ? "visible" : "invisible"
        }`, // Add the visibility class only after mounted
        user: user,
        isSigningOut: isSigningOut,
      })}
    </>
  )
}

function DropdownItem({ children, href, setOpen, onClick, isOpen }) {
  const router = useRouter()

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setOpen(false)
      if (onClick) onClick()
      if (href) router.push(href)
    }
  }

  const handleClick = () => {
    setOpen(false)
    if (onClick) onClick()
    if (href) router.push(href)
  }

  return (
    <DropdownStyles.MenuItem
      onClick={handleClick}
      role="menuitem"
      tabIndex={isOpen ? 0 : -1} // Make it focusable only if isOpen is true
      onKeyDown={handleKeyDown}
    >
      <span>{children}</span>
    </DropdownStyles.MenuItem>
  )
}

function DropdownMenu({
  dropdownRight,
  setOpen,
  className,
  handleSignOut,
  user,
  isOpen,
}) {
  const [menuHeight, setMenuHeight] = useState(null)
  const userDropdownRef = useRef(null)

  useEffect(() => {
    if (userDropdownRef.current && userDropdownRef.current.firstChild) {
      setMenuHeight(userDropdownRef.current.firstChild.offsetHeight)
    }
  }, [user])

  function calcHeight(el) {
    const height = el.offsetHeight
    setMenuHeight(height)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <Dropdown
      style={{ height: menuHeight, right: dropdownRight }}
      ref={userDropdownRef}
      role="menu"
      onKeyDown={handleKeyDown}
      className={className} // Apply the visibility class
      isOpen={isOpen}
    >
      <CSSTransition
        in={true}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <DropdownStyles.Menu>
          {user ? (
            <>
              <DropdownStyles.ListHeader>Account</DropdownStyles.ListHeader>
              <DropdownItem href="/account" setOpen={setOpen} isOpen={isOpen}>
                Profile
              </DropdownItem>
              <DropdownItem href="/orders" setOpen={setOpen} isOpen={isOpen}>
                Orders
              </DropdownItem>
              <DropdownItem href="/favorites" setOpen={setOpen} isOpen={isOpen}>
                Favorites
              </DropdownItem>
              <DropdownItem
                onClick={handleSignOut}
                setOpen={setOpen}
                isOpen={isOpen}
              >
                Logout
              </DropdownItem>
            </>
          ) : (
            <>
              <DropdownStyles.ListHeader>Account</DropdownStyles.ListHeader>
              <DropdownItem href="/login" setOpen={setOpen} isOpen={isOpen}>
                Sign in
              </DropdownItem>
              <DropdownItem href="/signup" setOpen={setOpen} isOpen={isOpen}>
                Create Account
              </DropdownItem>
              <DropdownItem
                href="/orders" // Need to modify this to lead to the sign-in component then redirect to the orders page
                setOpen={setOpen}
                isOpen={isOpen}
              >
                Orders
              </DropdownItem>
            </>
          )}
        </DropdownStyles.Menu>
      </CSSTransition>
    </Dropdown>
  )
}

export default UserDropdown
