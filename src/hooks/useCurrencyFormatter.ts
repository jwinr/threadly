/**
 * A formatter hook that converts numbers to USD currency strings
 * @returns A function that formats numbers as USD currency
 * @example
 * const formatCurrency = useCurrencyFormatter();
 * formatCurrency(10.99) // returns "$10.99"
 * formatCurrency(1099, true) // returns "$10.99"
 */
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const useCurrencyFormatter = () => {
  return (amount: number, isCents = false) => {
    const adjustedAmount = isCents ? amount / 100 : amount
    return formatter.format(adjustedAmount)
  }
}

export default useCurrencyFormatter
