import styled from "styled-components"
import StarRating from "../../components/review-stars/StarRatings"
import { IoLocationOutline } from "react-icons/io5"
import { LiaTruckSolid } from "react-icons/lia"
import { PiKeyReturn } from "react-icons/pi"
import { RiArrowDownSLine } from "react-icons/ri"
import AddToFavoritesButton from "../../components/shopping/AddToFavoritesButton"
import AddToCartButton from "../../components/shopping/AddToCartButton"
import { useMobileView } from "../../context/MobileViewContext"
import useCurrencyFormatter from "../../hooks/useCurrencyFormatter"

const ProductNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  order: 0; // Make sure product details are at the top in mobile view

  h1 {
    font-size: 23px;
  }

  @media (min-width: 768px) {
    order: 0;
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

const CartBtnWrapper = styled.div`
  display: flex;
  padding-top: 5px;
  gap: 15px;

  > button:first-child {
    // Target the 'add to cart' button
    width: 75%;
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
  background-color: var(--sc-color-blue);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--sc-color-button-text-disabled);
    color: var(--sc-color-blue);
  }

  &:active {
    background-color: var(--sc-color-button-text-disabled);
    color: var(--sc-color-blue);
  }

  &:focus-visible {
    background-color: var(--sc-color-button-text-disabled);
    color: var(--sc-color-blue);
  }
`

const ShipWrapper = styled.div`
  display: flex;
  font-weight: 700;
  font-size: 16px;
  position: relative;
  align-items: center;
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
  font-size: 24px;
  display: flex;
  align-items: center;
  margin-right: 8px;
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

const ProductInfo = ({
  product,
  zipCode,
  toggleZipPopup,
  isZipPopupVisible,
  enteredZipCode,
  isOpen,
  handleZipCodeChange,
  invalidStyle,
  handleZipCodeBlur,
  handleZipCodeSubmit,
  zipCodeValid,
  deliveryDate,
  dayOfWeek,
  returnDate,
  setOpenSection,
}) => {
  const isMobileView = useMobileView()
  const formatCurrency = useCurrencyFormatter()

  const handleReviewCountClick = () => {
    setOpenSection((prevSection) =>
      prevSection === "reviews" ? "" : "reviews"
    )
  }

  return (
    <>
      <ProductNameWrapper>
        <h1>{product.name}</h1>
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
                <PiKeyReturn />
              </ExchangeBox>
              <ExchangeContent>
                <ExchangeHeader>15-DAY FREE & EASY RETURNS</ExchangeHeader>
                <p>
                  If received {dayOfWeek}, the last day to return this item
                  would be {returnDate}.
                </p>
              </ExchangeContent>
            </ExchangeWrapper>
            <CartBtnWrapper>
              <AddToCartButton
                productId={product.product_id}
                quantity={1}
                productName={product.name}
              />
              <AddToFavoritesButton
                productId={product.product_id}
                productName={product.name}
              />
            </CartBtnWrapper>
            <ZipWrapper>
              <IoLocationOutline style={{ marginRight: "5px" }} size={24} />
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
              <LiaTruckSolid style={{ marginRight: "5px" }} size={24} />
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
              <PiKeyReturn />
            </ExchangeBox>
            <ExchangeContent>
              <ExchangeHeader>15-DAY FREE & EASY RETURNS</ExchangeHeader>
              <p>
                If received {dayOfWeek}, the last day to return this item would
                be {returnDate}.
              </p>
            </ExchangeContent>
          </ExchangeWrapper>
          <CartBtnWrapper>
            <AddToCartButton
              productId={product.product_id}
              quantity={1}
              productName={product.name}
            />
            <AddToFavoritesButton
              productId={product.product_id}
              productName={product.name}
            />
          </CartBtnWrapper>
          <ZipWrapper>
            <IoLocationOutline style={{ marginRight: "5px" }} size={24} />
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
            <LiaTruckSolid style={{ marginRight: "5px" }} size={24} />
            <ShippingOffer>Free Shipping</ShippingOffer>
          </ShipWrapper>
        </Product>
      )}
    </>
  )
}

export default ProductInfo
