import React from "react"

import styled from "styled-components"

import Link from "next/link"
import Image from "next/image"

import { VscClose } from "react-icons/vsc"
import ShipBox from "@/public/images/icons/shipbox.svg"
import Select from "@/components/Elements/Select"
import useCurrencyFormatter from "@/hooks/useCurrencyFormatter"

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
    object-fit: scale-down;
  }
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
    margin-bottom: 15px;
  }
`

const Title = styled(Link)`
  font-size: 16px;
  font-weight: 600;
  color: #353a44;
  margin-left: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    -webkit-line-clamp: 4;
    margin-left: 0;
  }
`

const Price = styled.h1`
  font-size: 19px;
  font-weight: bold;
  color: ${(props) => (props.sale ? "var(--sc-color-carnation)" : "#353a44;")};

  @media (max-width: 768px) {
  }
`

const SingleItemPrice = styled.span`
  color: var(--sc-color-text-light-gray);
`

const OriginalPrice = styled.span`
  display: inline-block;
  font-size: 14px;
  text-decoration: line-through;
`

const ShippingWrapper = styled.div`
  display: flex;
  padding: 0px 32px;
  flex-basis: 33%;
  max-width: 33%;
  order: 2;

  span {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    padding: 0;
    max-width: initial;
  }
`

const ShippingText = styled.div`
  display: flex;
  flex-direction: column;

  span {
    font-size: 14px;
  }
`

const ShipIconWrapper = styled.div`
  display: flex;
  align-items: center;
  height: fit-content;
  gap: 5px;

  .svg {
    @media (max-width: 768px) {
      width: 24px;
    }
  }
`

const Details = styled.div`
  display: flex;
  order: 4;
  flex-basis: 20%;
  max-width: 20%;
  flex-direction: column;

  span {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    max-width: initial;
    margin-bottom: 10px;
    order: 0;
  }
`

const PriceWrapper = styled.div`
  flex-direction: column;
  order: 4;
  flex-basis: 20%;
  max-width: 20%;

  span {
    color: var(--sc-color-text-light-gray);
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    gap: 5px;
    order: 0;
    max-width: 100%;
  }
`

const QuantityWrapper = styled.div`
  display: flex;
  flex-basis: 25%;
  max-width: 25%;
  flex-flow: wrap;
  align-items: flex-start;
  height: min-content;
  order: 3;

  @media (max-width: 768px) {
    margin-top: 15px;
    margin-bottom: 0;
  }
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 15px;
  order: 1;
`

const RemoveButtonWrapper = styled.div`
  margin-left: 5px;
  position: relative;
  display: flex;
  order: 4;
`

const RemoveButton = styled.button`
  position: absolute;
  right: -10px;
  top: -10px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Sale = styled.span`
  display: flex;
  font-weight: 600;
  color: var(--sc-color-carnation);
`

const CartProductCard = ({
  item,
  isMobileView,
  deliveryDate,
  removeFromCart,
  handleQuantityChange,
  index,
}) => {
  const formatCurrency = useCurrencyFormatter()
  const isOnSale = !!item.product_sale_price

  return (
    <ProductCard>
      <ImageWrapper
        href={`/products/${item.product_slug}`}
        aria-label={`View details of ${item.product_name}`}
      >
        <Image
          src={item.product_image_url}
          alt={item.product_name}
          width={80}
          height={80}
          priority={index === 0}
        />
      </ImageWrapper>
      {isMobileView ? (
        <InfoContainer>
          <TitleSection>
            <Title
              href={`/products/${item.product_slug}`}
              aria-label={`View details of ${item.product_name}`}
            >
              {item.product_name}
            </Title>
          </TitleSection>
          <ShippingWrapper>
            <ShipIconWrapper>
              <ShipBox />
              <ShippingText>
                <span>Free Shipping</span>
                <span>Get it by {deliveryDate}</span>
              </ShippingText>
            </ShipIconWrapper>
          </ShippingWrapper>
          <Details>
            <PriceWrapper>
              <Price sale={isOnSale}>
                {formatCurrency(
                  (item.product_sale_price || item.product_price) *
                    item.quantity
                )}
              </Price>
              {item.product_sale_price && (
                <>
                  <span>
                    reg{" "}
                    <OriginalPrice>
                      {formatCurrency(item.product_price)}
                    </OriginalPrice>
                  </span>
                </>
              )}
            </PriceWrapper>
            {item.quantity > 1 && !item.product_sale_price && (
              <SingleItemPrice>
                {formatCurrency(item.product_price)} each
              </SingleItemPrice>
            )}
            {item.quantity > 1 && item.product_sale_price && (
              <SingleItemPrice>
                {formatCurrency(item.product_sale_price)} each
              </SingleItemPrice>
            )}
            {item.product_sale_price && <Sale>Sale</Sale>}
          </Details>
          <QuantityWrapper>
            <Select
              label="Quantity"
              defaultValue={item.quantity}
              value={item.quantity}
              onChange={(e) =>
                handleQuantityChange(item.product_id, e.target.value)
              }
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </Select>
          </QuantityWrapper>
        </InfoContainer>
      ) : (
        <>
          <TitleSection>
            <Title
              href={`/products/${item.product_slug}`}
              aria-label={`View details of ${item.product_name}`}
            >
              {item.product_name}
            </Title>
          </TitleSection>
          <ShippingWrapper>
            <ShipIconWrapper>
              <ShipBox />
              <ShippingText>
                <span style={{ fontWeight: "600" }}>Free Shipping</span>
                <span>Get it by {deliveryDate}</span>
              </ShippingText>
            </ShipIconWrapper>
          </ShippingWrapper>
          <Details>
            <Price sale={isOnSale}>
              {formatCurrency(
                (item.product_sale_price || item.product_price) * item.quantity
              )}
            </Price>
            {item.quantity > 1 && !item.product_sale_price && (
              <SingleItemPrice>
                {formatCurrency(item.product_price)} each
              </SingleItemPrice>
            )}
            {item.product_sale_price && (
              <>
                <span>
                  reg{" "}
                  <OriginalPrice>
                    {formatCurrency(item.product_price)}
                  </OriginalPrice>
                  {item.quantity > 1 && (
                    <SingleItemPrice>
                      {formatCurrency(item.product_sale_price)} each
                    </SingleItemPrice>
                  )}
                </span>
                <Sale>Sale</Sale>
              </>
            )}
          </Details>
          <QuantityWrapper>
            <Select
              label="Quantity"
              defaultValue={item.quantity}
              value={item.quantity}
              onChange={(e) =>
                handleQuantityChange(item.product_id, e.target.value)
              }
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </Select>
          </QuantityWrapper>
        </>
      )}
      <RemoveButtonWrapper>
        <RemoveButton onClick={() => removeFromCart(item.product_id)}>
          <VscClose size={28} />
        </RemoveButton>
      </RemoveButtonWrapper>
    </ProductCard>
  )
}

export default CartProductCard
