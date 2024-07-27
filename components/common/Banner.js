import React from "react"
import styled, { css } from "styled-components"
import { TiWarningOutline } from "react-icons/ti"
import { PiWarningCircleBold } from "react-icons/pi"
import { VscClose } from "react-icons/vsc"

const BannerWrapper = styled.div`
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

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-start;

  svg {
    padding: 4px;
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

const Banner = ({
  type = "default",
  onDismiss,
  title,
  description,
  actions,
}) => {
  return (
    <BannerWrapper type={type}>
      <IconWrapper>
        {type === "caution" && <TiWarningOutline size={24} />}
        {type === "critical" && <TiWarningOutline size={24} />}
        {type === "default" && <PiWarningCircleBold size={24} />}
      </IconWrapper>
      <ContentWrapper>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        {actions && <ActionsWrapper>{actions}</ActionsWrapper>}
      </ContentWrapper>
      {type !== "critical" && onDismiss && (
        <DismissButton onClick={onDismiss}>
          <VscClose size={20} />
        </DismissButton>
      )}
    </BannerWrapper>
  )
}

export default Banner
