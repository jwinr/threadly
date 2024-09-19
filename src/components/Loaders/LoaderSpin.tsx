import React from 'react'
import styled, { keyframes } from 'styled-components'
import PropFilter from 'src/utils/PropFilter'

const spin = keyframes`
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
`

const spinner = keyframes`
  0% {
    stroke-dashoffset: 138.23007675795088;
  }
  100% {
    stroke-dashoffset: 0;
  }
`

interface LoaderSpinnerProps {
  isLoading: boolean
}

const LoaderSpinner = styled(
  PropFilter('div')(['isLoading'])
)<LoaderSpinnerProps>`
  position: absolute;
  justify-content: center;
  align-items: center;
  opacity: ${({ isLoading }) => (isLoading ? 1 : 0)};
  display: ${({ isLoading }) => (isLoading ? 'flex' : 'none')};
  transition: opacity 0.3s ease-in-out;

  & > div {
    width: 16px;
    height: 16px;
    border-radius: 50%;

    & svg {
      animation: ${spin} 1750ms linear 0s infinite normal none running;
    }

    & circle {
      fill: transparent;
      transform: rotate(-120deg);
      transform-origin: 50% 50%;
      stroke-linecap: round;
      animation: 1750ms linear 0s infinite normal none running ${spinner};
    }
  }
`

const InnerDiv = styled.div`
  --ofset: 138.23007675795088;
  width: 18px;
  height: 18px;
`

interface LoaderSpinProps {
  isLoading: boolean
}

const LoaderSpin: React.FC<LoaderSpinProps> = ({ isLoading }) => (
  <LoaderSpinner isLoading={isLoading}>
    <InnerDiv>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" x="0" y="0">
        <circle
          cx="12"
          cy="12"
          r="11"
          strokeDasharray="69.11503837897544"
          strokeDashoffset="138.23007675795088"
          strokeWidth="2"
          stroke="currentcolor"
        ></circle>
      </svg>
      <slot></slot>
    </InnerDiv>
  </LoaderSpinner>
)

export default LoaderSpin
