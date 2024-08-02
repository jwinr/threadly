import React from "react"

import styled, { css } from "styled-components"

import Info from "@/public/images/icons/info.svg"
import Warning from "@/public/images/icons/warning.svg"
import Close from "@/public/images/icons/cancel.svg"

interface BannerProps {
  type?: "default" | "caution" | "critical"
  onDismiss?: () => void
  title: string
  description?: string
  actions?: React.ReactNode
}

const BannerWrapper = styled.div<{ type: "default" | "caution" | "critical" }>`
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 6px;
  margin: 16px 0;
  gap: 12px;
  z-index: 100;
  ${(props) => {
    switch (props.type) {
      case "caution":
        return css`
          background-color: #fdf8c9;
          color: #b13600;
          border: 1px solid #fbd992;
        `
      case "critical":
        return css`
          background-color: #fef4f6;
          color: #c0123c;
          border: 1px solid #fbd3dc;
        `
      case "default":
      default:
        return css`
          background-color: #ffffff;
          color: #353a44;
          border: 1px solid #d8dee4;
        `
    }
  }}
`

const IconWrapper = styled.div<{ type: string }>`
  display: flex;
  align-items: center;
  align-self: flex-start;

  svg {
    margin-top: 6px;
    width: 12px;
    height: 12px;

    path {
      ${(props) => {
        switch (props.type) {
          case "caution":
            return css`
              fill: #b13600;
            `
          case "critical":
            return css`
              fill: #c0123c;
            `
          case "default":
          default:
            return css`
              fill: #353a44;
            `
        }
      }}
    }
  }
`

const ContentWrapper = styled.div`
  flex: 1;
`

const Title = styled.span`
  margin: 0;
  font-weight: 700;
  font-size: 16px;
`

const Description = styled.p`
  font-size: 14px;
  margin: 4px 0 0 0;
`

const ActionsWrapper = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
`

const DismissButton = styled.button`
  align-self: flex-start;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1em;
  margin-left: auto;
  box-shadow: none;
`

/**
 * Displays a message with an optional icon, description, and actions.
 * It can be of type "default", "caution", or "critical".
 *
 * @param {BannerProps} props - The properties for the Banner component.
 * @param {"default" | "caution" | "critical"} [props.type="default"] - The type of the banner.
 * @param {() => void} [props.onDismiss] - The function to call when the banner is dismissed.
 * @param {string} props.title - The title of the banner.
 * @param {string} [props.description] - The description of the banner.
 * @param {React.ReactNode} [props.actions] - The actions to display in the banner.
 * @returns {JSX.Element} The Banner component.
 */
const Banner: React.FC<BannerProps> = ({
  type = "default",
  onDismiss,
  title,
  description,
  actions,
}) => {
  return (
    <BannerWrapper type={type}>
      <IconWrapper type={type}>
        {type === "caution" && <Warning />}
        {type === "critical" && <Warning />}
        {type === "default" && <Info />}
      </IconWrapper>
      <ContentWrapper>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        {actions && <ActionsWrapper>{actions}</ActionsWrapper>}
      </ContentWrapper>
      {type !== "critical" && onDismiss && (
        <DismissButton onClick={onDismiss}>
          <Close />
        </DismissButton>
      )}
    </BannerWrapper>
  )
}

export default Banner
