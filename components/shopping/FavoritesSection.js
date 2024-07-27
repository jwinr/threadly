import React, { useState } from "react"
import styled from "styled-components"
import Link from "next/link"
import Image from "next/image"
import AddToCartButton from "../shopping/AddToCartButton"
import AddToFavoritesButton from "../shopping/AddToFavoritesButton"

const FavoritesWrapper = styled.div`
  margin-left: initial;
  flex-basis: 100%;
  max-width: 100%;

  button {
    min-height: 32px;
    width: fit-content;
    font-size: 12px;
    order: 2;
  }
`

const PriceWrapper = styled.div`
  flex-direction: column;
  order: 4;
  flex-basis: 20%;
  max-width: 20%;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    gap: 5px;
    max-width: initial;
    order: 0;

    span {
      font-size: 14px;
    }
  }
`

const OriginalPrice = styled.span`
  display: inline-block;
  font-size: 14px;
  text-decoration: line-through;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`

const Price = styled.h1`
  font-size: 19px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`

const TitleWrapper = styled.div`
  -webkit-box-align: center;
  align-items: center;
  display: flex;
  min-height: 100%;
  width: 100%;
  padding-bottom: 8px;
`

const TitleSection = styled.div`
  font-size: 16px;
  order: 1;
  width: 100%;
  flex-basis: 50%;
  max-width: 50%;

  @media (max-width: 768px) {
    flex-basis: initial;
    max-width: initial;
    margin-bottom: 8px;
  }
`

const Title = styled(Link)`
  font-size: 16px;
  margin-left: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    -webkit-line-clamp: 4;
    margin-left: 0;
  }
`

const Header = styled.h1`
  font-size: 29px;
  font-weight: bold;
  color: var(--sc-color-title);

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

const FavoriteDetails = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  & div {
    max-width: 100%;
  }
`

const ProductCard = styled.li`
  display: flex;
  flex-wrap: nowrap;
  padding: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: var(--sc-color-white);
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 6px 12px 4px,
    rgba(0, 0, 0, 0.04) 0px 4px 10px 2px, rgba(0, 0, 0, 0.06) 0px 2px 8px,
    rgba(0, 0, 0, 0.04) 0px 2px 4px;
`

const ImageWrapper = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto;
  width: 80px;
  height: 80px;
  order: 0;

  img {
    height: 80px;
    width: 80px;
    object-fit: scale-down; // Retain the aspect ratio without the Next Image size warning
  }
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 15px;
`

const FavButtonWrapper = styled.div`
  display: flex;
  order: 2;
  gap: 15px;
  margin-left: 12px;
  align-items: center;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`

const ShowMoreButton = styled.button`
  background: none;
  border: none;
  color: var(--sc-color-title);
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;

  &:hover {
    text-decoration: underline;
  }
`

const FavoritesSection = ({ favorites, loadMoreFavorites, isMobileView }) => {
  const [showAll, setShowAll] = useState(false)

  const handleShowAll = async () => {
    await loadMoreFavorites()
    setShowAll(true)
  }

  const displayedFavorites = showAll ? favorites : favorites.slice(0, 3)
  const remainingFavoritesCount = favorites.length - 3

  return (
    <>
      {favorites.length > 0 && (
        <FavoritesWrapper>
          <TitleWrapper>
            <Header>Favorites</Header>
          </TitleWrapper>
          {displayedFavorites.map((item) => (
            <ProductCard key={item.product_id}>
              <ImageWrapper
                prefetch={false}
                href={`/products/${item.product_slug}`}
              >
                <Image
                  src={item.product_image_url}
                  alt={item.product_name}
                  width={80}
                  height={80}
                />
              </ImageWrapper>
              {isMobileView ? (
                <InfoContainer>
                  <FavoriteDetails>
                    <PriceWrapper>
                      <Price>{`$${
                        item.product_sale_price || item.product_price
                      }`}</Price>
                      {item.product_sale_price && (
                        <span>
                          reg{" "}
                          <OriginalPrice>{`$${item.product_price}`}</OriginalPrice>
                        </span>
                      )}
                    </PriceWrapper>
                    <TitleSection>
                      <Title
                        prefetch={false}
                        href={`/products/${item.product_slug}`}
                      >
                        {item.product_name}
                      </Title>
                    </TitleSection>
                  </FavoriteDetails>
                  <FavButtonWrapper>
                    <AddToCartButton
                      productId={item.product_id}
                      quantity={1}
                      productName={item.product_name}
                    />
                    <AddToFavoritesButton
                      productId={item.product_id}
                      productName={item.product_name}
                    />
                  </FavButtonWrapper>
                </InfoContainer>
              ) : (
                <>
                  <FavoriteDetails>
                    <TitleSection>
                      <Title
                        prefetch={false}
                        href={`/products/${item.product_slug}`}
                      >
                        {item.product_name}
                      </Title>
                    </TitleSection>
                    <FavButtonWrapper>
                      <AddToCartButton
                        productId={item.product_id}
                        quantity={1}
                        productName={item.product_name}
                      />
                      <AddToFavoritesButton
                        productId={item.product_id}
                        productName={item.product_name}
                      />
                    </FavButtonWrapper>
                  </FavoriteDetails>
                  <PriceWrapper>
                    <Price>{`$${
                      item.product_sale_price || item.product_price
                    }`}</Price>
                    {item.product_sale_price && (
                      <span>
                        reg{" "}
                        <OriginalPrice>{`$${item.product_price}`}</OriginalPrice>
                      </span>
                    )}
                  </PriceWrapper>
                </>
              )}
            </ProductCard>
          ))}
          {!showAll && remainingFavoritesCount > 0 && (
            <ShowMoreButton onClick={handleShowAll}>
              Show remaining {remainingFavoritesCount} favorites
            </ShowMoreButton>
          )}
        </FavoritesWrapper>
      )}
    </>
  )
}

export default FavoritesSection
