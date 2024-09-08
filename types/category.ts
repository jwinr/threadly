export interface Category {
  category_id: number
  name: string
  description?: string // Optional, as it can be nullable
  slug: string
  parent_category?: number // Optional, as it can reference itself
  changed_by?: number // Optional, as it can be nullable
}

export interface OrganizedCategory extends Category {
  subcategories: OrganizedCategory[] // Nested categories will be organized here
}

export interface FilterConditions {
  conditions: string // SQL conditions to filter the products
  values: unknown[] // Corresponding values for those conditions
}

export interface FilterAttributes {
  attributeType: string // e.g., "price", "color", "size"
  attributeValues: string[] | number[] // e.g., ["red", "blue"] or ["20-50"]
}

export interface AttributeRow {
  attribute_name: string
  attribute_value: string
}

export interface PriceRange {
  minPrice: number
  maxPrice: number
}

export interface Filters {
  price?: PriceRange[] // An array of price ranges (e.g., [ { minPrice: 20, maxPrice: 50 } ])
  attributes?: Record<string, string[]> // Key-value pairs of attributes and their selected values (e.g., color, size)
}
