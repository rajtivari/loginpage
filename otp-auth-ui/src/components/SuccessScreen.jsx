import { useEffect, useRef, useState } from 'react'

const TARGET = 'ACCESS_GRANTED'
const CHARS = '!<>-_\\/[]{}—=+*^?#'

export default function SuccessScreen({ identifier }) {
  const [display, setDisplay] = useState('')
  const frame = useRef(0)

  useEffect(() => {
    let raf
    const iterations = 12

    function tick() {
      frame.current += 1
      const progress = Math.min(frame.current / iterations, 1)
      const revealCount = Math.floor(progress * TARGET.length)

      const next = TARGET.split('')
        .map((ch, i) => {
          if (i < revealCount) return ch
          if (ch === '_') return '_'
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join('')

      setDisplay(next)

      if (progress < 1) {
        raf = setTimeout(tick, 45)
      }
    }
    tick()
    return () => clearTimeout(raf)
  }, [])

  return (
    <div className="success-screen">
      <div className="success-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 13l4 4L19 7"
            stroke="var(--cyan)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="decode-text">{display}</p>
      <p className="mono-dim" style={{ marginTop: 12 }}>
        {identifier} verified — session established
      </p>
    </div>
  )
}