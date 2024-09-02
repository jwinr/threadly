import React, { useContext, useState } from 'react'
import { CartContext } from '@/context/CartContext'
import styled from 'styled-components'
import LoaderSpin from '@/components/Loaders/LoaderSpin'
import PropFilter from '@/utils/PropFilter'
import Button from '@/components/Elements/Button'

interface AddToCartButtonProps {
  sizeVariantId: string
  quantity?: number
  productName: string
}

const ButtonText = styled(PropFilter('span')(['loading']))<{
  loading: boolean
}>`
  opacity: ${({ loading }) => (loading ? 0 : 1)};
  transition: opacity 0.24s ease-in-out;
`

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  sizeVariantId,
  quantity = 1,
  productName,
}) => {
  const { addToCart } = useContext(CartContext)
  const [loading, setLoading] = useState<boolean>(false)

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      await Promise.all([addToCart(sizeVariantId, quantity), delay(750)])
    } catch (error) {
      console.error('Failed to add to cart', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="primary"
      size="medium"
      onPress={handleAddToCart}
      disabled={loading}
      aria-label={`Add ${productName} to cart`}
    >
      <ButtonText loading={loading}>Add to cart</ButtonText>
      <LoaderSpin loading={loading} />
    </Button>
  )
}

export default AddToCartButton