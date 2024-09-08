import React, { MouseEvent } from 'react'
import styled, { css } from 'styled-components'

const sizes = {
  small: '24px',
  medium: '28px',
  large: '40px',
}

const types = {
  primary: css`
    background-color: #f86251;
    color: white;
    --s1-keyline: #f44c3a;

    &:hover:not(:active) {
      --s1-keyline: #f44c3a;
      border-color: #f86251;
      color: white;
    }

    &:active {
      border-color: #da3c2b;
      background-color: #ea4836;
      color: #ffd7d0;
      --s1-keyline: #da3c2b;
      --s1-top-shadow: 0px -1px 1px 0px rgba(16, 17, 26, 0.16);
    }
  `,
  secondary: css`
    background-color: #ffffff;
    color: #353a44;
    border-color: #d8dee4;

    &:hover:not(:active) {
      --s1-keyline: #99a5b8;
      border-color: #99a5b8;
      color: #353a44;
    }

    &:active {
      border-color: #d8dee4;
      background-color: #f5f6f8;
      color: #474e5a;
      --s1-keyline: #d8dee4;
      --s1-top-shadow: 0px -1px 1px 0px rgba(16, 17, 26, 0.16);
    }
  `,
  destructive: css`
    background-color: #e61947;
    color: white;
    border-color: #e61947;
    --s1-top-shadow: 0px 1px 1px 0px rgba(62, 2, 26, 0.32);
    --s1-keyline: #e61947;

    &:hover:not(:active) {
      --s1-keyline: #9b0c36;
      border-color: #9b0c36;
      color: white;
    }

    &:active {
      border-color: #9b0c36;
      background-color: #c0123c;
      color: #fbd3dc;
      --s1-keyline: #9b0c36;
      --s1-top-shadow: 0px -1px 1px 0px rgba(62, 2, 26, 0.32);
    }
  `,
}

const DisabledOverlay = styled.div`
  top: -1px;
  bottom: -1px;
  left: -1px;
  right: -1px;
  z-index: 10;
  opacity: 0.5;
  transition: opacity 240ms;
  position: absolute;
  background-color: var(--sc-color-white);
`

const ButtonWrapper = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  font-weight: 600;
  position: relative;
  gap: 6px;
  padding: var(--s1-padding-top) var(--s1-padding-right)
    var(--s1-padding-bottom) var(--s1-padding-left);
  box-shadow:
    var(--s1-top-shadow),
    var(--s1-keyline) 0 0 0 var(--s1-keyline-width),
    var(--s1-focus-ring),
    var(--s1-box-shadow);
  min-height: 28px;
  user-select: none;
  transition-property: background-color, box-shadow;
  transition-timing-function: cubic-bezier(0, 0.09, 0.4, 1);
  transition-duration: 150ms;
  height: ${(props) => sizes[props.size!]};
  font-size: ${(props) =>
    props.size === 'small' ? '12px' : props.size === 'large' ? '16px' : '14px'};
  border-radius: 6px;
  --s1-focus-ring: 0 0 0 0 transparent;
  outline: none;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  ${(props) => props.type && types[props.type]};
  ${(props) => props.disabled && 'pointer-events: none;'};
  ${(props) =>
    props.href &&
    css`
      text-decoration: none;
    `}

  &:hover {
    transition-duration: 0ms;
  }

  &:focus-visible,
  :focus {
    --s1-focus-ring: 0 0 0 4px rgba(1, 150, 237, 0.36);
    outline: 1px solid transparent;
  }
`

interface ButtonProps {
  children: React.ReactNode
  disabled?: boolean
  href?: string
  onPress?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  size?: 'small' | 'medium' | 'large'
  target?: '_self' | '_blank' | '_top' | '_parent'
  type?: 'primary' | 'secondary' | 'destructive'
}

/**
 * Button component for triggering actions or navigating to links.
 *
 * @param {Object} props - The props for the component.
 * @param {React.ReactNode} props.children - The content of the button.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {string} [props.href] - The URL the button should link to. If provided, the button renders as an <a> tag.
 * @param {function} [props.onPress] - The handler for the button's onClick event.
 * @param {'small'|'medium'|'large'} [props.size='medium'] - The size of the button.
 * @param {'_self'|'_blank'|'_top'|'_parent'} [props.target='_self'] - The target for the link if href is provided.
 * @param {'primary'|'secondary'|'destructive'} [props.type='secondary'] - The type of the button, affecting its styling.
 */
const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  href,
  onPress,
  size = 'medium',
  target = '_self',
  type = 'secondary',
}) => {
  if (href) {
    return (
      <ButtonWrapper
        as="a"
        href={href}
        target={target}
        size={size}
        type={type}
        disabled={disabled}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault()
          } else if (onPress) {
            onPress(e)
          }
        }}
      >
        {children}
        {disabled && <DisabledOverlay />}
      </ButtonWrapper>
    )
  }

  return (
    <ButtonWrapper
      size={size}
      type={type}
      disabled={disabled}
      aria-disabled={disabled}
      onClick={(e) => {
        if (!disabled && onPress) {
          onPress(e)
        }
      }}
    >
      {children}
      {disabled && <DisabledOverlay />}
    </ButtonWrapper>
  )
}

export default Button
