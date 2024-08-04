import React, { useState, useEffect } from "react"

import styled, { css } from "styled-components"

import Check from "@/public/images/icons/check.svg"
import Warning from "@/public/images/icons/warning.svg"

interface ToastProps {
  message: string
  type: "success" | "caution" | "pending"
  action?: string
  onAction?: () => void
  onDismiss: () => void
  timeout?: number
  index: number
  id: string
}

const ToastContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--sc-color-gray-700);
  font-size: 14px;
  color: #fff;
  padding: 12px 16px;
  border-radius: 4px;
  box-shadow: var(--sc-shadow-medium);
  transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out,
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    bottom 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: all;
  display: flex;
  align-items: center;
  z-index: 1000;
  max-width: 576px;
  ${(props) =>
    props.isVisible
      ? css`
          visibility: visible;
          opacity: 1;
          transform: translateX(-50%) translateY(0) scale(1);
        `
      : css`
          visibility: hidden;
          opacity: 0;
          transform: translateX(-50%) translateY(20px) scale(0.95);
        `}

  @media (max-width: 768px) {
    width: max-content;
  }
`

const IconContainer = styled.div`
  margin-right: 10px;
`

const ActionButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-left: 10px;
  font-size: 14px;
`

const StyledCheck = styled(Check)`
  path {
    fill: var(--sc-color-green-300);
  }
`

const StyledWarning = styled(Warning)`
  path {
    fill: var(--sc-color-white);
  }
`

/**
 * Toast component to display messages at the bottom of the view.
 * @param {string} message - The message to display in the toast.
 * @param {string} type - The type of the toast (e.g., 'success', 'caution', 'pending').
 * @param {string} [action] - The action label for the button (optional).
 * @param {Function} [onAction] - The function to call when the action button is clicked (optional).
 * @param {Function} onDismiss - The function to call when the toast is dismissed.
 * @param {number} [timeout] - The timeout in milliseconds for the toast to disappear (optional).
 * @param {number} index - The index of the toast to adjust its position.
 * @returns {JSX.Element|null} The rendered Toast component.
 */
const Toast: React.FC<ToastProps> = ({
  message,
  type,
  action,
  onAction,
  onDismiss,
  timeout,
  index,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const showTimeout = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    let fadeOutTimeout: NodeJS.Timeout | undefined
    if (timeout && !action) {
      fadeOutTimeout = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => {
          onDismiss()
        }, 200)
      }, timeout)
    }

    return () => {
      clearTimeout(showTimeout)
      clearTimeout(fadeOutTimeout)
    }
  }, [timeout, action, onDismiss])

  const handleActionClick = () => {
    if (onAction) onAction()
    setIsVisible(false)
    setTimeout(() => {
      onDismiss()
    }, 200)
  }

  const renderIcon = () => {
    switch (type) {
      case "success":
        return <StyledCheck />
      case "caution":
        return <StyledWarning />
      case "pending":
        return
      default:
        return null
    }
  }

  return (
    <ToastContainer
      isVisible={isVisible}
      style={{ bottom: `${20 + index * 60}px` }}
    >
      <IconContainer>{renderIcon()}</IconContainer>
      {message}
      {action && (
        <ActionButton onClick={handleActionClick}>{action}</ActionButton>
      )}
    </ToastContainer>
  )
}

interface ToastManagerProps {
  toasts: ToastProps[]
}

/**
 * Manages and renders active toasts.
 * @param {Array} toasts - The array of toasts to render.
 * @returns {JSX.Element} The rendered ToastManager component.
 */
const ToastManager: React.FC<ToastManagerProps> = ({ toasts }) => {
  return (
    <>
      {toasts.map((toast, index) => (
        <Toast key={toast.id} {...toast} index={index} />
      ))}
    </>
  )
}

export default ToastManager
