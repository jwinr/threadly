import { useState, useCallback, useEffect } from "react"

/**
 * Provides control over the scrolling behavior of the document body.
 * It returns a boolean state indicating if scrolling is disabled and a function to toggle this state.
 *
 * @returns {[boolean, (state: boolean) => void]} A tuple containing:
 * - isScrollDisabled: A boolean indicating if scrolling is currently disabled.
 * - setIsScrollDisabled: A function to set the scroll state (true to disable scrolling, false to enable).
 */
const useScrollControl = (): [boolean, (state: boolean) => void] => {
  const [isScrollDisabled, setIsScrollDisabled] = useState(false)

  const disableScroll = useCallback(() => {
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflowY = "hidden"
    document.body.style.paddingRight = `${scrollBarWidth}px`
    document.body.style.touchAction = "none"
    document.body.style.overscrollBehavior = "none"
  }, [])

  const enableScroll = useCallback(() => {
    document.body.style.overflowY = "auto"
    document.body.style.paddingRight = "inherit"
    document.body.style.touchAction = "auto"
    document.body.style.overscrollBehavior = "auto"
  }, [])

  useEffect(() => {
    if (isScrollDisabled) {
      disableScroll()
    } else {
      enableScroll()
    }

    return () => {
      enableScroll()
    }
  }, [isScrollDisabled, disableScroll, enableScroll])

  return [isScrollDisabled, setIsScrollDisabled]
}

export default useScrollControl
