'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styled from 'styled-components'

interface SelectedAttributes {
  color: string
  color_name: string
  waist: string
  length: string
  size: string
}

interface SizeVariant {
  size_variant_id: string
  waist?: string
  length?: string
  size?: string
}

// TODO: Pull the interfaces out from the shared product file

interface ProductVariant {
  size: string
  length: string
  waist: string
  sku: string
  color: string
  color_swatch_url: string
  sizes: SizeVariant[]
}

interface Product {
  slug?: string
  selectedVariant?: ProductVariant
  variants?: ProductVariant[]
}

interface ProductAttributesProps {
  product: Product
  loading: boolean
  onSizeVariantSelected?: (sizeVariantId: string) => void
}

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

const LoaderAttributes = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100px;
  border-radius: 8px;
  background-color: #ededed;
  animation: loadingAnimation 1s ease-in-out infinite;
  animation-fill-mode: forwards;
`

const AttributeOptions = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
`

const ColorSwatch = styled.button<{ selected: boolean }>`
  width: 24px;
  height: 24px;
  border: 2px solid ${({ selected }) => (selected ? 'black' : '#ddd')};
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

const SizeOption = styled.button<{ selected: boolean }>`
  border: 1px solid ${({ selected }) => (selected ? 'black' : '#ddd')};
  background-color: ${({ selected }) => (selected ? '#fff' : '#f7f7f7')};
  color: ${({ selected }) => (selected ? 'black' : '#555')};
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition:
    border-color 0.3s ease-in-out,
    background-color 0.3s ease-in-out;

  &:hover {
    border-color: black;
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const ProductAttributes: React.FC<ProductAttributesProps> = ({
  product,
  loading,
  onSizeVariantSelected,
}) => {
  const router = useRouter()
  const [selectedAttributes, setSelectedAttributes] =
    useState<SelectedAttributes>({
      color: '',
      color_name: 'Select a color',
      waist: '',
      length: '',
      size: '',
    })
  const [hoveredColorName, setHoveredColorName] = useState('')

  useEffect(() => {
    if (product && product.selectedVariant) {
      const defaultAttributes = {
        color: product.selectedVariant.sku,
        color_name: product.selectedVariant.color,
        waist: product.selectedVariant.waist || '',
        length: product.selectedVariant.length || '',
        size: product.selectedVariant.size || '',
      }

      // Find the default size variant
      const defaultSizeVariant = product.variants?.find(
        (variant) => variant.sku === defaultAttributes.color
      )?.sizes[0]

      if (defaultSizeVariant) {
        defaultAttributes.waist = defaultSizeVariant.waist || ''
        defaultAttributes.length = defaultSizeVariant.length || ''
        defaultAttributes.size = defaultSizeVariant.size || ''
      }

      // Automatically default to a size variant if there's one available
      setSelectedAttributes(defaultAttributes)

      if (defaultSizeVariant && onSizeVariantSelected) {
        onSizeVariantSelected(defaultSizeVariant.size_variant_id)
      }
    }
  }, [product])

  const handleAttributeSelection = (
    attributeType: string,
    value: string,
    colorName?: string
  ) => {
    setSelectedAttributes((prevState) => ({
      ...prevState,
      [attributeType]: value,
      ...(attributeType === 'color' ? { color_name: colorName || '' } : {}),
    }))

    if (attributeType === 'color') {
      console.log('Selected color:', value)
      const selectedVariant = product?.variants?.find(
        (variant: { sku: string }) => variant.sku === value
      )
      if (selectedVariant) {
        console.log('Selected variant:', selectedVariant)
        router.push(`/products/${product?.slug}/${selectedVariant.sku}`)
      }
    }

    logSizeVariantId({ ...selectedAttributes, [attributeType]: value })
  }

  const availableSizes =
    product?.variants?.find(
      (variant) => variant.sku === selectedAttributes.color
    )?.sizes || []

  const handleSizeSelection = (attributeType: string, value: string) => {
    setSelectedAttributes((prevState) => ({
      ...prevState,
      [attributeType]: value,
    }))

    logSizeVariantId({ ...selectedAttributes, [attributeType]: value })
  }

  const logSizeVariantId = (attributes: SelectedAttributes) => {
    if (!attributes.waist && !attributes.size) {
      console.log('Waist or generic size not selected yet.')
      return
    }

    const selectedVariant = product?.variants?.find(
      (variant) => variant.sku === attributes.color
    )

    if (!selectedVariant) {
      console.log('No variant found for selected color:', attributes.color)
      return
    }

    const selectedSizeVariant = selectedVariant?.sizes.find((size) => {
      return (
        (size.waist === attributes.waist &&
          size.length === attributes.length) ||
        size.size === attributes.size
      )
    })

    if (!selectedSizeVariant) {
      console.log('No size variant found for selected attributes.')
      return
    }

    const sizeVariantId = selectedSizeVariant.size_variant_id
    console.log('Selected sizeVariantId:', sizeVariantId)

    if (onSizeVariantSelected) {
      onSizeVariantSelected(sizeVariantId)
    }
  }

  const handleMouseEnter = (colorName: string) => {
    setHoveredColorName(colorName)
  }

  const handleMouseLeave = () => {
    setHoveredColorName('')
  }

  if (loading) {
    return <LoaderAttributes />
  }

  return (
    <>
      <AttributeSelection>
        <h3>
          Color:{' '}
          <span className="color-name">
            {hoveredColorName || selectedAttributes.color_name}
          </span>
        </h3>
        <AttributeOptions>
          {product?.variants?.map((option, index) => (
            <div key={index}>
              <ColorSwatch
                aria-label={`${option.color}${
                  selectedAttributes.color === option.sku
                    ? ' currently selected'
                    : ''
                }`}
                selected={selectedAttributes.color === option.sku}
                onClick={() =>
                  handleAttributeSelection('color', option.sku, option.color)
                }
                onMouseEnter={() => handleMouseEnter(option.color)}
                onMouseLeave={handleMouseLeave}
                className={
                  selectedAttributes.color === option.sku ? 'selected' : ''
                }
              >
                {option.color_swatch_url && (
                  <Image
                    src={option.color_swatch_url}
                    alt={''}
                    width={24}
                    height={24}
                  />
                )}
              </ColorSwatch>
            </div>
          ))}
        </AttributeOptions>
      </AttributeSelection>

      {availableSizes.some((size) => size.waist && size.length) ? (
        <>
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
                    onClick={() =>
                      handleSizeSelection('waist', waistSize ?? '')
                    }
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
                .filter((value, index, self) => self.indexOf(value) === index)
                .map((lengthSize, index) => (
                  <SizeOption
                    key={index}
                    selected={selectedAttributes.length === lengthSize}
                    onClick={() =>
                      handleSizeSelection('length', lengthSize ?? '')
                    }
                  >
                    {lengthSize}
                  </SizeOption>
                ))}
            </AttributeOptions>
          </AttributeSelection>
        </>
      ) : (
        <AttributeSelection>
          <h3>Size</h3>
          <AttributeOptions>
            {availableSizes
              .map((size) => size.size)
              .filter(
                (value, index, self) => value && self.indexOf(value) === index
              )
              .map((genericSize, index) => (
                <SizeOption
                  key={index}
                  selected={selectedAttributes.size === genericSize}
                  onClick={() => handleSizeSelection('size', genericSize ?? '')}
                >
                  {genericSize}
                </SizeOption>
              ))}
          </AttributeOptions>
        </AttributeSelection>
      )}
    </>
  )
}

export default ProductAttributes
