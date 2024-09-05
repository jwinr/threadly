export interface SizeVariant {
  size_variant_id: string
  waist?: string
  length?: string
  size?: string
}

export interface ProductVariant {
  size: string
  length: string
  waist: string
  color_sku: string
  color: string
  color_swatch_url: string
  sizes: SizeVariant[]
}

export interface ProductImage {
  image_url: string
  alt_text: string
}

export interface ProductFeature {
  feature_title: string
  feature_contents: string[]
}

export interface Product {
  name: string
  product_id: string
  description: string
  features: ProductFeature[]
  variants?: ProductVariant[]
  reviews: Review[]
  images: ProductImage[]
}

export interface ProductDescriptionProps {
  description: string
}

export interface ProductOverviewProps {
  product: Product
  loading: boolean
}

export interface Review {
  rating: number
  comment: string
  userId: string
  date: string
}
