import React from "react"
import FilledStar from "./FilledStar"
import HalfFilledStar from "./HalfFilledStar"
import EmptyStar from "./EmptyStar"

const StarRating = ({ reviews }) => {
  // Calculate the average rating
  const averageRating = calculateAverageRating(reviews)
  const isReviewsArray = Array.isArray(reviews)
  const hasReviews = isReviewsArray && reviews.length > 0
  const reviewCountText =
    hasReviews && reviews.length === 1 ? "review" : "reviews"

  // Calculate the number of filled and half-filled stars for the average rating
  const totalStars = 5
  const filledStars = Math.floor(averageRating)
  const hasHalfStar = averageRating - filledStars >= 0.5

  return (
    <div className="star-rating">
      <span>
        {hasReviews
          ? `Average Rating: ${averageRating} stars out of 5, with ${reviews.length} ${reviewCountText}`
          : "This product doesn't have any reviews"}
      </span>
      {[...Array(totalStars)].map((_, i) => {
        if (i < filledStars) {
          // Filled star
          return <FilledStar key={i} />
        } else if (i === filledStars && hasHalfStar) {
          // Half-filled star
          return (
            <HalfFilledStar
              key={i}
              className="c-star"
              fractionalPart={averageRating - filledStars}
            />
          )
        } else {
          // Empty star
          return <EmptyStar key={i} />
        }
      })}
      {hasReviews && (
        <span className="average-rating-text">{averageRating.toFixed(1)}</span>
      )}
    </div>
  )
}

function calculateAverageRating(reviews) {
  if (!Array.isArray(reviews)) {
    if (typeof reviews === "number") {
      // Handle the scenario when a single rating (number) is received
      return reviews
    } else {
      return 0 // Return 0 for non-array and non-number data
    }
  }

  if (reviews.length === 0) {
    return 0 // Return 0 for empty array
  }

  if (typeof reviews[0] === "object" && "rating" in reviews[0]) {
    // Ratings are in an array of objects format
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviews.length
    return averageRating
  } else if (Array.isArray(reviews[0])) {
    // Ratings are in an array format
    const totalRating = reviews.reduce((sum, ratingsArray) => {
      const sumRatings = ratingsArray.reduce(
        (innerSum, rating) => innerSum + rating,
        0
      )
      return sum + sumRatings
    }, 0)

    // Calculate the average rating for arrays
    const averageRating = totalRating / (reviews.length * reviews[0].length)
    return averageRating
  } else {
    // Ratings are treated as a single array or an unknown format
    const totalRating = reviews.reduce((sum, rating) => sum + rating, 0)
    const averageRating = totalRating / reviews.length
    return averageRating
  }
}

export default StarRating
