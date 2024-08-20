import styled from "styled-components"
import PropFilter from "@/utils/PropFilter"

const FilteredButton = PropFilter("button")(["isOpen"])

export const Dropdown = styled.div`
  position: absolute;
  top: 63px;
  width: 275px;
  background-color: var(--sc-color-white);
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
  padding-bottom: 8px;
  overflow: hidden;
  z-index: -100;
  box-sizing: content-box;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), height 340ms ease;
  left: ${(props) => props.left}px;
  transform: translateY(-800px); // Initially move it up slightly and hide

  &.visible {
    visibility: visible;
    transform: translateY(0); // Slide it into place
  }

  &.invisible {
    transform: translateY(-800px);
  }

  &.initial-hidden {
    transform: translateY(-800px);
    transition: none;
  }

  @media (max-width: 768px) {
    top: 106px;
  }
`
export const Button = styled(FilteredButton)`
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  color: var(--sc-color-text);
  padding-left: 8px;
  padding-right: 8px;
  height: 100%;
  border-radius: 10px;
  align-items: center;
  background-color: ${({ isOpen }) => (isOpen ? "#f7f7f7" : "#fff")};
  display: flex;
  align-items: center;
  transition: background-color 0.2s;

  svg {
    fill: var(--sc-color-icon);

    @media (max-width: 768px) {
      width: 20px;
      height: 20px;
    }
  }

  &:hover {
    background-color: var(--sc-color-white-highlight);

    svg {
      opacity: 1;
    }
  }

  &:focus-visible {
    svg {
      opacity: 1;
    }
  }

  &:hover .arrow-icon,
  &.arrow-icon-visible .arrow-icon svg {
    opacity: 1;
  }

  &:focus:not(:focus-visible) {
    --s-focus-ring: 0;
  }

  &.initial-hidden {
    opacity: 0;
    transform: translateY(20px);
    transition: none;
  }

  @media (max-width: 768px) {
    font-size: 30px;
    height: 44px;
    width: 44px;
    padding: 0;
    justify-content: center;
    background-color: transparent;

    &:active {
      background-color: var(--sc-color-white-highlight);
    }
  }
`

export const BtnText = styled.div`
  padding: 0 5px;
  color: var(--sc-color-gray-700);

  @media (max-width: 768px) {
    display: none;
  }
`

export const Menu = styled.div`
  width: 100%;

  & a:focus {
    text-decoration: underline;
    outline: none;
  }
`

export const MenuItem = styled.li`
  height: 50px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
  font-size: 16px;
  color: #000;
  width: 100%;
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    background-color: rgb(245, 246, 248);
  }

  &:focus:not(:focus-visible) {
    --s-focus-ring: 0;
    box-shadow: none;
  }

  span {
    margin-left: 5px;
  }
`

export const ListHeader = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  transition: background var(--speed);
  font-size: 18px;
  font-weight: 600;
  color: #000;
  width: 100%;
  text-decoration: none;

  &:focus {
    text-decoration: underline;
    outline: none;
  }
`
