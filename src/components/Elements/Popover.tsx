/* eslint-disable jsx-a11y/click-events-have-key-events */
// Note: Disabled rule since it does have key events
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group'
import PopArrow from '@/public/images/icons/popoverArrow.svg'
import PortalWrapper from '@/components/Elements/PortalWrapper'

const PopoverWrapper = styled.div<{ $fixed: boolean }>`
  position: ${({ $fixed }) => ($fixed ? 'fixed' : 'absolute')};
  z-index: 1000;
`

const PopoverTransitionContainer = styled.div`
  // Note that we're using the same values for the enter states.
  // This is to prevent an unpleasant scaling/opacity flicker if
  // the user rapidly hovers & dehovers the trigger. Instead,
  // we can simply start with the base styles below and then
  // transition to the enter classes, while the enter-done
  // class will prevent it from reverting to the base styles.
  opacity: 0;
  transition:
    opacity 0.25s cubic-bezier(0, 1, 0.4, 1),
    transform 0.25s cubic-bezier(0.18, 1.25, 0.4, 1);
  transform: scale(0.85);

  &.popover-enter,
  .popover-enter-active {
    opacity: 1;
    transform: scale(1);
  }
  &.popover-enter-done {
    opacity: 1;
    transform: scale(1);
  }

  &.popover-exit {
    opacity: 1;
    transform: scale(1);
  }

  &.popover-exit-active {
    opacity: 0;
    transform: scale(0.95);
    transition:
      opacity 200ms ease-in,
      transform 200ms ease-in;
  }
`

const PopoverContainer = styled.div<{ color: string; $padding: string }>`
  color: ${({ color }) => (color === 'dark' ? 'white' : 'initial')};
  background: ${({ color }) =>
    color === 'dark' ? 'var(--sc-color-gray-700)' : 'white'};
  box-shadow:
    0 0 0 1px #8898aa1a,
    0 15px 35px #31315d1a,
    0 5px 15px #00000014;
  border-radius: 6px;
  padding: ${({ $padding }) => $padding};
  font-size: 14px;
  max-width: 300px;
`

const Arrow = styled(PopArrow) <{ color: string; position: string; offset: number }>`
  position: absolute;
  width: 21px;
  height: 9px;
  color: ${({ color }) => (color === 'dark' ? 'var(--sc-color-gray-700)' : '#fff')};

  ${({ position, offset }) =>
    position === 'top' &&
    `
    transform: rotate(180deg);
    bottom: -9px;
    left: calc(50% - 10.5px + ${offset}px);
  `}
  ${({ position, offset }) =>
    position === 'bottom' &&
    `
    top: -9px;
    left: calc(50% - 10.5px + ${offset}px);
  `}
  ${({ position, offset }) =>
    position === 'left' &&
    `
    transform: rotate(90deg);
    right: -14px;
    top: calc(50% - 4.5px + ${offset}px);
  `}
  ${({ position, offset }) =>
    position === 'right' &&
    `
    transform: rotate(-90deg);
    left: -14px;
    top: calc(50% - 4.5px + ${offset}px);
  `}
`

interface PopoverProps {
  trigger: 'hover' | 'click' | 'focus'
  position?: 'top' | 'bottom' | 'left' | 'right'
  content: React.ReactNode
  children: React.ReactNode
  showArrow?: boolean
  color?: 'light' | 'dark'
  padding?: string
  fixed?: boolean
  visible?: boolean
}

/**
 * Popover component to display content in a floating container relative to a trigger element.
 *
 * @param {PopoverProps} props - The properties object.
 * @param {React.ReactNode} props.children - The trigger element(s) for the popover.
 * @param {React.ReactNode} props.content - The content to be displayed inside the popover.
 * @param {"top" | "bottom" | "left" | "right"} [props.placement="bottom"] - The preferred placement of the popover.
 * @param {boolean} [props.showArrow=true] - Whether to show an arrow pointing to the trigger element.
 * @param {"light" | "dark"} [props.color="light"] - The color theme of the popover.
 * @param {string} [props.padding="20px"] - The padding for the content inside the popover.
 * @param {boolean} [props.fixed=false] - Whether the popover should remain fixed in place during scrolling.
 * @param {boolean} [props.visible] - If provided, controls the visibility of the popover externally.
 *    When this prop is passed, the visibility state is controlled by the parent component.
 * @returns {JSX.Element} The rendered popover component.
 */
