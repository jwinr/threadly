import { render, screen, fireEvent } from '@testing-library/react'
import { jest } from '@jest/globals'
import '@testing-library/jest-dom';
import ProductAttributes from '../ProductAttributes'
import { useRouter } from 'next/navigation'
import { Product } from '@/types/product'
import { JSX, ClassAttributes, ImgHTMLAttributes } from 'react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}))

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLImageElement> & ImgHTMLAttributes<HTMLImageElement>) => {
        // eslint-disable-next-line jsx-a11y/alt-text
        return <img {...props} />
    },
}))

describe('ProductAttributes', () => {
    const mockProduct: Product = {
        slug: 'test-product',
        variants: [
            {
                sku: 'SKU1',
                color: 'Blue',
                color_swatch_url: '/blue-swatch.jpg',
                size: 'S',
                length: '',
                waist: '',
                sizes: [
                    {
                        size: 'S',
                        waist: '',
                        length: '',
                        size_variant_id: '1'
                    }
                ]
            },
            {
                sku: 'SKU2',
                color: 'Black',
                color_swatch_url: '/black-swatch.jpg',
                size: 'M',
                length: '',
                waist: '',
                sizes: [
                    {
                        size: 'M',
                        waist: '',
                        length: '',
                        size_variant_id: '2'
                    }
                ]
            }
        ]
    }

    const mockRouter = {
        push: jest.fn()
    }

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter)
    })

    test('renders color swatches correctly', () => {
        render(<ProductAttributes product={mockProduct} loading={false} />)
        expect(screen.getByText('Color:')).toBeInTheDocument()
        expect(screen.getAllByRole('button')).toHaveLength(3)
    })

    test('handles color selection', () => {
        render(<ProductAttributes product={mockProduct} loading={false} />)
        const colorSwatch = screen.getByLabelText('Black')
        fireEvent.click(colorSwatch)
        expect(mockRouter.push).toHaveBeenCalledWith('/products/test-product/SKU2')
    })

    test('calls onSizeVariantSelected when size is selected', () => {
        const onSizeVariantSelected = jest.fn()
        render(
            <ProductAttributes
                product={mockProduct}
                loading={false}
                onSizeVariantSelected={onSizeVariantSelected}
            />
        )

        const waistButton = screen.getByText('S')
        fireEvent.click(waistButton)
        expect(onSizeVariantSelected).toHaveBeenCalled()
    })

    test('shows loading state', () => {
        render(<ProductAttributes product={mockProduct} loading={true} />)
        expect(screen.getByTestId('loader-attributes')).toBeInTheDocument()
    })
})