import React, { useState } from "react"
import { useGeolocation } from "react-use"

const LocationCard = () => {
  const [showLocation, setShowLocation] = useState(false)
  const state = useGeolocation()

  const handleGetLocationClick = () => {
    setShowLocation(true)
  }

  return (
    <div>
      <button onClick={handleGetLocationClick}>Get My Location</button>

      {showLocation && (
        <div
          style={{
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            padding: "20px",
            margin: "20px",
          }}
        >
          <h3>Your Location:</h3>
          {JSON.stringify(state, null, 2)}
        </div>
      )}
    </div>
  )
}

export default LocationCard
