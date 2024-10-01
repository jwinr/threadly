import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  forwardRef,
  RefObject,
  MouseEventHandler,
  KeyboardEventHandler,
} from 'react'
import { UserContext } from '@/context/UserContext'
import { CartContext } from '@/context/CartContext'
import { useSignOut } from '@/context/SignOutContext'
import styled from 'styled-components'
import { signOut } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'
import SigningOutOverlay from '@/components/Auth/SigningOutOverlay'
import Popover from '@/components/Elements/Popover'
import { User, ShoppingBag, Heart, LogOut } from 'lucide-react'

interface UserButtonProps {
  $isOpen: boolean
}

const UserButton = styled.button<UserButtonProps>`
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  color: var(--sc-color-text);
  padding-left: 16px;
  padding-right: 8px;
  height: 40px;
  border-radius: 10px;
  align-items: center;
  background-color: ${({ $isOpen }) => ($isOpen ? '#f7f7f7' : '#fff')};
  display: flex;
  flex-shrink: 0;
  flex-grow: 1;
  min-width: 105px;

  svg {
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
    order: 2;
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
    stroke: var(--sc-color-icon);
  }
`

const IconContainer = styled.div`
  justify-content: center;
  display: flex;
`

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { userAttributes } = useContext(UserContext)
  const { setCart } = useContext(CartContext) ?? {}
  const { isSigningOut, setIsSigningOut } = useSignOut()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const firstMenuItemRef = useRef<HTMLLIElement>(null)
  const userButtonRef = useRef<HTMLButtonElement>(null)

  const given_name = userAttributes ? userAttributes.given_name : null

  const signOutHandler = async () => {
    setIsSigningOut(true) // Show the overlay

    try {
      await signOut() // Sign out via the AWS API
      await fetch('/api/logout') // Remove the cognito cookie
      setTimeout(() => {
        router.push('/')
        setCart?.([]) // Clear the cart state
        setIsSigningOut(false)
      }, 1100)
    } catch (error) {
      console.error('Error signing out:', error)
      setIsSigningOut(false)
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false)
    }
  }

  const handleEscapePress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const togglePopover = () => {
    setIsOpen(!isOpen)
  }

  const handleMenuItemClick = (
    href?: string,
    onClick?: MouseEventHandler<HTMLLIElement>
  ) => {
    if (onClick) {
      const event = new MouseEvent('click')
      onClick(event as unknown as React.MouseEvent<HTMLLIElement>)
    }

    if (href) {
      router.push(href)
    }

    setIsOpen(false)
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapePress)
      setTimeout(() => {
        firstMenuItemRef.current?.focus()
      }, 0) // Focus on the first item when opening
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapePress)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapePress)
    }
  }, [isOpen])

  const dropdownContent = (
    <DropdownMenu
      user={given_name}
      handleSignOut={signOutHandler}
      firstMenuItemRef={firstMenuItemRef}
      onMenuItemClick={handleMenuItemClick}
      userButtonRef={userButtonRef}
    />
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
          visible={isOpen}
        >
          <UserButton
            ref={userButtonRef}
            onClick={togglePopover}
            $isOpen={isOpen}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close user dropdown' : 'Open user dropdown'}
          >
            <IconContainer>
              <User size={20} />
            </IconContainer>
            <BtnText>{given_name ? `Hi, ${given_name}` : 'Sign in'}</BtnText>
          </UserButton>
        </Popover>
      </div>
    </>
  )
}

interface DropdownMenuProps {
  handleSignOut: MouseEventHandler<HTMLLIElement>
  user: string | null | undefined
  firstMenuItemRef: RefObject<HTMLLIElement>
  onMenuItemClick: (
    href?: string,
    onClick?: MouseEventHandler<HTMLLIElement>
  ) => void
  userButtonRef: RefObject<HTMLButtonElement>
}

