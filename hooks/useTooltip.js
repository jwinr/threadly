import { useEffect } from "react"

const useTooltip = (infoButtonRef, setShowTooltip) => {
  // Handler to call when clicking outside of the tooltip container or scrolling
  useEffect(() => {
    const handleActionOutside = (event) => {
      if (
        infoButtonRef.current &&
        !infoButtonRef.current.contains(event.target)
      ) {
        setShowTooltip(false)
      }
    }

    const handleButtonClick = (event) => {
      if (
        infoButtonRef.current &&
        infoButtonRef.current.contains(event.target)
      ) {
        event.preventDefault()
        event.stopPropagation()
        setShowTooltip((prev) => !prev)
      }
    }

    document.addEventListener("click", handleActionOutside, true)
    window.addEventListener("scroll", handleActionOutside, true)
    infoButtonRef.current?.addEventListener("click", handleButtonClick, true)

    return () => {
      document.removeEventListener("click", handleActionOutside, true)
      window.removeEventListener("scroll", handleActionOutside, true)
      infoButtonRef.current?.removeEventListener(
        "click",
        handleButtonClick,
        true
      )
    }
  }, [infoButtonRef, setShowTooltip])
}

export default useTooltip
