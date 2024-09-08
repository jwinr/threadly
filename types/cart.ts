import { ProductSizeVariant, ProductColorVariant } from '@/types/product'

export interface Cart {
  cart_id: number
  customer_id: number
  created_at: string // Timestamp as a string
  last_updated: string // Timestamp as a string
  items?: CartItem[] // Relationship with cart items
}

// Extended for the stripeService component
export interface CartItem
  extends Pick<
      ProductSizeVariant,
      'stripe_price_id' | 'color_variant_id' | 'size_variant_id' | 'stock'
    >,
    Pick<ProductColorVariant, 'sku'> {
  cart_item_id: number
  cart_id: number
  variant_id: number | number[] // Variant ID, referencing the product variant
  quantity: number // Must be greater than 0
  created_at: string // Timestamp as a string
  updated_at: string // Timestamp as a string
}
