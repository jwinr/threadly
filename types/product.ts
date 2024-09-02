export interface VariantSize {
  /** The regular price of the product size */
  price: number
  /** The sale price of the product size, if applicable */
  sale_price?: number
}

export interface ProductVariant {
  /** The sizes available for this variant */
  sizes: VariantSize[]
}

export interface ProductImage {
  /** The URL of the product image */
  image_url: string
  /** The alt text for the product image */
  alt_text: string
}

export interface ProductFeature {
  /** The title of the product feature */
  feature_title: string
  /** A list of details for the product feature */
  feature_contents: string[]
}

/** Represents a product with various attributes, variants, reviews, and images. */
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
  /** The rating given by the user (e.g., out of 5 stars) */
  rating: number
  /** The comment provided by the user */
  comment: string
  userId: string
  date: string
}
