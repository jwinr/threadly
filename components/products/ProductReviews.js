import React, { useContext, useState } from "react"
import { useRouter } from "next/navigation"
import styled from "styled-components"
import VoteButton from "./VoteButton"
import StarRating from "../ReviewStars/StarRatings"
import { UserContext } from "@/context/UserContext"

const Container = styled.div`
  text-align: center;

  h3 {
    font-size: 19px;
    margin-bottom: 25px;
    color: #000;
  }

  p {
    font-size: 14px;
  }
`

const ReviewContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const ReviewWrapper = styled.li`
  border: 1px solid var(--sc-color-divider);
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-end;
`

const ReviewContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const ReviewTitle = styled.div`
  text-align: left;
  font-size: 19px;
  font-weight: bold;
  margin-bottom: 5px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const ReviewUser = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-top: 10px;
`

const ReviewText = styled.div`
  font-size: 14px;
  margin: 10px 0;
  text-align: left;
  width: 75%;
`

const VoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;

  span {
    font-size: 12px;
  }
`

const VoteBtnContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
`

const WriteReviewButton = styled.button`
  margin-top: 20px;
  padding: 0px 8px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 4px;
  background-color: var(--sc-color-carnation);
  height: 32px;
  color: var(--sc-color-white);
  border: none;
  cursor: pointer;
`

const NoReviews = styled.div`
  display: flex;
  justify-content: center;
`

const ProductReviews = ({ reviews: initialReviews, productId }) => {
  const { userAttributes } = useContext(UserContext)
  const router = useRouter()
  const [reviews, setReviews] = useState(initialReviews)

  const handleVote = async (reviewId, type) => {
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({
          reviewId,
          voteType: type,
          cognitoSub: userAttributes.sub,
        }),
      })

      const data = await response.json()
      // console.log("Response data:", data)

      if (response.ok) {
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.review_id === reviewId
              ? { ...review, ...data.updatedReview }
              : review
          )
        )
      } else {
        console.error("Failed to record vote:", data.error)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleWriteReviewClick = () => {
    router.push(`/products/${productId}/add-review`)
  }

  return (
    <Container>
      {!reviews || reviews.length === 0 ? (
        <NoReviews>No reviews available for this product.</NoReviews>
      ) : (
        <ReviewContainer>
          {reviews.map((review, index) => (
            <ReviewWrapper key={index}>
              <ReviewContent>
                <ReviewTitle>{review.title}</ReviewTitle>
                <StarRating rating={review.rating} />
                <ReviewUser>
                  <span>
                    {review.first_name} {review.last_initial} -{" "}
                    {new Date(review.review_date).toLocaleDateString()}
                  </span>
                </ReviewUser>
                <ReviewText>{review.text}</ReviewText>
              </ReviewContent>
              <VoteContainer>
                <span>Did you find this review helpful?</span>
                <VoteBtnContainer>
                  <VoteButton
                    reviewId={review.review_id}
                    count={review.upvotes}
                    type="upvote"
                    handleVote={handleVote}
                    voteType={review.voteType}
                    disabled={review.voteType === "upvote"}
                  />
                  <VoteButton
                    reviewId={review.review_id}
                    count={review.downvotes}
                    type="downvote"
                    handleVote={handleVote}
                    voteType={review.voteType}
                    disabled={review.voteType === "downvote"}
                  />
                </VoteBtnContainer>
              </VoteContainer>
            </ReviewWrapper>
          ))}
        </ReviewContainer>
      )}

      {userAttributes && (
        <WriteReviewButton onClick={handleWriteReviewClick}>
          Write a review
        </WriteReviewButton>
      )}
    </Container>
  )
}

export default ProductReviews
