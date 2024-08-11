import React, { forwardRef, useRef } from "react"
import PropTypes from "prop-types"
import styled, { keyframes } from "styled-components"
import { CSSTransition } from "react-transition-group"
import { promoteLayer } from "./utils"

const getFadeContainerKeyFrame = ({ animatingOut, direction, reverse }) => {
  const translateIn = reverse
    ? direction === "right"
      ? "100px"
      : "-100px"
    : "0"
  const translateOut = direction === "right" ? "-100px" : "100px"

  return keyframes`
    from {
      transform: translateX(${animatingOut ? "0" : translateIn});
      opacity: ${animatingOut ? 1 : 0};
    }
    to {
      transform: translateX(${animatingOut ? translateOut : "0"});
      opacity: ${animatingOut ? 0 : 1};
    }
  `
}

const FadeContainer = styled.div`
  ${promoteLayer}
  animation-name: ${(props) => getFadeContainerKeyFrame(props)};
  animation-duration: ${(props) => props.duration}ms;
  animation-fill-mode: forwards;
  opacity: ${(props) => (props.direction && !props.animatingOut ? 0.9 : 1)};
  transform: translateX(
    ${(props) =>
      props.reverse ? (props.direction === "right" ? "-10px" : "10px") : "0"}
  );
  top: 0;
  left: 0;

  &.fade-enter {
    transform: translateX(100px);
    opacity: 0;
  }
  &.fade-enter-active {
    transform: translateX(0);
    opacity: 1;
    transition: opacity ${(props) => props.duration}ms ease-in-out,
      transform ${(props) => props.duration}ms ease-in-out;
  }
  &.fade-exit {
    transform: translateX(0);
    opacity: 1;
  }
  &.fade-exit-active {
    transform: translateX(-100px);
    opacity: 0;
    transition: opacity ${(props) => props.duration}ms ease-in-out,
      transform ${(props) => props.duration}ms ease-in-out;
  }
`

const propTypes = {
  duration: PropTypes.number,
  direction: PropTypes.oneOf(["right", "left"]),
  animatingOut: PropTypes.bool,
  children: PropTypes.node,
}

const FadeContents = forwardRef(
  ({ children, duration, animatingOut, direction }, ref) => {
    const nodeRef = useRef(null)

    return (
      <CSSTransition
        in={!animatingOut}
        timeout={duration}
        classNames="fade"
        nodeRef={nodeRef}
      >
        <FadeContainer
          aria-hidden={animatingOut}
          animatingOut={animatingOut}
          direction={direction}
          duration={duration}
          ref={nodeRef}
          reverse
        >
          {children}
        </FadeContainer>
      </CSSTransition>
    )
  }
)

FadeContents.propTypes = propTypes

export default FadeContents
