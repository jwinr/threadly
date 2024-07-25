import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import styled from "styled-components"
import { CSSTransition } from "react-transition-group"
import { RiArrowDownSLine, RiArrowLeftSLine } from "react-icons/ri"
import { useMobileView } from "../../context/MobileViewContext"
import { IoIosMenu } from "react-icons/io"
import Link from "next/link"
import Backdrop from "../Backdrop"
import PropFilter from "../../utils/PropFilter"
import { useRouter } from "next/router.js"
import CategoriesConfig from "../../utils/CategoriesConfig"

const Dropdown = styled.div`
  position: absolute;
  top: 63px;
  width: 275px;
  background-color: var(--sc-color-white);
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
  padding-bottom: 8px;
  overflow: hidden;
  z-index: -100;
  box-sizing: content-box;
  transition: visibility 0s, transform 0.3s cubic-bezier(0.3, 0.85, 0, 1),
    height var(--speed) ease;
  left: ${(props) => props.left}px;
  transform: translateY(-1000px); // Initially move it up slightly and hide

  &.visible {
    visibility: visible;
    transform: translateY(0); // Slide it into place
  }

  &.invisible {
    transform: translateY(-1000px);
  }

  &.initial-hidden {
    transform: translateY(-1000px);
    transition: none;
  }

  @media (max-width: 768px) {
    top: 110px;
  }
`

const CategoryButton = styled(PropFilter("button")(["isOpen"]))`
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  color: var(--sc-color-text);
  padding-left: 16px;
  padding-right: 8px;
  height: 100%;
  border-radius: 10px;
  align-items: center;
  background-color: ${({ isOpen }) => (isOpen ? "#f7f7f7" : "#fff")};
  display: flex;
  align-items: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--sc-color-white-highlight);
  }

  &:hover .arrow-icon,
  &.arrow-icon-visible .arrow-icon {
    opacity: 1;
  }

  &.initial-hidden {
    opacity: 0;
    transform: translateY(20px);
    transition: none;
  }

  @media (max-width: 768px) {
    font-size: 30px;
    height: 44px;
    width: 44px;
    padding: 0;
    justify-content: center;
    background-color: transparent;

    &:active {
      background-color: var(--sc-color-white-highlight);
    }

    &:hover {
      background-color: transparent;
    }
  }
`

const Menu = styled.div`
  width: 100%;

  & a:focus {
    text-decoration: underline;
    outline: none;
  }
`

const MenuItem = styled.li`
  height: 50px;
  display: flex;
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  transition: background var(--speed);
  font-size: 16px;
  color: #000;
  width: 100%;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

const ListHeader = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  transition: background var(--speed);
  font-size: 18px;
  font-weight: 600;
  color: #000;
  width: 100%;
  text-decoration: none;

  &:focus {
    text-decoration: underline;
    outline: none;
  }
`

const ReturnButton = styled.div`
  -webkit-box-align: center;
  place-items: center;
  border-radius: 4px;
  display: flex;
  margin-right: 8px;
  cursor: pointer;
`

const BtnText = styled.div`
  padding: 0 5px;
`

const CategoryDropdown = ({ isOpen: parentIsOpen, onToggle }) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {}, [parentIsOpen])

  return (
    <NavItem isOpen={isMounted && parentIsOpen} onToggle={onToggle}>
      <DropdownMenu
        isOpen={isMounted && parentIsOpen}
        categories={CategoriesConfig}
      />
    </NavItem>
  )
}

const useScrollControl = () => {
  const [isScrollDisabled, setIsScrollDisabled] = useState(false)

  // Function to disable scrolling and add padding to compensate for scrollbar removal
  const disableScroll = useCallback(() => {
    // Calculate the width of the scrollbar
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflowY = "hidden"
    // Add padding to the right to compensate for the removed scrollbar
    document.body.style.paddingRight = `${scrollBarWidth}px`
    document.body.style.touchAction = "none"
    document.body.style.overscrollBehavior = "none"
  }, [])

  // Function to enable scrolling and reset the body styles
  const enableScroll = useCallback(() => {
    document.body.style.overflowY = "auto"
    document.body.style.paddingRight = "inherit"
    document.body.style.touchAction = "auto"
    document.body.style.overscrollBehavior = "auto"
  }, [])

  // Effect to enable/disable scroll based on the isScrollDisabled state
  useEffect(() => {
    if (isScrollDisabled) {
      disableScroll()
    } else {
      enableScroll()
    }

    // Cleanup function to enable scroll when component is unmounted or effect re-runs
    return () => {
      enableScroll()
    }
  }, [isScrollDisabled, disableScroll, enableScroll])

  return [setIsScrollDisabled]
}

