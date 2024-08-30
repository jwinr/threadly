"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import styled from "styled-components"

const AttributeSelection = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  font-size: 14px;

  h3 {
    margin-bottom: 10px;
    font-weight: bold;
    display: flex;
    align-items: center;
  }

  .color-name {
    margin-left: 10px;
    font-weight: normal;
    color: #333;
  }
`

const AttributeOptions = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
`

const ColorSwatch = styled.button`
  width: 24px;
  height: 24px;
  border: 2px solid ${({ selected }) => (selected ? "black" : "#ddd")};
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: border-color 0.3s ease-in-out;

  &:hover {
    border-color: black;
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const SizeOption = styled.button`
  border: 1px solid ${({ selected }) => (selected ? "black" : "#ddd")};
  background-color: ${({ selected }) => (selected ? "#fff" : "#f7f7f7")};
  color: ${({ selected }) => (selected ? "black" : "#555")};
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: border-color 0.3s ease-in-out, background-color 0.3s ease-in-out;

  &:hover {
    border-color: black;
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const ProductAttributes = ({ product, onSizeVariantSelected }) => {
  const router = useRouter()
  const [selectedAttributes, setSelectedAttributes] = useState({
    color: "",
    color_name: "Select a color",
    waist: "",
    length: "",
  })
  const [hoveredColorName, setHoveredColorName] = useState("")

  useEffect(() => {
    if (product && product.selectedVariant) {
      setSelectedAttributes({
        color: product.selectedVariant.color_sku,
        color_name: product.selectedVariant.color,
        waist: product.selectedVariant.waist,
        length: product.selectedVariant.length,
      })
    }
  }, [product])

  const handleAttributeSelection = (attributeType, value, colorName) => {
    setSelectedAttributes((prevState) => ({
      ...prevState,
      [attributeType]: value,
      ...(attributeType === "color" ? { color_name: colorName } : {}),
    }))

    if (attributeType === "color") {
      const selectedVariant = product?.variants?.find(
        (variant) => variant.color_sku === value
      )
      if (selectedVariant) {
        router.push(`/products/${product.slug}/${selectedVariant.color_sku}`)
      }
    }

    // After setting attributes, compute the sizeVariantId and log it
    logSizeVariantId({ ...selectedAttributes, [attributeType]: value })
  }

  const availableSizes =
    product?.variants?.find(
      (variant) => variant.color_sku === selectedAttributes.color
    )?.sizes || []

  const handleSizeSelection = (attributeType, value) => {
    setSelectedAttributes((prevState) => ({
      ...prevState,
      [attributeType]: value,
    }))

    // After setting the size, compute the sizeVariantId and log it
    logSizeVariantId({ ...selectedAttributes, [attributeType]: value })
  }

  const logSizeVariantId = (attributes) => {
    // Check if both waist and length have been selected
    if (!attributes.waist || !attributes.length) {
      console.log(
        `Waist and/or length not selected yet. Waist: ${attributes.waist}, Length: ${attributes.length}`
      )
      return
    }

    // Log the current selected attributes for debugging
    console.log("Attributes:", attributes)

    const selectedVariant = product?.variants?.find(
      (variant) => variant.color_sku === attributes.color
    )

    if (!selectedVariant) {
      console.log("No variant found for selected color:", attributes.color)
      return
    }

    // Log the selected variant for debugging
    console.log("Selected variant:", selectedVariant)

    // Log the sizes array
    console.log("Sizes array in selected variant:", selectedVariant.sizes)

    // Attempt to find the matching size variant based on waist and length
    const selectedSizeVariant = selectedVariant?.sizes.find((size) => {
      console.log(
        `Checking size - Waist: ${size.waist}, Length: ${size.length}, SizeVariantId: ${size.size_variant_id}`
      )
      return (
        size.waist === attributes.waist && size.length === attributes.length
      )
    })

    if (!selectedSizeVariant) {
      console.log(
        "No size variant found for selected waist and length:",
        attributes.waist,
        attributes.length
      )
      return
    }

    const sizeVariantId = selectedSizeVariant.size_variant_id
    console.log("Selected sizeVariantId:", sizeVariantId)

    if (onSizeVariantSelected) {
      onSizeVariantSelected(sizeVariantId)
    }
  }

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <>
      <AttributeSelection>
        <h3>
          Color:{" "}
          <span className="color-name">
            {hoveredColorName || selectedAttributes.color_name}
          </span>
        </h3>
        <AttributeOptions>
          {product?.variants?.map((option, index) => (
            <div key={index}>
              <ColorSwatch
                aria-label={option.color_name}
                selected={selectedAttributes.color === option.color_sku}
                onClick={() =>
                  handleAttributeSelection(
                    "color",
                    option.color_sku,
                    option.color_name
                  )
                }
                onMouseEnter={() => setHoveredColorName(option.color_name)}
                onMouseLeave={() => setHoveredColorName("")}
                className={
                  selectedAttributes.color === option.color_sku
                    ? "selected"
                    : ""
                }
              >
                {option.color_swatch_url && (
                  <Image
                    src={option.color_swatch_url}
                    alt={option.color_name}
                    width={24}
                    height={24}
                  />
                )}
              </ColorSwatch>
            </div>
          ))}
        </AttributeOptions>
      </AttributeSelection>

      <AttributeSelection>
        <h3>Waist</h3>
        <AttributeOptions>
          {availableSizes
            .map((size) => size.waist)
            .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
            .map((waistSize, index) => (
              <SizeOption
                key={index}
                selected={selectedAttributes.waist === waistSize}
                onClick={() => handleSizeSelection("waist", waistSize)}
              >
                {waistSize}
              </SizeOption>
            ))}
        </AttributeOptions>
      </AttributeSelection>

      <AttributeSelection>
        <h3>Length</h3>
        <AttributeOptions>
          {availableSizes
            .map((size) => size.length)
            .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
            .map((lengthSize, index) => (
              <SizeOption
                key={index}
                selected={selectedAttributes.length === lengthSize}
                onClick={() => handleSizeSelection("length", lengthSize)}
              >
                {lengthSize}
              </SizeOption>
            ))}
        </AttributeOptions>
      </AttributeSelection>
    </>
  )
}

export default ProductAttributes