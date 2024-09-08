import { Category } from './category'

export interface Product {
  product_id?: number
  name?: string
  slug?: string
  description?: string
  brand_id?: number // Foreign key, but optional
  brand?: Brand // Optional relationship to the `Brand` interface
  category_id?: number // Foreign key to `categories`
  category?: Category // Optional relationship to the `Category` interface
  stripe_product_id?: string
  created_at?: string
  updated_at?: string
  specifications?: ProductSpecification[]
  color_variants?: ProductColorVariant[]
  size_variants?: ProductSizeVariant[]
  features?: ProductFeature[]
  questions?: ProductQuestion[]
  images?: ProductImage[]
  promotions?: ProductPromotion[]
  tags?: ProductTag[]
  reviews?: Review[]
  review_metadata?: ProductReviewsMetadata
  related_products?: RelatedProduct[]
}

export interface ProductSpecification {
  specification_id: number
  product_id: number
  specification_name: string
  specification_value: string
  created_at: string
}

export interface ProductSizeVariant {
  size_variant_id: number
  color_variant_id: number
  waist_attribute_id?: number // Optional, based on references
  length_attribute_id?: number // Optional, based on references
  stock: number
  quantity_sold: number
  price: number
  sale_price?: number // Optional
  stripe_price_id?: string // Optional
  stripe_sale_price_id?: string // Optional
  size_attribute_id?: number // Optional
}

export interface ProductColorVariant {
  color_variant_id: number
  product_id: number
  sku: string
  color_attribute_id: number
  created_at: string
  updated_at: string
  sizes?: ProductSizeVariant[]
}

export interface ProductImage {
  image_id?: number // Optional if it's not returned by the query
  image_url: string
  alt_text?: string // Optional if alt_text is nullable
  image_order?: number
  color_variant_id?: number // Optional, as it might not always reference a color variant
}

export interface ProductFeature {
  feature_id: number
  product_id: number
  feature_title: string
  feature_content: string
  created_at: string
}

export interface Attribute {
  attribute_id: number
  attribute_name: string
  attribute_value?: string
  attribute_type: string
  attribute_values: string
  color_swatch_url?: string // Optional, as it can be nullable
}

export interface ProductAnswer {
  answer_id: number
  question_id: number
  customer_id: number
  answer_text: string
  created_at: string
}

export interface ProductQuestion {
  question_id: number
  product_id: number
  customer_id: number
  question_text: string
  created_at: string
  answers?: ProductAnswer[]
}

export interface ProductPromotion {
  product_promotion_id: number
  product_id: number
  promotion_id: number
}

export interface ProductTag {
  product_tag_id: number
  product_id: number
  tag_id: number
  tag?: Tag // Optional relationship with the Tag interface
}

export interface RelatedProduct {
  product_id: number
  related_product_id: number
}

export interface Review {
  review_id?: number
  product_id?: number
  customer_id?: number
  rating: number // Integer between 1 and 5
  review_text?: string // Optional, as some reviews might not have text
  review_date?: string // Timestamp as a string
  status?: string
  images?: ReviewImage[] // Optional relationship with review images
}

export interface ReviewImage {
  review_image_id: number
  review_id: number
  image_url: string
  alt_text?: string // Optional, as it can be nullable
}

export interface ProductReviewsMetadata {
  product_id: number
  average_rating: number // Numeric(3, 2) in the database
  total_reviews: number
  last_review_date?: string // Optional, if no reviews have been left
}

export interface TagCategory {
  category_id: number
  name: string
  description?: string // Optional, as it can be nullable
}

export interface Tag {
  tag_id: number
  name: string
  description?: string // Optional, as it can be nullable
  category_id?: number // Optional if it is nullable in the database
  category?: TagCategory // Optional relationship with the category
}

export interface Brand {
  brand_id: number
  name: string
  description?: string // Optional, as it can be nullable
  image_url?: string // Optional, as it can be nullable
}

export interface ProductRow {
  product_id?: number
  name?: string
  slug?: string
  sku?: string
  color_attribute_id?: number
  color_variant_id?: number
  color_sku?: string
  color?: string
  color_swatch_url?: string
  waist?: string
  length?: string
  price?: number
  sale_price?: number
  image_url?: string
  alt_text?: string
  image_order?: number
  rating?: number[]
  brand_name?: string
  brand?: Brand
  created_at?: string
  updated_at?: string
  all_colors?: {
    color_variant_id: number
    color_sku: string
    color: string
    color_swatch_url?: string
  }[]
}

export interface OrganizedProduct extends Product {
  colors: OrganizedColorVariant[]
  rating: Review[]
}
export interface OrganizedColorVariant {
  color_variant_id: number
  color_sku: string
  color: string
  color_swatch_url?: string
  sizes: OrganizedSizeVariant[]
  images: ProductImage[]
  all_colors?: {
    color_variant_id: number
    color_sku: string
    color: string
    color_swatch_url?: string
  }[]
}

export interface OrganizedSizeVariant {
  waist?: string
  length?: string
  price?: number
  sale_price?: number
}
