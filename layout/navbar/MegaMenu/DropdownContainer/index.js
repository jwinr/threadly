import React, { Component, Children, createRef } from "react"
import PropTypes from "prop-types"
import { Flipped } from "react-flip-toolkit"
import styled, { keyframes } from "styled-components"
import { promoteLayer } from "./utils"
import FadeContents from "./FadeContents"

import Arrow from "@/public/images/icons/popoverArrow.svg"

const getDropdownRootKeyFrame = ({ animatingOut, direction }) => {
  if (!animatingOut && direction) return null
  return keyframes`
  from {
    transform: ${animatingOut ? "rotateX(0)" : "rotateX(-15deg)"};
    opacity: ${animatingOut ? 1 : 0};
  }
  to {
    transform: ${animatingOut ? "rotateX(-15deg)" : "rotateX(0)"};
    opacity: ${animatingOut ? 0 : 1};
  }
`
}

export const DropdownRoot = styled.div`
  transform-origin: 0 0;
  ${promoteLayer}
  animation-name: ${getDropdownRootKeyFrame};
  animation-duration: ${(props) => props.duration}ms;
  /* Use 'forwards' to prevent flicker on leave animation */
  animation-fill-mode: forwards;
  /* Flex styles will center the caret child component */
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  top: -20px;
`

export const DropdownBackground = styled.div`
  transform-origin: 0 0;
  background-color: var(--sc-color-white);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 0 1px #8898aa1a, 0 15px 35px #31315d1a, 0 5px 15px #00000014;
  ${promoteLayer};
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

const StyledArrow = styled(Arrow)`
  width: 21px;
  height: 9px;
  z-index: 1;
  position: relative;

  & path {
    color: var(--sc-color-white);
  }
`

const getFirstDropdownSectionHeight = (el) => {
  if (
    !el ||
    !el.querySelector ||
    !el.querySelector("*[data-first-dropdown-section]")
  )
    return 0
  return el.querySelector("*[data-first-dropdown-section]").offsetHeight
}

const updateAltBackground = ({
  altBackground,
  prevDropdown,
  currentDropdown,
}) => {
  const prevHeight = getFirstDropdownSectionHeight(prevDropdown)
  const currentHeight = getFirstDropdownSectionHeight(currentDropdown)

  const immediateSetTranslateY = (el, translateY) => {
    el.style.transform = `translateY(${translateY}px)`
    el.style.transition = "transform 0s"
    requestAnimationFrame(() => (el.style.transitionDuration = ""))
  }

  if (prevHeight) {
    // transition the grey ("alt") background from its previous height to its current height
    immediateSetTranslateY(altBackground, prevHeight)
    requestAnimationFrame(() => {
      altBackground.style.transform = `translateY(${currentHeight}px)`
    })
  } else {
    // just immediately set the background to the appropriate height
    // since we don't have a stored value
    immediateSetTranslateY(altBackground, currentHeight)
  }
}

class DropdownContainer extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    animatingOut: PropTypes.bool,
    direction: PropTypes.oneOf(["left", "right"]),
    duration: PropTypes.number,
  }

  currentDropdownEl = createRef()
  prevDropdownEl = createRef()

  componentDidMount() {
    updateAltBackground({
      altBackground: this.altBackgroundEl,
      prevDropdown: this.prevDropdownEl.current,
      currentDropdown: this.currentDropdownEl.current,
      duration: this.props.duration,
    })
  }

  render() {
    const { children, direction, animatingOut, duration } = this.props
    const [currentDropdown, prevDropdown] = Children.toArray(children)
    return (
      <DropdownRoot
        direction={direction}
        animatingOut={animatingOut}
        duration={duration}
      >
        <Flipped flipId="dropdown-caret">
          <StyledArrow />
        </Flipped>
        <Flipped flipId="dropdown">
          <DropdownBackground>
            <Flipped inverseFlipId="dropdown">
              <InvertedDiv>
                <AltBackground
                  ref={(el) => (this.altBackgroundEl = el)}
                  duration={duration}
                />
                <FadeContents
                  direction={direction}
                  duration={duration}
                  ref={this.currentDropdownEl}
                >
                  {currentDropdown}
                </FadeContents>
              </InvertedDiv>
            </Flipped>

            <Flipped inverseFlipId="dropdown" scale>
              <InvertedDiv absolute>
                {prevDropdown && (
                  <FadeContents
                    animatingOut
                    direction={direction}
                    duration={duration}
                    ref={this.prevDropdownEl}
                  >
                    {prevDropdown}
                  </FadeContents>
                )}
              </InvertedDiv>
            </Flipped>
          </DropdownBackground>
        </Flipped>
      </DropdownRoot>
    )
  }
}

export default DropdownContainer
