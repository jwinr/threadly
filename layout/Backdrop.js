import React from "react"
import styled from "styled-components"

const e = React.createElement

const Backdrop = styled(({ isOpen, ...props }) => e("div", props))`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -200;
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;

  &.visible {
    opacity: 1;
    visibility: visible;
    transition: opacity 0.3s ease;
  }

  &.initial-hidden {
    opacity: 0;
    visibility: hidden;
    transition: none;
  }
`

export default Backdrop
