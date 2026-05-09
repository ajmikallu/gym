import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * A React hook that determines if the current viewport is mobile-sized.
 * It listens to window resize events and uses a 768px breakpoint.
 * 
 * @returns {boolean} True if the viewport width is less than 768px, false otherwise.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
