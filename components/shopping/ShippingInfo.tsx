import { useEffect, useState } from 'react'
// import LocationProvider from '@/utils/LocationProvider';

function addBusinessDays(startDate: Date, businessDays: number): Date {
  const currentDate = new Date(startDate)
  let remainingBusinessDays = businessDays

  while (remainingBusinessDays > 0) {
    currentDate.setDate(currentDate.getDate() + 1)

    // Check if the current day is a weekend day (Saturday or Sunday)
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      remainingBusinessDays--
    }
  }

  return currentDate
}

interface ShippingInfoReturn {
  zipCode: string
  setZipCode: (zip: string) => void
  deliveryDate: string
  dayOfWeek: string
  returnDate: string
}

function ShippingInfo(): ShippingInfoReturn {
  const [zipCode, setZipCode] = useState<string>('12345')
  const [deliveryDate, setDeliveryDate] = useState<string>('')
  const [dayOfWeek, setDayOfWeek] = useState<string>('')
  const [returnDate, setReturnDate] = useState<string>('')

  useEffect(() => {
    /*const fetchUserLocation = async () => {
      const userLocation = await LocationProvider();
      if (userLocation && userLocation.postal) {
        setZipCode(userLocation.postal);
      }
    }*/

    const calculateDeliveryDate = () => {
      const today = new Date()
      const businessDaysToAdd = 3
      const calculatedDeliveryDate = addBusinessDays(today, businessDaysToAdd)

      const deliveryOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }
      const formattedDeliveryDate = calculatedDeliveryDate.toLocaleDateString(
        'en-US',
        deliveryOptions,
      )

      const dayOfWeekOption: Intl.DateTimeFormatOptions = { weekday: 'long' }
      const formattedDayOfWeek = calculatedDeliveryDate.toLocaleDateString('en-US', dayOfWeekOption)

      const returnOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
      const returnDate = new Date(calculatedDeliveryDate)
      returnDate.setDate(returnDate.getDate() + 15) // Add 15 days including non-business days
      const formattedReturnDate = returnDate.toLocaleDateString('en-US', returnOptions)

      setDayOfWeek(formattedDayOfWeek)
      setDeliveryDate(formattedDeliveryDate)
      setReturnDate(formattedReturnDate)
    }

    // fetchUserLocation();
    calculateDeliveryDate()
  }, [])

  return { zipCode, setZipCode, deliveryDate, dayOfWeek, returnDate }
}

export default ShippingInfo
