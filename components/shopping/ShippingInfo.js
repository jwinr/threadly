import { useEffect, useState } from "react"
import LocationProvider from "@/utils/LocationProvider"

function addBusinessDays(startDate, businessDays) {
  let currentDate = new Date(startDate)

  while (businessDays > 0) {
    currentDate.setDate(currentDate.getDate() + 1)

    // Check if the current day is a weekend day (Saturday or Sunday)
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      businessDays--
    }
  }

  return currentDate
}

function ShippingInfo() {
  const [zipCode, setZipCode] = useState("")
  const [deliveryDate, setDeliveryDate] = useState("")
  const [dayOfWeek, setDayOfWeek] = useState("")
  const [returnDate, setReturnDate] = useState("")

  useEffect(() => {
    const fetchUserLocation = async () => {
      const userLocation = await LocationProvider()
      if (userLocation && userLocation.postal) {
        setZipCode(userLocation.postal)
      }
    }

    const calculateDeliveryDate = () => {
      const today = new Date()
      const businessDaysToAdd = 3
      const calculatedDeliveryDate = addBusinessDays(today, businessDaysToAdd)

      const deliveryOptions = {
        weekday: "short",
        month: "short",
        day: "numeric",
      }
      const formattedDeliveryDate = calculatedDeliveryDate.toLocaleDateString(
        "en-US",
        deliveryOptions
      )

      const dayOfWeekOption = { weekday: "long" }
      const formattedDayOfWeek = calculatedDeliveryDate.toLocaleDateString(
        "en-US",
        dayOfWeekOption
      )

      const returnOptions = { month: "short", day: "numeric" }
      const returnDate = new Date(calculatedDeliveryDate)
      returnDate.setDate(returnDate.getDate() + 15) // Add 15 days including non-business days
      const formattedReturnDate = returnDate.toLocaleDateString(
        "en-US",
        returnOptions
      )

      setDayOfWeek(formattedDayOfWeek)
      setDeliveryDate(formattedDeliveryDate)
      setReturnDate(formattedReturnDate)
    }

    fetchUserLocation()
    calculateDeliveryDate()
  }, [])

  return { zipCode, setZipCode, deliveryDate, dayOfWeek, returnDate }
}

export default ShippingInfo
