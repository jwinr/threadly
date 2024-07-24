import React from "react"
import styled, { keyframes, css } from "styled-components"

const ToolLabelContainer = styled.div`
  position: absolute;
  padding: 4px 8px;
  background-color: var(--sc-color-gray-700);
  border-radius: 4px;
  color: white;
  overflow: hidden;
  box-shadow: 0 0 0 1px #8898aa1a, 0 15px 35px #31315d1a, 0 5px 15px #00000014;
  width: max-content;
  font-size: 14px;
  z-index: 100;
  opacity: 0;
  transform: scale(0.85);
  transition: opacity 0.25s cubic-bezier(0, 1, 0.4, 1),
    transform 0.25s cubic-bezier(0.18, 1.25, 0.4, 1);

  ${({ animate }) =>
    animate &&
    css`
      opacity: 1;
      transform: scale(1);
    `}

  ${({ exited }) =>
    exited &&
    css`
      opacity: 0;
      transform: scale(0.85);
    `}
`

const TooltipLabel = ({ style, label, animate, exited }) => {
  return (
    <ToolLabelContainer style={style} animate={animate} exited={exited}>
      {label}
    </ToolLabelContainer>
  )
}

export default TooltipLabel
