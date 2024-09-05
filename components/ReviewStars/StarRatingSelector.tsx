import React, { useState, useRef } from 'react'
import FilledStar from './FilledStar'
import EmptyStar from './EmptyStar'
import styled from 'styled-components'

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

interface StarRatingSelectorProps {
  rating: number
  setRating: (rating: number) => void
  className?: string
}

const StarRatingSelector: React.FC<StarRatingSelectorProps> = ({
  rating,
  setRating,
}) => {
  const [hoverRating, setHoverRating] = useState(0)
  const starRefs = useRef<(HTMLSpanElement | null)[]>([])

  const handleMouseEnter = (index: number) => {
    setHoverRating(index)
  }

  const handleMouseLeave = () => {
    setHoverRating(0)
  }

  const handleClick = (index: number) => {
    setRating(index)
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLSpanElement>,
    index: number
  ) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const newStar = index === 5 ? 1 : index + 1
      setRating(newStar)
      starRefs.current[newStar - 1]?.focus()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const newStar = index === 1 ? 5 : index - 1
      setRating(newStar)
      starRefs.current[newStar - 1]?.focus()
    }
  }

  const renderStar = (index: number) => {
    if (index <= (hoverRating || rating)) {
      return <FilledStar key={index} className="c-star" />
    }
    return <EmptyStar key={index} className="c-star" />
  }

  return (
    <StarContainer>
      {[...Array(5)].map((_, index) => {
        const starIndex = index + 1
        return (
          <button
            tabIndex={starIndex === 1 ? 0 : -1}
            ref={(el) => {
              starRefs.current[index] = el
            }}
            key={starIndex}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starIndex)}
            onKeyDown={(e) => handleKeyDown(e, starIndex)}
          >
            {renderStar(starIndex)}
          </button>
        )
      })}
    </StarContainer>
  )
}

export default StarRatingSelector
