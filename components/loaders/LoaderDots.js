import React from "react"
import styled, { keyframes } from "styled-components"

const bounceDelay = keyframes`
    0%,100%,80% {
        -webkit-transform: scale(.6);
        transform: scale(.6)
    }

    40% {
        -webkit-transform: scale(1);
        transform: scale(1)
    }
`

const LoadingContent = styled.div`
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: rgba(177, 185, 191, 0.2);
  border-radius: 50%;
  width: 100px;
  height: 100px;
  font-size: 0;
  text-align: center;
`

const LoadingDots = styled.div`
  transform: translateY(-50%);
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
`

const LoadingDot = styled.div`
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  margin: 0 2px;
  width: 13px;
  height: 13px;
  animation: ${bounceDelay} 1.4s infinite ease-in-out both;

  &:nth-child(1) {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }

  &:nth-child(2) {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }
`

const LoaderDots = () => (
  <LoadingContent>
    <LoadingDots>
      <LoadingDot />
      <LoadingDot />
      <LoadingDot />
    </LoadingDots>
  </LoadingContent>
)

export default LoaderDots
