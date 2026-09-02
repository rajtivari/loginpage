import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useOtpFocus } from '../hooks/useOtpFocus.js'

export default function OtpInput({ length = 6, onComplete, errorShake }) {
  const rowRef = useRef(null)
  const { values, inputRefs, handleChange, handleKeyDown, handlePaste, code, isComplete } =
    useOtpFocus(length)

  // Staggered box entrance
  useEffect(() => {
    const boxes = rowRef.current?.querySelectorAll('.otp-box')
    if (!boxes) return
    gsap.to(boxes, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.06,
      ease: 'back.out(1.7)'
    })
  }, [])

  useEffect(() => {
    if (isComplete) onComplete(code)
  }, [isComplete, code, onComplete])

  return (
    <div className="otp-row" ref={rowRef} onPaste={handlePaste}>
      {values.map((val, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className={`otp-box ${val ? 'filled' : ''} ${errorShake ? 'error' : ''}`}
          value={val}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          autoFocus={i === 0}
        />
      ))}
    </div>
  )
}