import React, { useContext, useState, useEffect, useRef } from "react"
import styled, { keyframes, css } from "styled-components"
import { LiaHeart, LiaHeartSolid } from "react-icons/lia"
import { useRouter } from "next/router"
import { UserContext } from "../../context/UserContext"
import PropFilter from "../../utils/PropFilter"
import Link from "next/link"

const loadingAnimation = keyframes`
  0% {
    transform: scale(0);
  }
  30% {
    transform: scale(1.1);
  }
  60% {
    transform: scale(0.95);
  }
  80% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, 20%);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, 0%);
  }
`

const Container = styled.div`
  position: relative; // Keep the button inside of the product card
  order: 2;
`

const Button = styled.button`
  padding: 10px;
  border-radius: 50%;
  color: var(--sc-color-text);
  display: flex;
  border: 1px solid var(--sc-color-border-gray);

  &:hover {
    background-color: var(--color-main-dark-blue);
  }

  &:active {
    background-color: var(--color-main-dark-blue);
  }

  &:focus-visible {
    background-color: var(--color-main-dark-blue);
  }
`

const IconOutline = styled(PropFilter(LiaHeart)(["loading", "isAdding"]))`
  ${({ loading, isAdding }) =>
    loading &&
    isAdding &&
    css`
      animation: ${loadingAnimation} 0.5s ease-in-out;
    `}
`

const IconFilled = styled(PropFilter(LiaHeartSolid)(["loading", "isAdding"]))`
  ${({ loading, isAdding }) =>
    loading &&
    isAdding &&
    css`
      animation: ${loadingAnimation} 0.5s ease-in-out;
    `}
`

const Tooltip = styled(PropFilter("div")(["visible"]))`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 10px;
  padding: 5px 10px;
  background-color: #333;
  color: #fff;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
  transition: opacity 0.2s, visibility 0.2s;
  display: flex;
  align-items: center;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
  animation: ${({ visible }) =>
    visible
      ? css`
          ${fadeInUp} 0.3s ease-in-out;
        `
      : "none"};

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }

  a {
    color: #fff;
    text-decoration: underline;
    margin-left: 5px;
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  margin-left: 10px;
  cursor: pointer;
`

export default function AddToFavoritesButton({ productId, productName }) {
  const { userAttributes } = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)
  const [isAdding, setIsAdding] = useState(true)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [hoverTooltipVisible, setHoverTooltipVisible] = useState(false)
  const [tooltipContent, setTooltipContent] = useState("")
  const router = useRouter()
  const tooltipRef = useRef(null)

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  useEffect(() => {
    // Check if the product is already in the favorites
    if (userAttributes && userAttributes.sub) {
      console.log("Running favorites check..")
      fetch(`/api/favorites?cognitoSub=${userAttributes.sub}`, {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const isAdded = data.some((item) => item.product_id === productId)
            setAdded(isAdded)
          } else {
            // Handle the case where the favorites array is empty
            setAdded(false)
          }
        })
        .catch((error) => console.error("Error fetching favorites:", error))
    }
  }, [productId, userAttributes])

  const addToFavorites = async () => {
    if (userAttributes) {
      setLoading(true)
      setIsAdding(true)
      setAdded(true)
      await delay(300)
      await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ cognitoSub: userAttributes.sub, productId }),
      })
      setLoading(false)
      setTooltipContent(
        <>
          Favorited! <Link href="/favorites">See all of your favorites</Link>
          <CloseButton onClick={handleTooltipClose}>X</CloseButton>
        </>
      )
      setTooltipVisible(true)
    }
  }

  const removeFromFavorites = async () => {
    if (userAttributes) {
      setLoading(true)
      setIsAdding(false)
      await delay(50) // Slight delay to prevent UI flicker
      await fetch("/api/favorites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ cognitoSub: userAttributes.sub, productId }),
      })
      setLoading(false)
      setAdded(false)
      setTooltipVisible(false)
    }
  }

  const handleClick = () => {
    if (!userAttributes) {
      console.log("Handling favorites click with no user..")
      router.push("/login")
      return
    }

    if (added) {
      removeFromFavorites()
    } else {
      addToFavorites()
    }
  }

  const handleTooltipClose = () => {
    setTooltipVisible(false)
  }

  const getAriaLabel = () => {
    if (!userAttributes) {
      return `Sign in to favorite ${productName} to keep tabs on it`
    }

    if (added) {
      return `Remove ${productName} from your favorites`
    }

    return `Favorite ${productName} to keep tabs on it`
  }

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setTooltipVisible(false)
        setHoverTooltipVisible(false)
      }
    }

    if (tooltipVisible || hoverTooltipVisible) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [tooltipVisible, hoverTooltipVisible])

  return (
    <Container>
      <Button
        onClick={handleClick}
        onMouseEnter={() => {
          if (!added && userAttributes) {
            setTooltipContent("Favorite to keep tabs on it")
            setHoverTooltipVisible(true)
          }
        }}
        onMouseLeave={() => setHoverTooltipVisible(false)}
        disabled={loading}
        aria-label={getAriaLabel()}
      >
        {added ? (
          <IconFilled
            loading={loading}
            isAdding={isAdding}
            aria-hidden="true"
          />
        ) : (
          <IconOutline
            loading={loading}
            isAdding={isAdding}
            aria-hidden="true"
          />
        )}
      </Button>
      {(tooltipVisible || hoverTooltipVisible) && (
        <Tooltip
          ref={tooltipRef}
          visible={tooltipVisible || hoverTooltipVisible}
        >
          {tooltipContent}
        </Tooltip>
      )}
    </Container>
  )
}
