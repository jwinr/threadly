import React, { useState, useEffect, useRef } from "react"
import FilledStar from "./FilledStar"
import EmptyStar from "./EmptyStar"
import styled from "styled-components"

const StarContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 5px 0 10px 0;

  .c-star {
    width: var(--size, 33px);
    height: var(--size, 32px);
  }
`

const StarRatingSelector = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0)
  const starRefs = useRef([])

  const handleMouseEnter = (index) => {
    setHoverRating(index)
  }

  const handleMouseLeave = () => {
    setHoverRating(0)
  }

  const handleClick = (index) => {
    setRating(index)
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      const newStar = index === 5 ? 1 : index + 1
      setRating(newStar)
      starRefs.current[newStar - 1].focus()
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      const newStar = index === 1 ? 5 : index - 1
      setRating(newStar)
      starRefs.current[newStar - 1].focus()
    }
  }

  const renderStar = (index) => {
    if (index <= (hoverRating || rating)) {
      return <FilledStar key={index} className="star" />
    }
    return <EmptyStar key={index} className="star" />
  }

  return (
    <StarContainer>
      {[...Array(5)].map((_, index) => {
        const starIndex = index + 1
        return (
          <span
            tabIndex={starIndex === 1 ? 0 : -1}
            ref={(el) => (starRefs.current[index] = el)}
            key={starIndex}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starIndex)}
            onKeyDown={(e) => handleKeyDown(e, starIndex)}
          >
            {renderStar(starIndex)}
          </span>
        )
      })}
    </StarContainer>
  )
}

export default StarRatingSelector
