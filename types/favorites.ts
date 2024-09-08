export interface Favorite {
  favorites_id: number
  customer_id: number
  created_at: string // Timestamp as a string
  items?: FavoriteItem[] // Relationship with favorite items
}

export interface FavoriteItem {
  favorites_item_id: number
  favorites_id?: number
  variant_id?: number
  quantity: number
  color_variant_id?: number // References a product color variant
}
