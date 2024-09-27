import React, { useContext, useState } from 'react'
import { CartContext } from '@/context/CartContext'
import styled from 'styled-components'
import LoaderSpin from '@/components/Loaders/LoaderSpin'
import Button from '@/components/Elements/Button'

interface AddToCartButtonProps {
  sizeVariantId: number
  quantity?: number
  productName: string | undefined
  loading?: boolean
}

const ButtonText = styled.span<{ $loading: boolean }>`
  opacity: ${({ $loading }) => ($loading ? 0 : 1)};
  transition: opacity 0.24s ease-in-out;
`

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  sizeVariantId,
  quantity = 1,
  productName,
  loading,
}) => {
  const { addToCart } = useContext(CartContext)!
  const [internalLoading, setInternalLoading] = useState<boolean>(false)

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  const handleAddToCart = async () => {
    setInternalLoading(true)
    try {
      await Promise.all([addToCart(sizeVariantId, quantity), delay(750)])
    } catch (error) {
      console.error('Failed to add to cart', error)
    } finally {
      setInternalLoading(false)
    }
  }

  return (
    <Button
      type="primary"
      size="medium"
      onPress={() => void handleAddToCart()}
      disabled={loading || internalLoading}
      aria-label={`Add ${productName} to cart`}
    >
      <ButtonText $loading={loading || internalLoading}>Add to cart</ButtonText>
      {(loading || internalLoading) && <LoaderSpin isLoading={true} />}
    </Button>
  )
}

export default AddToCartButton
