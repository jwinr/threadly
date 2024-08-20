import styled, { keyframes, css } from "styled-components"
import PropFilter from "@/utils/PropFilter"

const FilteredDiv = PropFilter("div")(["shake"])
const FilteredButton = PropFilter("button")(["loading", "isInvalid"])

/* Shared Styles */
export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(40%);
  }
  to {
    opacity: 1;
    transform: translateX(45%);
  }
`

const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  20%, 60% {
    transform: translateX(-20px);
  }
  40% {
    transform: translateX(20px);
  }
  80% {
    transform: translateX(5px);
  }
`

export const spinnerFadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const authFadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const authFadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`

export const AuthPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: 100%;
`

export const AuthContainerWrapper = styled.div`
  height: 100%;
  flex-direction: row;
  width: 100%;
  margin: 0 auto;
  display: flex;
  position: relative;
  justify-content: center;
  padding-top: 56px;

  @media (max-width: 768px) {
    width: auto;
    margin: 0 16px;
  }
`

// Wrapper for the content inside AuthCard
interface AuthCardContentProps {
  authFadeIn?: boolean
  authFadeOut?: boolean
}

export const AuthCardContent = styled.div<AuthCardContentProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  opacity: 1 !important;
  ${(props) =>
    props.authFadeOut &&
    css`
      justify-content: center;
      position: relative;
      opacity: 1 !important; // This brings the spinner into view
      animation: ${authFadeOut} 0.3s forwards;
    `}
  ${(props) =>
    props.authFadeIn &&
    css`
      animation: ${authFadeIn} 0.3s forwards;
    `}
`

interface AuthCardProps {
  shake?: boolean
}
export const AuthCard = styled(FilteredDiv)<AuthCardProps>`
  display: flex;
  flex-direction: column;
  background-color: var(--sc-color-white);
  box-shadow: 0 15px 35px 0 rgba(60, 66, 87, 0.08),
    0 5px 15px 0 rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  align-items: center;
  min-height: 275px;
  padding: 24px 48px 64px 48px;
  position: relative;
  height: 100%;
  overflow: hidden;
  justify-content: center;

  ${(props) =>
    props.shake &&
    css`
      animation: ${shake} 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    `}

  @media (max-width: 1200px) {
  }

  @media (max-width: 768px) {
    padding: 24px 20px 64px 20px;
  }
`

export const FormContainerWrapper = styled.div`
  width: 540px;
  min-width: 540px;
  flex-direction: column;
  display: flex;
  max-height: 900px;

  @media (max-width: 768px) {
    width: 382px;
    min-width: auto;
  }
`

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const EntryWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
  margin: 10px 0;
`

interface EntryContainerProps {
  loading?: boolean
}

export const EntryContainer = styled.input<EntryContainerProps>`
  position: relative;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px;
  border-radius: 4px;
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  color: var(--sc-color-text);
  padding-right: 40px;
  transition: background 0.15s ease, border 0.15s ease, box-shadow 0.15s ease,
    color 0.15s ease;
  cursor: ${({ loading }) => (loading ? "default" : "text")};
  pointer-events: ${({ loading }) => (loading ? "none" : "auto")};
  background-color: ${({ loading }) =>
    loading ? "var(--sc-color-entry-disabled)" : "var(--sc-color-white)"};

  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: -3px;
    left: 10px;
    font-size: 13px;
    font-weight: 500;
    color: var(--sc-color-text);
  }

  &:focus {
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(58, 151, 212, 0.36) 0px 0px 0px 4px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(60, 66, 87, 0.16) 0px 0px 0px 1px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px;
    outline: none;
    transition: box-shadow 240ms;
  }
`

interface LabelProps {
  loading?: boolean
}

