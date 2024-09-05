import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import CheckoutButton from './CheckoutButton'

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

interface OrderSummaryContainerProps {
  $isLoading: boolean
  $loadingSummary: boolean
}

const OrderSummaryContainer = styled.div<OrderSummaryContainerProps>`
  margin: 30px 16px;
  flex: 1 1 auto;
  background-color: ${({ $isLoading }) => ($isLoading ? '#d6d6d6' : 'initial')};
  height: ${({ $isLoading }) => ($isLoading ? '300px' : 'initial')};
  border-radius: ${({ $isLoading }) => ($isLoading ? '6px' : 'initial')};
  opacity: ${({ $loadingSummary }) => ($loadingSummary ? '0.5' : '1')};
  transition: opacity 0.3s ease-in-out;

  ${({ $isLoading }) =>
    $isLoading &&
    css`
      animation:
        enter-form-desktop 0.3s forwards,
        ${loadingAnimation} 2s ease-in-out infinite;
      animation-fill-mode: forwards, infinite;

      @media (max-width: 768px) {
        animation:
          enter-form-mobile 0.3s 0.1s forwards,
          ${loadingAnimation} 2s ease-in-out infinite;
      }
    `}

  ${({ $isLoading, $loadingSummary }) =>
    !$isLoading &&
    !$loadingSummary &&
    css`
      animation: fadeIn 0.2s ease-in-out forwards;
    `}

  h2 {
    color: var(--sc-color-title);
    margin-bottom: 8px;
  }

  @media (max-width: 768px) {
    margin: 30px 0;
  }
`

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`

const SubWrapper = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
`

const SubItemCount = styled.span`
  font-size: 14px;
  margin-left: 5px;
`

const TotalText = styled.span`
  font-size: 19px;
  font-weight: bold;
`

const TaxRate = styled.span`
  font-size: 14px;
  color: var(--sc-color-text-light-gray);
`

const EmptyMessage = styled.p`
  font-size: 16px;
  color: var(--sc-color-text-light-gray);
  margin-top: 20px;
  margin-bottom: 24px;
`

interface OrderSummaryProps {
  subtotal: string
  estimatedTaxes: string
  total: string
  totalQuantity: number
  zipCode: string
  $isLoading: boolean
  loadingSummary: boolean
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  estimatedTaxes,
  total,
  totalQuantity,
  zipCode,
  $isLoading,
  loadingSummary,
}) => {
  return (
    <OrderSummaryContainer
      $isLoading={$isLoading}
      $loadingSummary={loadingSummary}
    >
      {$isLoading ? null : (
        <>
          <h2>Order summary</h2>
          {totalQuantity > 0 ? (
            <>
              <SummaryItem>
                <SubWrapper>
                  Subtotal{' '}
                  <SubItemCount>
                    ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})
                  </SubItemCount>
                </SubWrapper>
                <span>{subtotal}</span>
              </SummaryItem>
              <SummaryItem>
                <span>Shipping</span>
                <span>Free</span>
              </SummaryItem>
              <SummaryItem>
                <span>Estimated taxes</span>
                <span>{estimatedTaxes}</span>
              </SummaryItem>
              <SummaryItem>
                <TaxRate>Based on {zipCode}</TaxRate>
              </SummaryItem>
              <SummaryItem>
                <TotalText>Total</TotalText>
                <TotalText>{total}</TotalText>
              </SummaryItem>
            </>
          ) : (
            <EmptyMessage>
              When you have items in your cart, you'll see the pricing
              information here.
            </EmptyMessage>
          )}
          <CheckoutButton disabled={totalQuantity === 0} />
        </>
      )}
    </OrderSummaryContainer>
  )
}

export default OrderSummary
