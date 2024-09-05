import React from 'react'
import FilledStar from './FilledStar'
import HalfFilledStar from './HalfFilledStar'
import EmptyStar from './EmptyStar'
import { Review } from '@/app/types/product'

interface StarRatingsProps {
  reviews: Review[] | number[] | number[][] | number
}

const StarRatings: React.FC<StarRatingsProps> = ({ reviews }) => {
  // Calculate the average rating
  const averageRating = calculateAverageRating(reviews)

  // Determine if reviews is an array
  const isReviewsArray = Array.isArray(reviews)
  const hasReviews = isReviewsArray && reviews.length > 0
  const reviewCountText =
    hasReviews && reviews.length === 1 ? 'review' : 'reviews'

  // Calculate the number of filled and half-filled stars for the average rating
  const totalStars = 5
  const filledStars = Math.floor(averageRating)
  const hasHalfStar = averageRating - filledStars >= 0.5

  return (
    <div className="star-rating">
      {hasReviews ? (
        <span>
          Average Rating: {averageRating.toFixed(1)} stars out of 5, with{' '}
          {reviews.length} {reviewCountText}
        </span>
      ) : (
        <span>This product doesn't have any reviews</span>
      )}
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

function calculateAverageRating(
  reviews: Review[] | number[] | number[][] | number
): number {
  // Handle single number review case
  if (typeof reviews === 'number') {
    return reviews
  }

  // Handle when no reviews exist
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return 0
  }

  // Handle case when reviews are an array of `Review` objects
  if (typeof reviews[0] === 'object' && 'rating' in reviews[0]) {
    const totalRating = (reviews as Review[]).reduce(
      (sum, review) => sum + review.rating,
      0
    )
    return totalRating / reviews.length
  }

  // Handle case when reviews are an array of arrays of numbers
  if (Array.isArray(reviews[0])) {
    const totalRatings = (reviews as number[][]).reduce(
      (outerSum, ratingsArray) => {
        const sumRatings = ratingsArray.reduce(
          (innerSum, rating) => innerSum + rating,
          0
        )
        return outerSum + sumRatings
      },
      0
    )
    const totalEntries = (reviews as number[][]).reduce(
      (count, ratingsArray) => count + ratingsArray.length,
      0
    )
    return totalRatings / totalEntries
  }

  // Handle case when reviews are a single array of numbers
  const totalRating = (reviews as number[]).reduce(
    (sum, rating) => sum + rating,
    0
  )
  return totalRating / reviews.length
}

export default StarRatings
