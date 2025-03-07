import React from 'react'
import { CartItem } from '@/context/CartContext'
import CartProductCard from '@/components/Shopping/CartProductCard'

interface CartItemsProps {
    cart: CartItem[]
    isMobileView: boolean
    deliveryDate: string
    handleQuantityChange: ((variantId: number, quantity: number) => Promise<void>) | undefined
    removeFromCart: ((variantId: number) => void) | undefined
}

export const CartItems = ({
    cart,
    isMobileView,
    deliveryDate,
    handleQuantityChange,
    removeFromCart
}: CartItemsProps) => {
    return cart.map((item, index) => (
        <CartProductCard
            key={item.variant_id}
            item={{
                product_id: item.product_id ?? 0,
                product_name: item.product_name ?? 'Unknown Product',
                product_slug: item.product_slug ?? 'unknown-slug',
                sku: item.sku ?? 'unknown-sku',
                product_image_url: item.product_image_url ?? '/images/default.png',
                product_price: item.product_price ?? 0,
                product_sale_price: item.product_sale_price,
                quantity: item.quantity,
                color: item.color,
                waist: item.waist,
                length: item.length,
                size: item.size,
                variant_id: item.variant_id,
            }}
            isMobileView={isMobileView}
            deliveryDate={deliveryDate}
            handleQuantityChange={(variantId, quantity) => handleQuantityChange?.(variantId, quantity)}
            removeFromCart={(variantId) => removeFromCart?.(variantId)}
            index={index}
        />
    ))
}