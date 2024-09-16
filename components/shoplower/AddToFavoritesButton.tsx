import React, { useContext, useState, useEffect, useRef } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { LiaHeart, LiaHeartSolid } from 'react-icons/lia'
import { useRouter } from 'next/navigation'
import { UserContext } from '@/context/UserContext'
import { useFavorites } from '@/context/FavoritesContext'
import Popover from '@/components/Elements/Popover'
import PropFilter from '@/utils/PropFilter'

const FilteredLiaHeart = PropFilter(LiaHeart)(['loading', 'isAdding'])
const FilteredLiaHeartSolid = PropFilter(LiaHeartSolid)(['loading', 'isAdding'])

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

const IconOutline = styled(FilteredLiaHeart)<IconProps>`
  ${({ loading, isAdding }) =>
    loading &&
    isAdding &&
    css`
      animation: ${loadingAnimation} 0.5s ease-in-out;
    `}
`

const IconFilled = styled(FilteredLiaHeartSolid)<IconProps>`
  ${({ loading, isAdding }) =>
    loading &&
    isAdding &&
    css`
      animation: ${loadingAnimation} 0.5s ease-in-out;
    `}
`

interface FavoriteItem {
  product_id: string
}

interface AddToFavoritesButtonProps {
  productId: string
  productName: string | undefined
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
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode>('')
  const router = useRouter()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  useEffect(() => {
    if (userAttributes && userAttributes.sub) {
      const isAdded = favorites.some(
        (item: FavoriteItem) => item.product_id === productId
      )
      setAdded(isAdded)
      if (!isAdded) {
        setTooltipContent('Favorite to keep tabs on it')
      }
    } else {
      setTooltipContent('Sign in to favorite this product')
    }
  }, [productId, userAttributes, favorites])

  const addToFavorites = async () => {
    if (userAttributes) {
      setLoading(true)
      setIsAdding(true)
      setAdded(true)
      await delay(500)
      await addFavorite(userAttributes.sub!, productId)
      setLoading(false)
      setTooltipContent(
        <>
          <span>Favorited! See all of your</span>{' '}
          <a href="/favorites">favorites</a>
        </>
      )
    }
  }

  const removeFromFavorites = async () => {
    if (userAttributes) {
      setLoading(true)
      setIsAdding(false)
      await delay(200) // Slight delay to prevent UI flicker
      await removeFavorite(userAttributes.sub!, productId)
      setLoading(false)
      setAdded(false)
      setTooltipContent('Favorite to keep tabs on it')
    }
  }

  const handleClick = () => {
    if (!userAttributes) {
      setTooltipContent('Sign in to favorite this product')
      router.push('/login')
      return
    }

    if (added) {
      void removeFromFavorites()
    } else {
      void addToFavorites()
    }
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

  return (
    <Container>
      <Popover
        trigger="hover"
        position="top"
        content={tooltipContent}
        showArrow={true}
      >
        <Button
          ref={buttonRef}
          onClick={handleClick}
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
      </Popover>
    </Container>
  )
}

export default AddToFavoritesButton
