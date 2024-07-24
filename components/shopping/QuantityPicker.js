import React from "react"
import styled from "styled-components"

const QuantityPickerWrapper = styled.div`
  display: flex;
  align-items: center;
`

const QuantityLabel = styled.span`
  font-size: 14px;
  margin-right: 10px;
`

const QuantitySelect = styled.select`
  border: 1px solid #ccc;
  font-size: 14px;
  border-radius: 4px;
  padding: 2px;
`

const QuantityPicker = ({ quantity, onQuantityChange }) => {
  return (
    <QuantityPickerWrapper>
      <QuantityLabel>Quantity:</QuantityLabel>
      <QuantitySelect
        value={quantity}
        onChange={(e) => onQuantityChange(Number(e.target.value))}
      >
        {[...Array(10).keys()].map((num) => (
          <option key={num + 1} value={num + 1}>
            {num + 1}
          </option>
        ))}
      </QuantitySelect>
    </QuantityPickerWrapper>
  )
}

export default QuantityPicker
