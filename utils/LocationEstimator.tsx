import React, { useEffect, useState } from 'react'
import axios from 'axios'

function LocationEstimator() {
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [zipCode, setZipCode] = useState<string | null>(null)

  // Get zip code from coordinates using Nominatim
  async function getZipCodeFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<string | null> {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      )

      if (response.status === 200) {
        const address = response.data.address
        return address.postcode
      }
    } catch (error) {
      console.error('Error retrieving zip code:', error)
    }

    return null // Return null if zip code is not found or an error occurs
  }

  useEffect(() => {
    // Function to handle successful geolocation
    function handleSuccess(position: GeolocationPosition) {
      const { latitude, longitude } = position.coords
      setLatitude(latitude)
      setLongitude(longitude)

      // Call the function to get the zip code from coordinates
      getZipCodeFromCoordinates(latitude, longitude)
        .then((result) => {
          setZipCode(result)
        })
        .catch((error) => {
          console.error('Error getting zip code:', error)
        })
    }

    // Function to handle geolocation error
    function handleError(error: GeolocationPositionError) {
      console.error('Location services error:', error.message)
    }

    // Check if geolocation is available in the browser
    if ('geolocation' in navigator) {
      // Request geolocation information
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError)
    } else {
      console.error(
        'Location services for shipping prices are not available in this browser.'
      )
    }
  }, [])

  return (
    <div className="cart-zipcode-text">
      {zipCode && <p>Based on {zipCode}</p>}
      {!latitude && !longitude && <p>Estimating taxes..</p>}
    </div>
  )
}

export default LocationEstimator
