import styled, { keyframes } from "styled-components"
import { promoteLayer } from "./utils"

const getDropdownRootKeyFrame = ({ animatingOut, direction }) => {
  if (!animatingOut && direction) return null
  return keyframes`
  from {
    transform: ${animatingOut ? "rotateX(0)" : "rotateX(-10deg)"};
    opacity: ${animatingOut ? 1 : 0};
  }
  to {
    transform: ${animatingOut ? "rotateX(-10deg)" : "rotateX(0)"};
    opacity: ${animatingOut ? 0 : 1};
  }
`
}

export const DropdownRoot = styled.div`
  transform-origin: 0 0;
  ${promoteLayer}
  animation-name: ${getDropdownRootKeyFrame};
  animation-duration: ${(props) => props.duration}ms;
  /* use 'forwards' to prevent flicker on leave animation */
  animation-fill-mode: forwards;
  /* flex styles will center the caret child component */
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  top: -20px;
`

export const DropdownBackground = styled.div`
  transform-origin: 0 0;
  background-color: var(--sc-color-white);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 0 1px #8898aa1a, 0 15px 35px #31315d1a, 0 5px 15px #00000014;
  ${promoteLayer}
`

export const AltBackground = styled.div`
  background-color: var(--sc-color-white);
  width: 300%;
  height: 100%;
  position: absolute;
  top: 0;
  left: -100%;
  transform-origin: 0 0;
  z-index: 0;
  transition: transform ${(props) => props.duration}ms;
`

export const InvertedDiv = styled.div`
  ${promoteLayer}
  position: ${(props) => (props.absolute ? "absolute" : "relative")};
  top: 0;
  left: 0;
  &:first-of-type {
    z-index: 1;
  }
  &:not(:first-of-type) {
    z-index: -1;
  }
`