const Popover: React.FC<PopoverProps> = ({
  trigger,
  position = 'bottom',
  content,
  children,
  showArrow = true,
  color = 'light',
  padding = '20px',
  fixed = false,
  visible: controlledVisible,
}) => {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const [arrowOffset, setArrowOffset] = useState(0)
  const triggerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const nodeRef = React.useRef(null)

  // If a controlled visibility prop is passed, use it
  useEffect(() => {
    if (controlledVisible !== undefined) {
      setVisible(controlledVisible)
    }
  }, [controlledVisible])

  const calculatePosition = () => {
    if (!triggerRef.current || !wrapperRef.current) {
      return
    }

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const wrapperRect = wrapperRef.current.getBoundingClientRect()
    const arrowAdjustment = showArrow ? 10 : 5

    const baseTopPosition =
      triggerRect.top + triggerRect.height / 2 - wrapperRect.height / 2
    const baseLeftPosition =
      triggerRect.left + triggerRect.width / 2 - wrapperRect.width / 2

    const positions = {
      top: {
        top: triggerRect.top - wrapperRect.height - arrowAdjustment,
        left: baseLeftPosition,
      },
      bottom: {
        top: triggerRect.bottom + arrowAdjustment + 1,
        left: baseLeftPosition,
      },
      left: {
        top: baseTopPosition,
        left: triggerRect.left - wrapperRect.width - arrowAdjustment,
      },
      right: {
        top: baseTopPosition,
        left: triggerRect.right + arrowAdjustment,
      },
    }

    let { top, left } = positions[position]

    // Adjust for scrolling if not fixed
    if (!fixed) {
      top += window.scrollY
      left += window.scrollX
    }

    // Prevent overflow from screen edges
    top = Math.max(
      10,
      Math.min(
        top,
        window.innerHeight + window.scrollY - wrapperRect.height - 20
      )
    )
    left = Math.max(
      10,
      Math.min(
        left,
        window.innerWidth + window.scrollX - wrapperRect.width - 20
      )
    )

    // Calculate arrow offset
    const offset =
      position === 'top' || position === 'bottom'
        ? triggerRect.left +
        triggerRect.width / 2 -
        left -
        wrapperRect.width / 2
        : triggerRect.top +
        triggerRect.height / 2 -
        top -
        wrapperRect.height / 2

    // Only update state if values have actually changed
    setCoords((prevCoords) => {
      if (prevCoords.top !== top || prevCoords.left !== left) {
        return { top, left }
      }
      return prevCoords
    })

    setArrowOffset((prevOffset) => {
      if (prevOffset !== offset) {
        return offset
      }
      return prevOffset
    })
  }

  const isOutOfViewport = (rect: DOMRect) =>
    rect.top < 0 ||
    rect.left < 0 ||
    rect.bottom > window.innerHeight ||
    rect.right > window.innerWidth

  const isClickOutside = (
    event: MouseEvent,
    refs: React.RefObject<HTMLElement>[]
  ): boolean => {
    return refs.every(
      (ref) => ref.current && !ref.current.contains(event.target as Node)
    )
  }

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (!fixed && wrapperRef.current) {
        const wrapperRect = wrapperRef.current.getBoundingClientRect()
        if (isOutOfViewport(wrapperRect)) {
          setTimeout(() => {
            setVisible(false)
          }, 250)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', calculatePosition)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', calculatePosition)
    }
  }, [fixed])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Tab') {
        setVisible(false)
      }
    }

    if (visible) {
      document.addEventListener('keydown', handleKeyDown)
    } else {
      document.removeEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [visible])

  // Hack: Watch for dimension changes and recalculate the position
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (visible) calculatePosition();
    });

    if (wrapperRef.current) observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, [visible]);

  useLayoutEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isClickOutside(event, [wrapperRef, triggerRef])) {
        setVisible(false)
      }
    }

    if (trigger === 'click' && visible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [trigger, visible])

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setVisible(true)
    }
  }

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setVisible(false)
    }
  }

  const handleFocus = () => {
    if (trigger === 'focus' || trigger === 'hover') {
      setVisible(true)
    }
  }

  const handleBlur = () => {
    if (trigger === 'focus' || trigger === 'hover') {
      setVisible(false)
    }
  }

  return (
    <>
      <div
        ref={triggerRef}
        role="button"
        aria-label="hidden"
        tabIndex={-1}
        onClick={() => {
          if (trigger === 'click' && controlledVisible === undefined) {
            setVisible(!visible)
          }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {children}
      </div>
      {content && (
        <PortalWrapper>
          <PopoverWrapper
            ref={wrapperRef}
            style={{
              top: coords.top,
              left: coords.left,
            }}
            $fixed={fixed}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <CSSTransition
              nodeRef={nodeRef}
              in={visible}
              timeout={250}
              classNames="popover"
              unmountOnExit
              onEnter={calculatePosition}
            >
              <PopoverTransitionContainer ref={nodeRef}>
                {showArrow && (
                  <Arrow color={color} position={position} offset={arrowOffset} />
                )}
                <PopoverContainer color={color} $padding={padding}>
                  {content}
                </PopoverContainer>
              </PopoverTransitionContainer>
            </CSSTransition>
          </PopoverWrapper>
        </PortalWrapper>
      )}
    </>
  )
}

export default Popover
