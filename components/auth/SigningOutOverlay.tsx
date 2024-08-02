import React from "react"

import styled from "styled-components"

import LoaderSpin from "../Loaders/LoaderSpin"

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const Popup = styled.div`
  display: flex;
  background-color: white;
  width: 250px;
  height: 100px;
  padding: 25px;
  border-radius: 8px;
  justify-content: center;
  font-size: 14px;
  color: var(--sc-color-text-loader);
  box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px,
    rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px,
    rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;

  span {
    align-self: flex-end;
  }
`

interface SigningOutOverlayProps {
  visible: boolean
}

const SigningOutOverlay: React.FC<SigningOutOverlayProps> = ({ visible }) => {
  if (!visible) return null

  return (
    <Overlay>
      <Popup>
        <LoaderSpin loading={visible} />
        <span>Signing out...</span>
      </Popup>
    </Overlay>
  )
}

export default SigningOutOverlay
