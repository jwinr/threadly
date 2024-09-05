import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { LiaThumbsUpSolid, LiaThumbsDownSolid } from 'react-icons/lia'
import LoaderSpin from '@/components/Loaders/LoaderSpin'
import PropFilter from '@/utils/PropFilter'

interface VoteButtonProps {
  reviewId: string
  count: number
  type: 'upvote' | 'downvote'
  handleVote: (reviewId: string, type: 'upvote' | 'downvote') => Promise<void>
  voteType: 'upvote' | 'downvote' | null
  disabled?: boolean
}

const Button = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  padding: 5px 5px;
  border: none;
  border-radius: 4px;
  background-color: var(--sc-color-white);
  color: var(--sc-color-text);
  border: 1px solid var(--sc-color-border-gray);
  font-size: 14px;
  cursor: pointer;
  justify-content: space-evenly;
  overflow: hidden;
  width: 50px;
  height: 32px;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--sc-color-white-highlight);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`

const ThumbsIcon = styled(PropFilter('div')(['loading']))<{
  loading: boolean
}>`
  font-size: 22px;
  opacity: ${({ loading }) => (loading ? 0.2 : 1)};
  transition: transform 0.3s;
`

const Count = styled(PropFilter('span')(['loading']))<{
  loading: boolean
}>`
  opacity: ${({ loading }) => (loading ? 0.2 : 1)};
  transition: transform 0.3s;
`

const VoteButton: React.FC<VoteButtonProps> = ({
  reviewId,
  count,
  type,
  handleVote,
  voteType,
  disabled,
}) => {
  const [loading, setLoading] = useState(false)
  const [voteCount, setVoteCount] = useState(count)

  useEffect(() => {
    setVoteCount(count)
  }, [count])

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  const handleClick = async () => {
    if (voteType === type) {
      return // Prevent multiple votes of the same type
    }

    setLoading(true)
    try {
      await handleVote(reviewId, type)
      await delay(1000) // Ensure the loading state is visible for a short period
    } catch (error) {
      console.error('Failed to vote', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={disabled || loading}>
      <ThumbsIcon loading={loading}>
        {type === 'upvote' ? <LiaThumbsUpSolid /> : <LiaThumbsDownSolid />}
      </ThumbsIcon>
      <Count loading={loading}>{voteCount}</Count>
      <LoaderSpin loading={loading} />
    </Button>
  )
}

export default VoteButton