function NavItem(props) {
  const { isOpen, onToggle } = props
  const btnRef = useRef(null)
  const [dropdownLeft, setDropdownLeft] = useState(0)
  const [setIsScrollDisabled] = useScrollControl()
  const isMobileView = useMobileView()
  const [isMounted, setIsMounted] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    setTimeout(() => setInitialLoad(false), 0) // Ensure initialLoad is set to false after the initial render

    if (isOpen) {
      setIsScrollDisabled(true)
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect()
        setDropdownLeft(rect.left)
        btnRef.current.focus()
      }
    } else {
      setIsScrollDisabled(false)
    }
  }, [isOpen, setIsScrollDisabled])

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onToggle()
      btnRef.current.focus() // Return focus to the button when closed
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
      {isMobileView ? (
        <CategoryButton isOpen={!isOpen} onClick={onToggle}>
          <IoIosMenu />
        </CategoryButton>
      ) : (
        <CategoryButton
          onClick={onToggle}
          onKeyDown={handleKeyDown}
          ref={btnRef}
          isOpen={isOpen}
          aria-haspopup="true"
          aria-expanded={isOpen}
          className={`${initialLoad ? "initial-hidden" : ""} ${
            isOpen ? "arrow-icon-visible" : ""
          }`}
        >
          <BtnText>Categories</BtnText>
          <div className={`arrow-icon ${isOpen ? "rotate-arrow" : ""}`}>
            <RiArrowDownSLine />
          </div>
        </CategoryButton>
      )}
      {React.cloneElement(props.children, {
        dropdownLeft: isMobileView ? 0 : dropdownLeft,
        setOpen: onToggle,
        className: `${
          initialLoad ? "initial-hidden" : isOpen ? "visible" : "invisible"
        }`, // Add the visibility class only after mounted
      })}
    </>
  )
}

function DropdownItem({
  children,
  goToMenu,
  hasSubCategories,
  href,
  setActiveMenu,
  setOpen,
  isOpen,
}) {
  const router = useRouter()

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (goToMenu) {
        setActiveMenu(goToMenu)
      } else {
        setOpen(false)
      }
    }
  }

  const handleClick = () => {
    if (goToMenu) {
      setActiveMenu(goToMenu)
    } else {
      setOpen(false)
      router.push(href)
    }
  }

  return hasSubCategories ? (
    <MenuItem
      onClick={handleClick}
      role="menuitem"
      tabIndex={isOpen ? 0 : -1} // Make it focusable only if isOpen is true
      onKeyDown={handleKeyDown}
    >
      {children}
    </MenuItem>
  ) : (
    <MenuItem
      onClick={handleClick}
      role="menuitem"
      tabIndex={isOpen ? 0 : -1} // Make it focusable only if isOpen is true
      onKeyDown={handleKeyDown}
    >
      {children}
    </MenuItem>
  )
}

function DropdownMenu({
  categories,
  dropdownLeft,
  setOpen,
  className,
  isOpen,
}) {
  const [activeMenu, setActiveMenu] = useState("main")
  const [menuHeight, setMenuHeight] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (dropdownRef.current?.firstChild) {
      setMenuHeight(dropdownRef.current.firstChild.offsetHeight)
    }
  }, [categories]) // Recalculate height when categories changes

  function calcHeight(el) {
    const height = el.offsetHeight
    setMenuHeight(height)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpen(false)
    }
  }

  const getSubCategories = (parentId) => {
    const category = CategoriesConfig.find(
      (category) => category.id === parentId
    )
    return category ? category.subCategories || [] : []
  }

  return (
    <Dropdown
      style={{ height: menuHeight, left: dropdownLeft }}
      ref={dropdownRef}
      role="menu"
      onKeyDown={handleKeyDown}
      className={className} // Apply the visibility class
    >
      <CSSTransition
        in={activeMenu === "main"}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <Menu>
          <ListHeader>All categories</ListHeader>
          {CategoriesConfig.map((category) => (
            <DropdownItem
              key={category.id}
              goToMenu={
                category.subCategories && category.subCategories.length > 0
                  ? category.id
                  : null
              }
              hasSubCategories={
                category.subCategories && category.subCategories.length > 0
              }
              href={`/categories/${category.slug}`}
              setActiveMenu={setActiveMenu} // Pass setActiveMenu to DropdownItem
              setOpen={setOpen} // Pass setOpen to DropdownItem
              isOpen={isOpen}
            >
              {category.name}
              {category.subCategories && category.subCategories.length > 0 && (
                <RiArrowDownSLine className="arrow-icon" />
              )}
            </DropdownItem>
          ))}
        </Menu>
      </CSSTransition>

      {CategoriesConfig.map((category) => (
        <CSSTransition
          key={category.id}
          in={activeMenu === category.id}
          timeout={500}
          classNames="menu-secondary"
          unmountOnExit
          onEnter={calcHeight}
        >
          <Menu>
            <ListHeader>
              <ReturnButton
                onClick={() => setActiveMenu("main")}
                role="button"
                tabIndex={0} // Make it focusable
                onKeyDown={(e) => e.key === "Enter" && setActiveMenu("main")}
              >
                <RiArrowLeftSLine size={28} />
              </ReturnButton>
              {category.name}
            </ListHeader>
            {getSubCategories(category.id).map((subCategory) => (
              <DropdownItem
                key={subCategory.id}
                href={`/categories/${subCategory.slug}`}
                setOpen={setOpen}
                isOpen={isOpen}
                setActiveMenu={setActiveMenu} // Pass setActiveMenu to DropdownItem
              >
                {subCategory.name}
              </DropdownItem>
            ))}
          </Menu>
        </CSSTransition>
      ))}
    </Dropdown>
  )
}

export default CategoryDropdown
