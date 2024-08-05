import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import styled from "styled-components"
import { CSSTransition } from "react-transition-group"

import ChevronDown from "@/public/images/icons/chevron-down.svg"
import ChevronLeft from "@/public/images/icons/chevronLeft.svg"

import * as DropdownStyles from "./DropdownStyles"
import { useMobileView } from "@/context/MobileViewContext"
import MobileDrawer from "@/public/images/icons/mobileDrawer.svg"
import Backdrop from "../Backdrop"
import { useRouter } from "next/router.js"
import CategoriesConfig from "@/utils/CategoriesConfig"
import useScrollControl from "@/hooks/useScrollControl"

const ReturnButton = styled.div`
  -webkit-box-align: center;
  place-items: center;
  border-radius: 4px;
  display: flex;
  margin-right: 8px;
  cursor: pointer;

  svg {
    height: 16px;
    width: 16px;
  }

  svg > path {
    fill: var(--sc-color-icon);
  }
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

function NavItem(props) {
  const { isOpen, onToggle } = props
  const btnRef = useRef(null)
  const [dropdownLeft, setDropdownLeft] = useState(0)
  const [isScrollDisabled, setIsScrollDisabled] = useScrollControl()
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
        <DropdownStyles.Button isOpen={!isOpen} onClick={onToggle}>
          <MobileDrawer />
        </DropdownStyles.Button>
      ) : (
        <DropdownStyles.Button
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
          <DropdownStyles.BtnText>Categories</DropdownStyles.BtnText>
          <div className={`arrow-icon ${isOpen ? "rotate-arrow" : ""}`}>
            <ChevronDown />
          </div>
        </DropdownStyles.Button>
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
    <DropdownStyles.MenuItem
      onClick={handleClick}
      role="menuitem"
      tabIndex={isOpen ? 0 : -1} // Make it focusable only if isOpen is true
      onKeyDown={handleKeyDown}
    >
      {children}
    </DropdownStyles.MenuItem>
  ) : (
    <DropdownStyles.MenuItem
      onClick={handleClick}
      role="menuitem"
      tabIndex={isOpen ? 0 : -1} // Make it focusable only if isOpen is true
      onKeyDown={handleKeyDown}
    >
      {children}
    </DropdownStyles.MenuItem>
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
    <DropdownStyles.Dropdown
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
        <DropdownStyles.Menu>
          <DropdownStyles.ListHeader>All categories</DropdownStyles.ListHeader>
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
              setActiveMenu={setActiveMenu}
              setOpen={setOpen}
              isOpen={isOpen}
            >
              <span>{category.name}</span>
            </DropdownItem>
          ))}
        </DropdownStyles.Menu>
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
          <DropdownStyles.Menu>
            <DropdownStyles.ListHeader>
              <ReturnButton
                onClick={() => setActiveMenu("main")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setActiveMenu("main")}
              >
                <ChevronLeft />
              </ReturnButton>
              {category.name}
            </DropdownStyles.ListHeader>
            {getSubCategories(category.id).map((subCategory) => (
              <DropdownItem
                key={subCategory.id}
                href={`/categories/${subCategory.slug}`}
                setOpen={setOpen}
                isOpen={isOpen}
                setActiveMenu={setActiveMenu}
              >
                {subCategory.name}
              </DropdownItem>
            ))}
          </DropdownStyles.Menu>
        </CSSTransition>
      ))}
    </DropdownStyles.Dropdown>
  )
}

export default CategoryDropdown
