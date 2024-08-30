import React, { useContext, useState, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import styled from "styled-components"
import { UserContext } from "@/context/UserContext"
import LoaderDots from "@/components/Loaders/LoaderDots"
import StarRatingSelector from "@/components/ReviewStars/StarRatingSelector"

const Container = styled.div`
  padding: 20px;

  h3 {
    font-size: 29px;
    margin-bottom: 10px;
  }

  h2 {
    font-size: 23px;
  }

  p {
    font-size: 14px;
  }
`

const ReviewForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 55%;

  @media (max-width: 768px) {
    width: auto;
  }

  input,
  textarea {
    width: 100%;
    padding: 10px;
    font-size: 14px;
  }

  textarea {
    height: 150px;
  }
`

const ErrorMessage = styled.span`
  color: var(--sc-color-red-dark);
  font-size: 14px;
`

const ProductDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`

const ProductImage = styled(Link)`
  width: 100%;
  height: 450px;
  display: flex;
  align-items: center;

  @media (min-width: 768px) {
    width: 33.33%;
  }

  @media (max-width: 768px) {
    height: 325px;
  }

  img {
    width: 100%;
    height: auto;
  }
`

const ProductInfo = styled.div`
  flex: 1;

  .product-info {
    h4 {
      font-size: 29px;
      font-weight: normal;
      margin-bottom: 10px;
    }

    p {
      font-size: 14px;
      color: #555;
    }
  }
`

export const EntryWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
  margin: 5px 0;
`

export const EntryContainer = styled.input`
  border: 1px solid var(--sc-color-border-gray);
  border-radius: 0.25rem;
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  color: var(--sc-color-text);
  padding-right: 40px;
  transition: border-color 0.3s;
  resize: none;

  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: 0px;
    left: 10px;
    font-size: 12px;
    color: var(--sc-color-text);
  }
`

export const Label = styled.label`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: var(--sc-color-text);
  background-color: var(--sc-color-white);
  font-size: 16px;
  pointer-events: none;
  transition: all 0.3s ease;

  ${EntryContainer}:focus + &,
  ${EntryContainer}:not(:placeholder-shown) + & {
    // Properly offset the label on the description field (textarea)
    top: 0px;
    left: 10px;
    font-size: 12px;
    color: var(--sc-color-text);
  }

  ${EntryWrapper} textarea + & {
    top: 10%;
  }
`

const SubmitBtn = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0px 12px;
  border: none;
  border-radius: 4px;
  background-color: var(--sc-color-blue);
  color: var(--sc-color-white);
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  justify-content: space-evenly;
  overflow: hidden;
  height: 44px;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--sc-color-dark-blue);
  }

  &:focus-visible {
    background-color: var(--sc-color-dark-blue);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`

export const ValidationMessage = styled.div`
  color: var(--sc-color-red-dark);
  font-size: 12px;
  align-self: flex-start;
  margin-bottom: 10px;
`

const ButtonWrapper = styled.div`
  display: flex;
  gap: 75px;
  margin-top: 35px;
`