function DropdownMenu({
  handleSignOut,
  user,
  firstMenuItemRef,
  onMenuItemClick,
  userButtonRef,
}: DropdownMenuProps) {
  return (
    <Menu role="menu">
      {user ? (
        <>
          <DropdownItem
            ref={firstMenuItemRef}
            href="/account"
            role="menuitem"
            onMenuItemClick={onMenuItemClick}
            userButtonRef={userButtonRef}
          >
            <User />
            <span>Profile</span>
          </DropdownItem>
          <DropdownItem
            href="/orders"
            role="menuitem"
            onMenuItemClick={onMenuItemClick}
            userButtonRef={userButtonRef}
          >
            <ShoppingBag />
            <span>Orders</span>
          </DropdownItem>
          <DropdownItem
            href="/favorites"
            role="menuitem"
            onMenuItemClick={onMenuItemClick}
            userButtonRef={userButtonRef}
          >
            <Heart />
            <span>Favorites</span>
          </DropdownItem>
          <DropdownItem
            onClick={handleSignOut}
            role="menuitem"
            onMenuItemClick={onMenuItemClick}
            userButtonRef={userButtonRef}
          >
            <LogOut />
            <span>Logout</span>
          </DropdownItem>
        </>
      ) : (
        <>
          <DropdownItem
            ref={firstMenuItemRef}
            href="/login"
            role="menuitem"
            onMenuItemClick={onMenuItemClick}
            userButtonRef={userButtonRef}
          >
            <span>Sign in</span>
          </DropdownItem>
          <DropdownItem
            href="/signup"
            role="menuitem"
            onMenuItemClick={onMenuItemClick}
            userButtonRef={userButtonRef}
          >
            <span>Create Account</span>
          </DropdownItem>
          <DropdownItem
            href="/orders"
            role="menuitem"
            onMenuItemClick={onMenuItemClick}
            userButtonRef={userButtonRef}
          >
            <span>Orders</span>
          </DropdownItem>
        </>
      )}
    </Menu>
  )
}

interface DropdownItemProps {
  children: React.ReactNode
  href?: string
  onClick?: MouseEventHandler<HTMLLIElement>
  role: string
  onMenuItemClick: (
    href?: string,
    onClick?: MouseEventHandler<HTMLLIElement>
  ) => void
  userButtonRef: RefObject<HTMLButtonElement>
}

const DropdownItem = forwardRef<HTMLLIElement, DropdownItemProps>(
  ({ children, href, onClick, role, onMenuItemClick, userButtonRef }, ref) => {
    const handleClick = () => {
      onMenuItemClick(href, onClick)
    }

    const handleKeyDown: KeyboardEventHandler<HTMLLIElement> = (event) => {
      const focusSibling = (
        direction: 'nextSibling' | 'previousSibling',
        fallback: 'firstChild' | 'lastChild'
      ) => {
        event.preventDefault()
        const sibling = event.currentTarget[direction]
        if (sibling) {
          ;(sibling as HTMLElement).focus()
        } else if (event.currentTarget.parentNode) {
          ;(event.currentTarget.parentNode[fallback] as HTMLElement).focus()
        }
      }

      switch (event.key) {
        case 'ArrowDown': {
          focusSibling('nextSibling', 'firstChild')
          break
        }
        case 'ArrowUp': {
          focusSibling('previousSibling', 'lastChild')
          break
        }
        case 'Tab': {
          event.preventDefault()

          // Focus on either the search button or the cart icon
          const focusableElements = document.querySelectorAll(
            `button:not([disabled])`
          )

          const userButtonIndex = Array.prototype.indexOf.call(
            focusableElements,
            userButtonRef.current
          )

          if (event.shiftKey) {
            if (userButtonIndex > 0) {
              ;(focusableElements[userButtonIndex - 1] as HTMLElement).focus()
            }
          } else {
            if (userButtonIndex < focusableElements.length - 1) {
              ;(focusableElements[userButtonIndex + 1] as HTMLElement).focus()
            }
          }
          break
        }
        case 'Enter':
        case ' ': {
          handleClick()
          break
        }
        default:
          break
      }
    }

    return (
      <MenuItem
        ref={ref}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role={role}
      >
        {children}
      </MenuItem>
    )
  }
)

export default UserDropdown
