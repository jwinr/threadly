"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import styled from "styled-components"

const AttributeSelection = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;

  h3 {
    margin-bottom: 10px;
    font-weight: bold;
  }
`

const AttributeOptions = styled.div`
  display: flex;
  flex-wrap: wrap;

  button {
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;

    &:hover {
      background-color: #f0f0f0;
    }

    &.selected {
      border-color: black;
    }

    &.disabled {
      border-color: #ddd;
      color: #ccc;
      cursor: not-allowed;
      &:hover {
        background-color: white;
      }
    }
  }
`

const ProductAttributes = ({ product }) => {
  const router = useRouter()
  const [selectedAttributes, setSelectedAttributes] = useState({
    size: "",
    color: product?.colorVariants?.[0]?.color_sku || "",
  })

  const handleAttributeSelection = (attributeType, value) => {
    setSelectedAttributes((prevState) => ({
      ...prevState,
      [attributeType]: value,
    }))

    if (attributeType === "color") {
      const selectedVariant = product.colorVariants.find(
        (variant) => variant.color_sku === value
      )
      if (selectedVariant) {
        router.push(`/products/${product.slug}/${selectedVariant.color_sku}`)
      }
    }
  }

  const groupVariantsByAttribute = (attributeType) => {
    if (!product || !product.colorVariants) return []
    return [
      ...new Set(
        product.colorVariants.map((variant) => variant[attributeType])
      ),
    ]
  }

  const colorOptions = groupVariantsByAttribute("color_sku")

  return (
    <>
      <AttributeSelection>
        <h3>Color</h3>
        <AttributeOptions>
          {colorOptions.map((option, index) => (
            <button
              key={index}
              className={selectedAttributes.color === option ? "selected" : ""}
              onClick={() => handleAttributeSelection("color", option)}
            >
              {option}
            </button>
          ))}
        </AttributeOptions>
      </AttributeSelection>
    </>
  )
}

export default ProductAttributes
