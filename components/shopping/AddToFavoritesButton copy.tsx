import React, { useContext, useState, useEffect, useRef } from "react"
import styled, { keyframes, css } from "styled-components"
import { LiaHeart, LiaHeartSolid } from "react-icons/lia"
import { useRouter } from "next/router"
import { UserContext } from "../../context/UserContext"
import { useFavorites } from "../../context/FavoritesContext"
import Cancel from "@/public/images/icons/cancel.svg"
import PortalWrapper from "@/components/Elements/PortalWrapper"

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
  fadeOut: boolean
  arrowLeftOffset?: number
}

const Tooltip = styled.div<TooltipProps>`
  position: absolute;
  transform: translateX(-50%);
  margin-bottom: 10px;
  padding: 5px 10px;
  background-color: #333;
  color: #fff;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 150;
  transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
  display: flex;
  align-items: center;
  opacity: ${({ visible, fadeOut }) => (fadeOut ? 0 : visible ? 1 : 0)};
  visibility: ${({ visible, fadeOut }) =>
    fadeOut ? "hidden" : visible ? "visible" : "hidden"};
  animation: ${({ visible }) =>
    visible
      ? css`
          ${fadeInUp} 0.3s ease-in-out;
        `
      : "none"};

  &::after {
    content: "";
    position: absolute;
    top: 99%;
    left: ${({ arrowLeftOffset }) => `${arrowLeftOffset}%`};
    transform: translateX(-50%);
    border-width: 7px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }

  a {
    color: #fff;
    text-decoration: underline;
    margin-left: 5px;
  }

  @media (max-width: 1024px) {
    display: none; // Don't render the tooltips on tablets or phones
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  margin-left: 10px;
  cursor: pointer;

  svg {
    width: 10px;
    height: 10px;
  }

  svg > path {
    fill: #fff;
  }
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
  const [fadeOut, setFadeOut] = useState(false)
  const [hoverTooltipVisible, setHoverTooltipVisible] = useState(false)
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode>("")
  const [arrowLeftOffset, setArrowLeftOffset] = useState(50)
  const router = useRouter()
  const tooltipRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

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
      await delay(500)
      await addFavorite(userAttributes.sub, productId)
      setLoading(false)
      setTooltipContent(
        <>
          Favorited! <a href="/favorites">See all of your favorites</a>
          <CloseButton onClick={handleTooltipClose}>
            <Cancel />
          </CloseButton>
        </>
      )
      setTooltipVisible(true)
      setFadeOut(false)
    }
  }

  const removeFromFavorites = async () => {
    if (userAttributes) {
      setLoading(true)
      setIsAdding(false)
      await delay(200) // Slight delay to prevent UI flicker
      await removeFavorite(userAttributes.sub, productId)
      setLoading(false)
      setAdded(false)
      await delay(500) // Delay so the tooltip doesn't immediately reappear
      setTooltipVisible(false)
      setFadeOut(false)
    }
  }

  const handleClick = () => {
    if (!userAttributes) {
      setTooltipContent("Sign in to favorite this product")
      setTooltipVisible(true)
      setFadeOut(false)
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
    setFadeOut(true)
    setTimeout(() => setTooltipVisible(false), 200) // 200ms to match the fade-out transition
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
        setFadeOut(true)
        setTimeout(() => setTooltipVisible(false), 200)
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

  useEffect(() => {
    if (tooltipVisible || hoverTooltipVisible) {
      const tooltip = tooltipRef.current
      const button = buttonRef.current
      if (tooltip && button) {
        const buttonRect = button.getBoundingClientRect()
        const tooltipRect = tooltip.getBoundingClientRect()
        let top = buttonRect.top + window.scrollY - tooltipRect.height - 10
        let left = buttonRect.left + window.scrollX + buttonRect.width / 2
        setArrowLeftOffset(50)

        let overflowAmount
        if (hoverTooltipVisible) {
          overflowAmount = left + tooltipRect.width - window.innerWidth - 65
        } else {
          overflowAmount = left + tooltipRect.width - window.innerWidth - 100
        }

        // Adjust if tooltip is going off the right edge of the screen
        if (left + tooltipRect.width > window.innerWidth) {
          left -= overflowAmount
          setArrowLeftOffset(50 + (overflowAmount / tooltipRect.width) * 100)
        }

        tooltip.style.top = `${top}px`
        tooltip.style.left = `${left}px`
      }
    }
  }, [tooltipVisible, hoverTooltipVisible])

  return (
    <Container>
      <Button
        ref={buttonRef}
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
        <PortalWrapper>
          <Tooltip
            ref={tooltipRef}
            visible={tooltipVisible || hoverTooltipVisible}
            fadeOut={fadeOut}
            arrowLeftOffset={arrowLeftOffset}
          >
            {tooltipContent}
          </Tooltip>
        </PortalWrapper>
      )}
    </Container>
  )
}

export default AddToFavoritesButton
