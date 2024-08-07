import React, { useState, useEffect, useRef } from "react"
import ReactDOM from "react-dom"
import styled, { css, keyframes } from "styled-components"
import PopArrow from "@/public/images/icons/popoverArrow.svg"

const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const fadeOutScale = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.85);
  }
`

const PopoverWrapper = styled.div<{ visible: boolean; position: string }>`
  position: absolute;
  z-index: 1000;
  animation: ${({ visible }) =>
    visible
      ? css`
          ${fadeInScale} 0.25s cubic-bezier(0, 1, 0.4, 1) forwards
        `
      : css`
          ${fadeOutScale} 0.25s cubic-bezier(0.18, 1.25, 0.4, 1) forwards
        `};
  pointer-events: ${({ visible }) => (visible ? "auto" : "none")};
  ${({ position }) =>
    (position === "left" || position === "right") && "align-items: center;"}
`

const PopoverContainer = styled.div`
  background: white;
  box-shadow: 0 0 0 1px #8898aa1a, 0 15px 35px #31315d1a, 0 5px 15px #00000014;
  border-radius: 6px;
  padding: 20px;
  font-size: 14px;
  max-width: 300px;
`

const Arrow = styled(PopArrow)<{ position: string }>`
  position: absolute;
  width: 21px;
  height: 9px;

  & path {
    color: #fff;
  }
  ${({ position }) =>
    position === "top" &&
    `
    transform: rotate(180deg);
    bottom: -9px;
    left: calc(50% - 10.5px);
  `}
  ${({ position }) =>
    position === "bottom" &&
    `
    top: -9px;
    left: calc(50% - 10.5px);
  `}
  ${({ position }) =>
    position === "left" &&
    `
    transform: rotate(90deg);
    right: -14px;
    top: calc(50% - 4.5px);
  `}
  ${({ position }) =>
    position === "right" &&
    `
    transform: rotate(-90deg);
    left: -14px;
    top: calc(50% - 4.5px);
  `}
