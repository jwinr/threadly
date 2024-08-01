import React, { useContext, useState, useEffect, useRef } from "react"
import styled, { keyframes, css } from "styled-components"
import { LiaHeart, LiaHeartSolid } from "react-icons/lia"
import { useRouter } from "next/router"
import { UserContext } from "../../context/UserContext"
import { useFavorites } from "../../context/FavoritesContext"

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
  position: relative;
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

interface IconProps {
  loading?: boolean
  isAdding?: boolean
}

const IconOutline = styled(LiaHeart)<IconProps>`
  ${({ loading, isAdding }) =>
    loading &&
    isAdding &&
    css`
      animation: ${loadingAnimation} 0.5s ease-in-out;
    `}
`

const IconFilled = styled(LiaHeartSolid)<IconProps>`
  ${({ loading, isAdding }) =>
    loading &&
    isAdding &&
    css`
      animation: ${loadingAnimation} 0.5s ease-in-out;
    `}
`

interface TooltipProps {
  visible: boolean
}

const Tooltip = styled.div<TooltipProps>`
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

interface FavoriteItem {
  product_id: string
}

interface AddToFavoritesButtonProps {
  productId: string
  productName: string
}

const AddToFavoritesButton: React.FC<AddToFavoritesButtonProps> = ({
  productId,
  productName,
}) => {
  const { userAttributes } = useContext(UserContext)
  const { favorites, addFavorite, removeFavorite } = useFavorites()
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)
  const [isAdding, setIsAdding] = useState(true)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [hoverTooltipVisible, setHoverTooltipVisible] = useState(false)
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode>("")
  const router = useRouter()
  const tooltipRef = useRef<HTMLDivElement>(null)

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  useEffect(() => {
    if (userAttributes && userAttributes.sub) {
      const isAdded = favorites.some(
        (item: FavoriteItem) => item.product_id === productId
      )
      setAdded(isAdded)
    }
  }, [productId, userAttributes, favorites])

  const addToFavorites = async () => {
    if (userAttributes) {
      setLoading(true)
      setIsAdding(true)
      setAdded(true)
      await delay(300)
      await addFavorite(userAttributes.sub, productId)
      setLoading(false)
      setTooltipContent(
        <>
          Favorited! <a href="/favorites">See all of your favorites</a>
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
      await removeFavorite(userAttributes.sub, productId)
      setLoading(false)
      setAdded(false)
      setTooltipVisible(false)
    }
  }

  const handleClick = () => {
    if (!userAttributes) {
      setTooltipContent("Sign in to favorite this product")
      setTooltipVisible(true)
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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
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
          if (!userAttributes) {
            setTooltipContent("Sign in to favorite this product")
            setHoverTooltipVisible(true)
          } else if (!added && userAttributes) {
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

export default AddToFavoritesButton