const AddReview = () => {
  const { userAttributes } = useContext(UserContext)
  const router = useRouter()
  const { slug } = router.query
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(0)
  const [error, setError] = useState("")
  const [product, setProduct] = useState(null)
  const [titleValid, setTitleValid] = useState(true)
  const [descriptionValid, setDescriptionValid] = useState(true)
  const [titleErrorMessage, setTitleErrorMessage] = useState("")
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("")
  const [ratingError, setRatingError] = useState("")
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false)

  const titleRef = useRef(null)
  const descriptionRef = useRef(null)

  const validateTitle = (title) => {
    const regex = /^[a-zA-Z0-9\s!@#$%^&*(),.?":{}|<>]+$/
    if (title.length < 5) {
      setTitleErrorMessage("Title must be at least 5 characters long.")
      return false
    } else if (title.length > 75) {
      setTitleErrorMessage("Title must be no more than 75 characters long.")
      return false
    } else if (!regex.test(title)) {
      setTitleErrorMessage("Title contains invalid characters.")
      return false
    }
    return true
  }

  const validateDescription = (description) => {
    const regex = /^[a-zA-Z0-9\s!@#$%^&*(),.?":{}|<>]+$/
    if (description.length < 10) {
      setDescriptionErrorMessage(
        "Description must be at least 10 characters long."
      )
      return false
    } else if (description.length > 500) {
      setDescriptionErrorMessage(
        "Description must be no more than 500 characters long."
      )
      return false
    } else if (!regex.test(description)) {
      setDescriptionErrorMessage("Description contains invalid characters.")
      return false
    }
    return true
  }

  const handleBlur = (value, validator, setValid) => {
    if (value.trim().length === 0) {
      setValid(true)
    } else {
      setValid(validator(value))
    }
  }

  const handleTitleBlur = () => {
    handleBlur(reviewTitle, validateTitle, setTitleValid)
  }

  const handleDescriptionBlur = () => {
    handleBlur(reviewText, validateDescription, setDescriptionValid)
  }

  const onChange = (e) => {
    const { name, value } = e.target
    if (name === "reviewTitle") {
      setReviewTitle(value)
      // Reset the title validity state to true when user starts editing
      setTitleValid(true)
    } else if (name === "reviewText") {
      setReviewText(value)
      setDescriptionValid(true)
    }
  }

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/products/${slug}/add-review`, {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        }
      } catch (error) {
        console.error("Error fetching product details:", error)
      }
    }

    if (slug) {
      fetchProductDetails()
    }
  }, [slug])

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setError("") // Reset error message

    // Check if user has already submitted a review
    if (hasSubmittedReview) {
      setError("You have already submitted a review for this item!")
      return
    }

    // Validate the rating before making the API call
    if (rating === 0) {
      setRatingError("Please select a rating.")
      return
    }

    // Validate the title before making the API call
    const isTitleValid = validateTitle(reviewTitle)
    setTitleValid(isTitleValid)
    if (!isTitleValid) {
      titleRef.current.focus()
      return
    }

    // Validate the description before making the API call
    const isDescriptionValid = validateDescription(reviewText)
    setDescriptionValid(isDescriptionValid)
    if (!isDescriptionValid) {
      descriptionRef.current.focus()
      return
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({
          title: reviewTitle,
          text: reviewText,
          rating,
          cognitoSub: userAttributes.sub,
          productId: slug,
        }),
      })

      if (response.ok) {
        // Refresh reviews list..
        router.push(`/products/${slug}`)
      } else {
        const errorData = await response.json()
        if (
          errorData.error ===
          "You have already submitted a review for this item!"
        ) {
          setHasSubmittedReview(true)
        }
        setError(errorData.error)
      }
    } catch (error) {
      console.error("Error submitting review:", error)
    }
  }

  const handleRatingChange = (newRating) => {
    setRating(newRating)
    setRatingError("") // Clear the rating error message
  }

  const handleCancel = () => {
    router.push(`/products/${product.slug}`)
  }

  const invalidStyle = {
    borderColor: "var(--sc-color-red-dark)",
    color: "var(--sc-color-red-dark)",
  }

  return (
    <>
      <Head>
        <title>Write Review | TechNexus</title>
        <meta name="description" content="Write a product review." />
      </Head>
      <Container>
        {!product ? (
          <LoaderDots />
        ) : (
          <>
            <ProductDetailsContainer>
              <ProductImage href={`/products/${product.slug}`}>
                <Image
                  src={product.image}
                  alt={product.name}
                  height={500}
                  width={500}
                  priority={true}
                />
              </ProductImage>
              <ProductInfo>
                <h3>Review this product</h3>
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                </div>
                <ReviewForm
                  onSubmit={handleReviewSubmit}
                  data-form-type="other"
                >
                  {error && <ErrorMessage>{error}</ErrorMessage>}
                  <h2>What would you rate this product?</h2>
                  <StarRatingSelector
                    rating={rating}
                    setRating={handleRatingChange}
                  />
                  {ratingError && (
                    <ValidationMessage>{ratingError}</ValidationMessage>
                  )}
                  <EntryWrapper>
                    <EntryContainer
                      ref={titleRef}
                      onChange={onChange}
                      type="text"
                      id="reviewTitle"
                      name="reviewTitle"
                      placeholder=""
                      value={reviewTitle}
                      onBlur={handleTitleBlur}
                      data-form-type="title,job"
                      style={!titleValid ? invalidStyle : {}}
                    />
                    <Label
                      htmlFor="reviewTitle"
                      style={!titleValid ? invalidStyle : {}}
                    >
                      Review title
                    </Label>
                  </EntryWrapper>
                  {!titleValid && (
                    <ValidationMessage>{titleErrorMessage}</ValidationMessage>
                  )}
                  <EntryWrapper>
                    <EntryContainer
                      ref={descriptionRef}
                      onChange={onChange}
                      as="textarea"
                      id="reviewText"
                      name="reviewText"
                      placeholder=""
                      value={reviewText}
                      onBlur={handleDescriptionBlur}
                      data-form-type="other"
                      style={!descriptionValid ? invalidStyle : {}}
                    />
                    <Label
                      htmlFor="reviewText"
                      style={!descriptionValid ? invalidStyle : {}}
                    >
                      Write a short description
                    </Label>
                  </EntryWrapper>
                  {!descriptionValid && (
                    <ValidationMessage>
                      {descriptionErrorMessage}
                    </ValidationMessage>
                  )}
                  <ButtonWrapper>
                    <SubmitBtn type="button" onClick={handleCancel}>
                      Cancel
                    </SubmitBtn>
                    <SubmitBtn
                      type="submit"
                      disabled={
                        !titleValid ||
                        !descriptionValid ||
                        hasSubmittedReview ||
                        ratingError
                      }
                    >
                      Submit Review
                    </SubmitBtn>
                  </ButtonWrapper>
                </ReviewForm>
              </ProductInfo>
            </ProductDetailsContainer>
          </>
        )}
      </Container>
    </>
  )
}

export default AddReview
