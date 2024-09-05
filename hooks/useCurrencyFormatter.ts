import { useCallback } from 'react'

/**
 *
 * @returns {function} A function that takes a number and returns it formatted as USD currency.
 */
const useCurrencyFormatter = (): ((
  amount: number,
  isCents?: boolean
) => string) => {
  return useCallback((amount: number, isCents: boolean = false) => {
    const adjustedAmount = isCents ? amount / 100 : amount
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(adjustedAmount)
  }, [])
}

export default useCurrencyFormatter
