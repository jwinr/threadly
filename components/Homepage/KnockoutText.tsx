import React, { useRef } from 'react'
import styled, { keyframes } from 'styled-components'

const fadeInMask = keyframes`
  0% {
    mask-position: -20%;
  }
  100% {
    mask-position: 20% center;
  }
`

const shineAnimation = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`

const KnockoutTextWrapper = styled.span`
  position: relative;
  display: inline-block;
  width: min-content;
  mask-size: 1000%;
  mask-image: linear-gradient(
    45deg,
    transparent,
    #000 20%,
    #000 60%,
    transparent 80%
  );
  animation: ${fadeInMask} 1.25s 0.25s ease-out forwards;
  mask-position: 100% center;

  .shadow {
    font-size: 76px;
    line-height: 1.04;
    letter-spacing: -0.03em;
    position: absolute;
    top: 0;
    left: 0;
    color: transparent;
    text-shadow: 2px 4px 6px rgba(0, 0, 0, 0.75);
    -webkit-text-fill-color: transparent;
    z-index: 1;
  }

  .foreground {
    font-size: 76px;
    line-height: 1.04;
    letter-spacing: -0.03em;
    position: relative;
    mask-position: -20%;
    background: linear-gradient(
      90deg,
      #f86251 20%,
      #ff8c71 40%,
      #ffb380 60%,
      #e06f6f 80%,
      #f86251 100%
    );
    background-size: 200% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    display: inline-block;
    overflow: hidden;
    z-index: 2;
    animation: ${shineAnimation} 10s infinite linear;
    transition: mask-position 1s ease-out;
  }
`

interface KnockoutTextProps {
  text: string
}

const KnockoutText: React.FC<KnockoutTextProps> = ({ text }) => {
  const textRef = useRef<HTMLSpanElement>(null)

  return (
    <KnockoutTextWrapper ref={textRef}>
      <span className="shadow">{text}</span>
      <span className="foreground">{text}</span>
    </KnockoutTextWrapper>
  )
}

export default KnockoutText
