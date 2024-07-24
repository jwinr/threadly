import React from "react"

function HalfFilledStar({ fractionalPart }) {
  const clipWidth = 34 * fractionalPart // Calculate the width of the clip path based on the fractional part

  return (
    <>
      <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
        <symbol id="star" viewBox="0 0 32 32">
          <path d="M31.547 12a.848.848 0 0 0-.677-.577l-9.427-1.376-4.224-8.532a.847.847 0 0 0-1.516 0l-4.218 8.534-9.427 1.355a.847.847 0 0 0-.467 1.467l6.823 6.664-1.612 9.375a.847.847 0 0 0 1.23.893l8.428-4.434 8.432 4.432a.847.847 0 0 0 1.229-.894l-1.615-9.373 6.822-6.665a.845.845 0 0 0 .214-.869z" />
        </symbol>
      </svg>
      <svg
        className="c-star-h active"
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <defs>
          <mask id="half-mask">
            <rect x="0" y="-2" width="34" height="34" fill="white" />
          </mask>
          <clipPath id="half-clip">
            <rect x="0" y="0" width={clipWidth} height="32" />
          </clipPath>
        </defs>
        {/* Filled star */}
        <use xlinkHref="#star" mask="url(#half-mask)" fill="#fed94b" />
        {/* Outline */}
        <use
          xlinkHref="#star"
          fill="none"
          clipPath="url(#half-clip)"
          stroke="DarkGoldenRod"
          strokeWidth="2"
        />
      </svg>
    </>
  )
}

export default HalfFilledStar
