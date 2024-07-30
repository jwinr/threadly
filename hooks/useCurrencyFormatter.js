import { useCallback } from "react"

const useCurrencyFormatter = () => {
  const formatCurrency = useCallback((amount) => {
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