`

interface PopoverProps {
  trigger: "hover" | "click" | "focus"
  position?: "top" | "bottom" | "left" | "right"
  content: React.ReactNode
  children: React.ReactNode
  showArrow?: boolean
}

/**
 * Displays a popover with the specified content when triggered by hover, click, or focus events.
 * The popover can be positioned at the top, bottom, left, or right of the trigger element.
 *
 * @param {string} trigger - The event type that triggers the popover (hover, click, focus).
 * @param {string} [position='bottom'] - The position of the popover relative to the trigger element (top, bottom, left, right).
 * @param {React.ReactNode} content - The content to be displayed inside the popover.
 * @param {React.ReactNode} children - The trigger element that will display the popover when interacted with.
 * @param {boolean} [showArrow=true] - Whether to show an arrow pointing to the trigger element.
 */
const Popover: React.FC<PopoverProps> = ({
  trigger,
  position = "bottom",
  content,
  children,
  showArrow = true,
}) => {
  const [visible, setVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const [exitTimeout, setExitTimeout] = useState<NodeJS.Timeout | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  /* Scale offset so the popovers are correctly aligned
  /* Taking the value offset from the transition and adding it to the expected value
  /* Value after the transition (1) - value during the transition (0.85) + expected value (1)
  */
  const scale = 1.15

  /**
   * Calculates the position of the popover based on the position of the trigger element and the desired popover position.
   */
  const calculatePosition = () => {
    if (triggerRef.current && wrapperRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const wrapperRect = wrapperRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      const scaledWidth = wrapperRect.width * scale
      const scaledHeight = wrapperRect.height * scale

      // Get the current scroll position
      const scrollX = window.scrollX || window.pageXOffset
      const scrollY = window.scrollY || window.pageYOffset

      const positions = {
        top: {
          top: triggerRect.top + scrollY - scaledHeight - 12,
          left:
            triggerRect.left +
            scrollX +
            triggerRect.width / 2 -
            scaledWidth / 2,
        },
        bottom: {
          top: triggerRect.bottom + scrollY + 11,
          left:
            triggerRect.left +
            scrollX +
            triggerRect.width / 2 -
            scaledWidth / 2,
        },
        left: {
          top:
            triggerRect.top +
            scrollY +
            triggerRect.height / 2 -
            scaledHeight / 2,
          left: triggerRect.left + scrollX - scaledWidth - 10,
        },
        right: {
          top:
            triggerRect.top +
            scrollY +
            triggerRect.height / 2 -
            scaledHeight / 2,
          left: triggerRect.right + scrollX + 10,
        },
      }

      let { top, left } = positions[position]

      // Adjust position to prevent overflow
      if (top < 0) top = 10
      if (left < 0) left = 10
      if (top + wrapperRect.height > viewportHeight + scrollY)
        top = viewportHeight + scrollY - wrapperRect.height - 10
      if (left + wrapperRect.width > viewportWidth + scrollX)
        left = viewportWidth + scrollX - wrapperRect.width - 10

      setCoords({ top, left })
    }
  }

  useEffect(() => {
    if (visible) {
      calculatePosition()
    }
  }, [visible, position])

  useEffect(() => {
    if (shouldRender) {
      setVisible(true) // Ensure the popover is visible after rendering
    } else {
      setVisible(false) // Hide the popover before removing from DOM
    }
  }, [shouldRender])

  useEffect(() => {
    const handleScroll = () => {
      if (wrapperRef.current) {
        const wrapperRect = wrapperRef.current.getBoundingClientRect()
        if (
          wrapperRect.top < 0 ||
          wrapperRect.bottom > window.innerHeight ||
          wrapperRect.left < 0 ||
          wrapperRect.right > window.innerWidth
        ) {
          setVisible(false)
          const timeout = setTimeout(() => {
            setShouldRender(false)
          }, 250)
          setExitTimeout(timeout) // Store the timeout so it can be cleared if needed
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setVisible(false)
        setTimeout(() => {
          setShouldRender(false)
        }, 250)
      }
    }

    if (trigger === "click" && visible) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [trigger, visible])

  /**
   * Handles mouse enter event for hover trigger.
   */
  const handleMouseEnter = () => {
    if (trigger === "hover") {
      if (exitTimeout) clearTimeout(exitTimeout) // Clear any existing exit timeout
      setShouldRender(true)
      setVisible(true)
    }
  }

  /**
   * Handles mouse leave event for hover trigger.
   */
  const handleMouseLeave = () => {
    if (trigger === "hover") {
      setVisible(false)
      const timeout = setTimeout(() => {
        setShouldRender(false)
      }, 250)
      setExitTimeout(timeout) // Store the timeout so it can be cleared if needed
    }
  }

  const handleFocus = () => {
    if (trigger === "focus") {
      if (exitTimeout) clearTimeout(exitTimeout) // Clear any existing exit timeout
      setShouldRender(true)
      setVisible(true)
    }
  }

  const handleBlur = () => {
    if (trigger === "focus") {
      setVisible(false)
      const timeout = setTimeout(() => {
        setShouldRender(false)
      }, 250)
      setExitTimeout(timeout) // Store the timeout so it can be cleared if needed
    }
  }

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => {
          if (trigger === "click") {
            setShouldRender(true)
            setVisible(!visible)
          }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        role="button"
        tabIndex={0}
      >
        {children}
      </div>
      {shouldRender &&
        ReactDOM.createPortal(
          <PopoverWrapper
            ref={wrapperRef}
            visible={visible}
            position={position}
            style={{
              top: coords.top,
              left: coords.left,
              transform: `scale(${visible ? 1 : scale})`,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {showArrow && <Arrow position={position} />}
            <PopoverContainer
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {content}
            </PopoverContainer>
          </PopoverWrapper>,
          document.body
        )}
    </>
  )
}

export default Popover
