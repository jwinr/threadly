// Keeping order-related features separate so if we add any new features, i.e. returns,
// we can extend this file without fragmenting the logic.

export interface OrderDetail {
  order_detail_id: number
  session_id: string
  payment_intent_id?: string // Optional, as it can be nullable
  payment_status?: string // Optional, as it can be nullable
  amount_total?: number // Optional
  currency?: string // Optional
  created_at: string
  shipping_status: string
  shipping_name?: string // Optional, as it can be nullable
  shipping_address_line1?: string // Optional
  shipping_address_line2?: string // Optional
  shipping_city?: string // Optional
  shipping_state?: string // Optional
  shipping_postal_code?: string // Optional
  shipping_country?: string // Optional
  fulfilled: boolean
  customer_id: number
  receipt_url?: string // Optional, as it can be nullable
  updated_at: string
  line_items?: OrderLineItem[] // Relationship with order line items
}

export interface OrderLineItem {
  order_line_item_id: number
  order_detail_id: number
  product_id?: number // Optional, as it can be nullable
  size_variant_id?: number // Optional
  quantity: number
  price: number
  product_name?: string // Optional
  product_image_url?: string // Optional
  created_at: string
}
