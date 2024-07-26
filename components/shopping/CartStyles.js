import styled, { keyframes, css } from "styled-components"
import PropFilter from "../../utils/PropFilter"

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

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`

export const MainContent = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin: 0 16px;
`

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 75%;
  max-width: 75%;
`

export const OrderSummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 25%;
  max-width: 25%;
  margin-left: 16px;
`

export const TitleWrapper = styled.div`
  -webkit-box-align: center;
  align-items: center;
  display: flex;
  min-height: 49px;
  width: 100%;
`

export const Header = styled.h1`
  font-size: 29px;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--sc-color-title);
`

export const CartContainer = styled(PropFilter("div")(["loading"]))`
  border-radius: 4px;
  box-shadow: ${({ loading }) =>
    loading
      ? "rgba(0, 0, 0, 0.04) 0px 6px 12px 4px, rgba(0, 0, 0, 0.04) 0px 4px 10px 2px, rgba(0, 0, 0, 0.06) 0px 2px 8px, rgba(0, 0, 0, 0.04) 0px 2px 4px"
      : "initial"};
  margin-top: 16px;
  background-color: ${({ loading }) => (loading ? "#d6d6d6" : "initial")};
  height: ${({ loading }) => (loading ? "300px" : "initial")};
  ${({ loading }) =>
    loading &&
    css`
      animation: ${loadingAnimation} 2s ease-in-out infinite;
    `}

  @media (max-width: 768px) {
    margin: 10px;
  }
`

export const CartWrapper = styled.div`
  margin-left: initial;
  flex-basis: 100%;
  max-width: 100%;
  margin-bottom: 24px;
`
