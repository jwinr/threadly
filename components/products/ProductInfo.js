import styled, { css, keyframes } from "styled-components"
import StarRating from "@/components/ReviewStars/StarRatings"
import Truck from "@/public/images/icons/truck.svg"
import Subscription from "@/public/images/icons/subscription.svg"
import Location from "@/public/images/icons/location.svg"
import { RiArrowDownSLine } from "react-icons/ri"
import AddToFavoritesButton from "@/components/Shopping/AddToFavoritesButton"
import AddToCartButton from "@/components/Shopping/AddToCartButton"
import { useMobileView } from "@/context/MobileViewContext"
import useCurrencyFormatter from "@/hooks/useCurrencyFormatter"

const loadingAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
`

const LoadingProduct = styled.div`
  position: relative;
  width: 100%;
  order: 0; // Make sure product details are at the top in mobile view
  border-radius: 8px;
  background-color: #d6d6d6;
  animation: enter-form-desktop 0.3s forwards,
    ${loadingAnimation} 2s ease-in-out infinite;
  animation-fill-mode: forwards;

  @media (max-width: 768px) {
    animation: enter 0.3s 0.1s forwards,
      ${loadingAnimation} 2s ease-in-out infinite;
  }
`

const ProductNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  order: 0; // Make sure product details are at the top in mobile view

  h1 {
    font-size: 23px;
  }
`

const Product = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  order: 4; // Price and purchase buttons at the bottom in mobile view

  h2 {
    font-weight: bold;
    display: inline-block;
    font-size: 19px;
  }

  @media (min-width: 768px) {
    order: 1; // And below the product details in desktop view

    h1 {
      font-size: 23px;
      font-weight: bold;
      word-break: break-word;
    }

    h2 {
      font-size: 23px;
      font-weight: 700;
    }

    p {
      font-size: 14px;
    }
  }
`

const OriginalPrice = styled.span`
  font-weight: bold;
  display: inline-block;
  font-size: 19px;
  text-decoration: line-through;
`

const Price = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin-right: 5px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`

const ZipWrapper = styled.div`
  display: flex;
  font-size: 16px;
  padding: 15px 0;
  position: relative;
  align-items: center;
`

const ZipUnderline = styled.div`
  display: flex;
  font-weight: 700;
  font-size: 16px;
  text-decoration: underline;
  margin: 0 5px;
`

const ZipDropdownBtn = styled.button`
  display: flex;
  cursor: pointer;
  align-items: center;
  user-select: none;
`

const ZipSubmitBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease-in 0s;
  border-radius: 6px;
  color: var(--sc-color-button-text-disabled);
  border: medium;
  font-weight: bold;
  min-height: 44px;
  padding: 0px 16px;
  text-align: center;
  background-color: var(--sc-color-carnation);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--sc-color-button-text-disabled);
    color: var(--sc-color-carnation);
  }

  &:active {
    background-color: var(--sc-color-button-text-disabled);
    color: var(--sc-color-carnation);
  }

  &:focus-visible {
    background-color: var(--sc-color-button-text-disabled);
    color: var(--sc-color-carnation);
  }
`

const ShipWrapper = styled.div`
  display: flex;
  font-weight: 700;
  font-size: 16px;
  position: relative;
  align-items: center;

  svg {
    width: 20px;
    height: 20px;
  }
`

const DateWrapper = styled.div`
  display: flex;
  font-weight: 400;
  font-size: 16px;
`

const ShippingOffer = styled.div`
  display: flex;
  font-weight: 400;
  font-size: 16px;
  padding: 15px 0;
`

const ExchangeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 15px 0;
`

const ExchangeHeader = styled.p`
  font-weight: 800;
  margin-bottom: 4px;
`

const ExchangeBox = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;

  svg {
    width: 20px;
    height: 20px;
  }
`

const ExchangeContent = styled.div`
  display: flex;
  flex-direction: column;
`

const ValidationMessage = styled.div`
  color: #d32f2f;
  font-size: 14px;
  bottom: -20px;
  text-align: left;
`

const ReviewWrapper = styled.div`
  display: flex;
  font-size: 14px;
`

const AddCartWrapper = styled.div`
  > button {
    min-height: 44px;
    width: 100%;
    font-size: 16px;
  }
`

const AddFavsWrapper = styled.div`
  position: absolute;
  right: 0;
`

const StyledLocation = styled(Location)`
  width: 20px;
  height: 20px;
  fill: #30313d;
  margin-right: 8px;
`

const StyledTruck = styled(Truck)`
  margin-right: 8px;