export const Label = styled.label<LabelProps>`
  box-shadow: none !important;
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: var(--sc-color-text);
  background-color: var(--sc-color-white);
  font-size: 16px;
  pointer-events: none;
  transition: all 0.3s ease;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background-color: ${({ loading }) =>
      loading ? "var(--sc-color-entry-disabled)" : "var(--sc-color-white)"};
    z-index: -1;
  }
`

export const HeaderText = styled.h1`
  font-weight: 600;
  font-size: 24px;
  margin: 20px 0;
`

export const ResetText = styled.a`
  display: inline-block;
  margin-top: 25px;
  margin-bottom: 30px;
  width: fit-content;
  align-self: center;
  align-content: baseline;
  font-weight: 500;
  font-size: 14px;
  color: var(--sc-color-carnation);

  &:hover {
    color: var(--sc-color-text-hover);
  }

  &:focus {
    box-shadow: var(--sc-shadow-link-focus);
    border-radius: 4px;
  }
`

export const AuthLoginLinkBox = styled.div`
  display: flex;
  bottom: 4px;
  position: absolute;
  background-color: var(--sc-color-register-background);
  width: calc(540px - 8px);
  min-height: 60px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 14px;
`

export const AuthLoginLink = styled.a`
  margin: 4px;
  font-weight: 500;
  color: var(--sc-color-carnation);

  &:hover {
    color: var(--sc-color-text-hover);
  }

  &:focus {
    box-shadow: var(--sc-shadow-link-focus);
    border-radius: 4px;
  }
`

interface AuthBtnProps {
  loading?: boolean
  isInvalid?: boolean
}

export const AuthBtn = styled(FilteredButton)<AuthBtnProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: var(--sc-color-white);
  min-height: 44px;
  padding: 0px 16px;
  width: 100%;
  text-align: center;
  font-weight: 500;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px, rgb(0 116 230 / 80%) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
  background-color: var(--sc-color-button-blue);
  transition: all 240ms;
  cursor: ${({ loading, isInvalid }) =>
    loading || isInvalid ? "default" : "pointer"};
  opacity: ${({ loading, isInvalid }) => (loading || isInvalid ? "0.5" : "1")};
  pointer-events: ${({ loading, isInvalid }) =>
    loading || isInvalid ? "none" : "auto"};

  &:focus {
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(58, 151, 212, 0.36) 0px 0px 0px 4px,
      rgba(0, 0, 0, 0.12) 0px 1px 1px 0px, rgb(43 121 255 / 80%) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
  }
`

export const ErrorMessage = styled.div`
  display: flex;
  color: var(--sc-color-red);
  align-self: flex-start;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 0;
  align-items: center;
  gap: 5px;
`

export const EntryBtnWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
`

export const ValidationMessage = styled.div`
  display: inline-flex;
  color: var(--sc-color-red);
  font-size: 14px;
  font-weight: 500;
  align-self: flex-start;
  gap: 5px;
  align-items: center;
`

export const PolicyContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: 12px;
  color: var(--sc-color-text-light-gray);
  margin: 30px 0px 0px;
  align-items: center;
  gap: 3px;

  span {
    padding-bottom: 5px;
  }

  a {
    color: var(--sc-color-link-blue);
    width: fit-content;
    padding: 5px;
  }

  a:hover {
    text-decoration: underline;
  }

  a:focus-visible {
    text-decoration: underline;
  }
`

export const LogoBox = styled.div`
  display: flex;
  align-items: center;
  width: 50px;

  svg {
    width: 100%;
    height: 100%;
  }
`

export const invalidStyle = {
  borderColor: "var(--sc-color-red)",
  boxShadow:
    "0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(0, 0, 0, 0.02), 0 0 0 1px var(--sc-color-red)",
  color: "var(--sc-color-red)",
} /* This one has to remain an object */

export const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  height: 100%;
  width: max-content;
  font-size: 14px;
  color: var(--sc-color-gray-500);
  transform: translateY(125%);
  animation: ${spinnerFadeIn} 0.7s ease-in-out;

  span {
    margin-top: 25px;
  }
`
