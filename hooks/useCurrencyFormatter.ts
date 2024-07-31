import { useCallback } from "react"

/**
 *
 * @returns {function} A function that takes a number and returns it formatted as USD currency.
 */
const useCurrencyFormatter = (): ((amount: number) => string) => {
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }, [])

  return formatCurrency
}

export default useCurrencyFormatter
