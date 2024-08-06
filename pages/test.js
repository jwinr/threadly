import React, { useState } from "react"
import { useSpring, animated } from "@react-spring/web"

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  // Spring animation configuration
  const springProps = useSpring({
    height: isOpen ? "auto" : 0, // Animate height based on open/closed
    overflow: "hidden", // Hide content when closed
    config: {
      // Adjust springiness
      tension: 300,
      friction: 20,
    },
  })

  return (
    <div className="accordion">
      <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <h2>{title}</h2>
      </div>
      <animated.div style={springProps} className="accordion-content">
        {children}
      </animated.div>
    </div>
  )
}

export default Accordion
