import { useEffect, useRef, useState } from 'react'

/**
 * Countdown timer for OTP resend.
 * @param {number} seconds - total duration
 * @param {boolean} active - whether the timer should be running
 */
export function useOtpTimer(seconds, active) {
  const [remaining, setRemaining] = useState(seconds)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!active) return undefined

    setRemaining(seconds)
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, seconds])

  const reset = () => setRemaining(seconds)
  const progress = remaining / seconds

  return { remaining, progress, reset, expired: remaining === 0 }
}