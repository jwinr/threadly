import React from 'react'
import styled from 'styled-components'
import FavoriteNone from '@/public/images/icons/favorite_none.svg'

const EmptyFavoritesContainer = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 6px;
  box-shadow:
    rgba(0, 0, 0, 0.04) 0px 6px 12px 4px,
    rgba(0, 0, 0, 0.04) 0px 4px 10px 2px,
    rgba(0, 0, 0, 0.06) 0px 2px 8px,
    rgba(0, 0, 0, 0.04) 0px 2px 4px;
  width: 100%;
  flex-direction: column;
  align-items: center;
`

const EmptyContents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  a {
    width: 100%;
  }

  span {
    margin-bottom: 25px;
  }

  button {
    width: 250px;
  }
`

const EmptyHeader = styled.h1`
  font-size: 23px;
  font-weight: bold;
  color: var(--sc-color-title);
  margin-bottom: 8px;
`

const EmptyWrapper = styled.div`
  display: flex;
  margin-top: 25px;
  margin-bottom: 15px;
  height: 100px;

  svg {
    width: 100%;
    height: 100%;
  }
`

const EmptyFavoritesSection = () => {
  return (
    <>
      <EmptyFavoritesContainer>
        <EmptyContents>
          <EmptyWrapper>
            <FavoriteNone />
          </EmptyWrapper>
          <EmptyHeader>Track your favorite items</EmptyHeader>
          <span>
            While browsing, select the heart icon on your favorite items to keep tabs on new sale
            prices.
          </span>
        </EmptyContents>
      </EmptyFavoritesContainer>
    </>
  )
}

export default EmptyFavoritesSection