`

const ProductInfo = ({
  product,
  zipCode,
  toggleZipPopup,
  isZipPopupVisible,
  enteredZipCode,
  isOpen,
  handleZipCodeChange,
  handleZipCodeBlur,
  handleZipCodeSubmit,
  zipCodeValid,
  deliveryDate,
  dayOfWeek,
  returnDate,
  setOpenSection,
  loading,
}) => {
  const isMobileView = useMobileView()
  const formatCurrency = useCurrencyFormatter()

  const handleReviewCountClick = () => {
    setOpenSection((prevSection) =>
      prevSection === "reviews" ? "" : "reviews"
    )
  }

  if (loading) {
    return (
      <>
        <LoadingProduct />
      </>
    )
  }

  return (
    <>
      <ProductNameWrapper>
        <h1>{product.name}</h1>
        <AddFavsWrapper>
          <AddToFavoritesButton
            productId={product.product_id}
            productName={product.name}
          />
        </AddFavsWrapper>
        <ReviewWrapper>
          <StarRating reviews={product.reviews} />
          <button
            className="average-rating-text"
            onClick={handleReviewCountClick}
          >
            {product.reviews.length === 0
              ? "Be the first!"
              : `(${product.reviews.length} review${
                  product.reviews.length !== 1 ? "s" : ""
                })`}
          </button>
        </ReviewWrapper>
        {!isMobileView && (
          <Product>
            <Price>{formatCurrency(product.sale_price || product.price)}</Price>
            {product.sale_price && (
              <span>
                reg{" "}
                <OriginalPrice>{formatCurrency(product.price)}</OriginalPrice>
              </span>
            )}
            <ExchangeWrapper>
              <ExchangeBox>
                <Subscription />
              </ExchangeBox>
              <ExchangeContent>
                <ExchangeHeader>15-DAY FREE & EASY RETURNS</ExchangeHeader>
                <p>
                  If received {dayOfWeek}, the last day to return this item
                  would be {returnDate}.
                </p>
              </ExchangeContent>
            </ExchangeWrapper>
            <AddCartWrapper>
              <AddToCartButton
                productId={product.product_id}
                quantity={1}
                productName={product.name}
              />
            </AddCartWrapper>
            <ZipWrapper>
              <StyledLocation />
              Delivery to{" "}
              <ZipDropdownBtn onClick={toggleZipPopup}>
                <ZipUnderline>{zipCode}</ZipUnderline>
                {isZipPopupVisible && (
                  <PopupContainer onClick={(e) => e.stopPropagation()}>
                    <ZipForm
                      type="tel"
                      name="zipCode"
                      placeholder=""
                      value={enteredZipCode}
                      isOpen={isOpen}
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      onChange={handleZipCodeChange}
                      onBlur={handleZipCodeBlur}
                    />
                    <Label htmlFor="zip">Enter ZIP Code</Label>
                    <ZipSubmitBtn onClick={handleZipCodeSubmit}>
                      Submit
                    </ZipSubmitBtn>
                    {!zipCodeValid && (
                      <ValidationMessage>
                        Please enter a valid ZIP code.
                      </ValidationMessage>
                    )}
                  </PopupContainer>
                )}
                <div
                  className={`arrow-icon ${isOpen ? "rotate-arrow" : ""}`}
                  style={{ opacity: 1 }}
                >
                  <RiArrowDownSLine />
                </div>
              </ZipDropdownBtn>
            </ZipWrapper>
            <DateWrapper>Get it by {deliveryDate}</DateWrapper>
            <ShipWrapper>
              <StyledTruck />
              <ShippingOffer>Free Shipping</ShippingOffer>
            </ShipWrapper>
          </Product>
        )}
      </ProductNameWrapper>
      {isMobileView && (
        <Product>
          <Price>{formatCurrency(product.sale_price || product.price)}</Price>
          {product.sale_price && (
            <span>
              reg <OriginalPrice>{formatCurrency(product.price)}</OriginalPrice>
            </span>
          )}
          <ExchangeWrapper>
            <ExchangeBox>
              <Subscription />
            </ExchangeBox>
            <ExchangeContent>
              <ExchangeHeader>15-DAY FREE & EASY RETURNS</ExchangeHeader>
              <p>
                If received {dayOfWeek}, the last day to return this item would
                be {returnDate}.
              </p>
            </ExchangeContent>
          </ExchangeWrapper>
          <AddToCartButton
            productId={product.product_id}
            quantity={1}
            productName={product.name}
          />
          <AddToFavoritesButton
            productId={product.product_id}
            productName={product.name}
          />
          <ZipWrapper>
            <StyledLocation />
            Delivery to{" "}
            <ZipDropdownBtn onClick={toggleZipPopup}>
              <ZipUnderline>{zipCode}</ZipUnderline>
              {isZipPopupVisible && (
                <PopupContainer onClick={(e) => e.stopPropagation()}>
                  <ZipForm
                    type="tel"
                    name="zipCode"
                    placeholder=""
                    value={enteredZipCode}
                    isOpen={isOpen}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    onChange={handleZipCodeChange}
                    style={!zipCodeValid ? invalidStyle : {}}
                    onBlur={handleZipCodeBlur}
                  />
                  <Label
                    htmlFor="zip"
                    style={!zipCodeValid ? invalidStyle : {}}
                  >
                    Enter ZIP Code
                  </Label>
                  <ZipSubmitBtn onClick={handleZipCodeSubmit}>
                    Submit
                  </ZipSubmitBtn>
                  {!zipCodeValid && (
                    <ValidationMessage>
                      Please enter a valid ZIP code.
                    </ValidationMessage>
                  )}
                </PopupContainer>
              )}
              <div
                className={`arrow-icon ${isOpen ? "rotate-arrow" : ""}`}
                style={{ opacity: 1 }}
              >
                <RiArrowDownSLine />
              </div>
            </ZipDropdownBtn>
          </ZipWrapper>
          <DateWrapper>Get it by {deliveryDate}</DateWrapper>
          <ShipWrapper>
            <StyledTruck />
            <ShippingOffer>Free Shipping</ShippingOffer>
          </ShipWrapper>
        </Product>
      )}
    </>
  )
}

export default ProductInfo
