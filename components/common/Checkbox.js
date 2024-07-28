import React from "react"
import styled, { keyframes } from "styled-components"

const waveAnimation = keyframes`
  50% {
    transform: scale(0.9);
  }
`

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  position: relative;
  font-size: 14px;
  font-weight: 500;
  color: var(--sc-color-blue);

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;

    &:focus + .cbx span:first-child {
      --s-focus-ring: 0 0 0 4px rgba(1, 150, 237, 0.36);
      outline: transparent solid 1px;
      box-shadow: var(--s-top-shadow),
        var(--s-keyline) 0 0 0 var(--s-keyline-width), var(--s-focus-ring),
        var(--s-box-shadow);
    }
  }

  .cbx {
    display: flex;
    align-items: center;
    padding: 6px 8px;
    border-radius: 6px;
    overflow: hidden;
    transition: background 0.2s ease;
    background: none;
    border: none;
    text-align: left;
    width: 100%;
    cursor: pointer;

    &:hover {
      background: #f8fafc;
      color: var(--sc-color-gray-900);
    }

    span {
      display: flex;
      align-items: center;
      vertical-align: middle;

      &:first-child {
        position: relative;
        width: 18px;
        height: 18px;
        border-radius: 4px;
        border: 1px solid #cccfdb;
        transition: all 0.2s ease;
        box-shadow: 0 1px 1px rgba(0, 16, 75, 0.05);
        background-color: white;

        svg {
          position: absolute;
          top: 3px;
          left: 2px;
          fill: none;
          stroke: #fff;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 16px;
          stroke-dashoffset: 16px;
          transition: all 0.3s ease;
          transition-delay: 0.1s;
        }
      }

      &:last-child {
        padding-left: 8px;
        line-height: 18px;
      }
    }
  }

  input:checked + .cbx span:first-child {
    background: var(--sc-color-blue);
    border-color: var(--sc-color-blue);
    animation: ${waveAnimation} 0.4s ease;

    &:active {
      --s-focus-ring: 0 0 0 4px rgba(1, 150, 237, 0.36);
      outline: transparent solid 1px;
      box-shadow: var(--s-top-shadow),
        var(--s-keyline) 0 0 0 var(--s-keyline-width), var(--s-focus-ring),
        var(--s-box-shadow);
    }

    svg {
      stroke-dashoffset: 0;
    }
  }

  @media screen and (max-width: 640px) {
    .cbx {
      width: 100%;
    }
  }
`

const Checkbox = ({ id, label, checked = false, onChange }) => {
  return (
    <CheckboxWrapper htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        tabIndex="0"
      />
      <div className="cbx">
        <span>
          <svg width="12px" height="10px" viewBox="0 0 12 10">
            <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
          </svg>
        </span>
        <span>{label}</span>
      </div>
    </CheckboxWrapper>
  )
}

export default Checkbox
