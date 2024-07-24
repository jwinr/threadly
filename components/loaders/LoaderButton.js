import React from "react"
import styled, { keyframes } from "styled-components"

const ellipsisOne = keyframes`
  0% {
    left: -14px;
    transform: scale(0);
  }

  25% {
    left: 14px;
    transform: scale(1);
  }

  50% {
    left: 50px;
  }

  75% {
    left: 86px;
    transform: scale(1);
  }

  100% {
    left: 100px;
    transform: scale(0);
  }
`

const LoadingDots = styled.div`
  position: relative;
  width: 100px;
  height: 14px;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%) scale(0.5); // The scale can be changed to increase/decrease the size of the dots

  > div {
    position: absolute;
    width: 14px;
    height: 14px;
    transform: translate(-50%, -50%);

    > div {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      position: absolute;
      left: 14px;
      animation: ${ellipsisOne} 1.6s cubic-bezier(0, 0.5, 0.5, 1) infinite
        forwards;
    }

    &:nth-child(1) > div {
      animation-delay: -1.6s;
      background: #ffffff;
    }
    &:nth-child(2) > div {
      animation-delay: -1.2s;
      background: #ffffff;
    }
    &:nth-child(3) > div {
      animation-delay: -0.8s;
      background: #ffffff;
    }
    &:nth-child(4) > div {
      animation-delay: -0.4s;
      background: #ffffff;
    }
    &:nth-child(5) > div {
      animation-delay: 0s;
      background: #ffffff;
    }
  }
`

const LoaderButton = () => (
  <LoadingDots>
    <div>
      <div></div>
    </div>
    <div>
      <div></div>
    </div>
    <div>
      <div></div>
    </div>
    <div>
      <div></div>
    </div>
    <div>
      <div></div>
    </div>
  </LoadingDots>
)

export default LoaderButton
