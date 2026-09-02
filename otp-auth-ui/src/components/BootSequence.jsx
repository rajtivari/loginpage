import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const BOOT_LINES = [
  { text: 'initializing secure channel...', dim: true },
  { text: 'handshake :: TLS_1.3', dim: true },
  { text: 'loading identity module', dim: true },
  { text: 'ACCESS_TERMINAL v2.0 // READY', dim: false }
]

export default function BootSequence({ onComplete }) {
  const containerRef = useRef(null)
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function run() {
      for (let i = 0; i < BOOT_LINES.length; i++) {
        if (cancelled) return
        await new Promise((res) => setTimeout(res, 260))
        setVisibleLines((n) => n + 1)
      }
      await new Promise((res) => setTimeout(res, 450))
      if (cancelled) return

      // Stale-closure-safe exit: read container fresh via ref, not a captured var
      const el = containerRef.current
      if (!el) {
        onComplete()
        return
      }
      gsap.to(el, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: 'power2.in',
        onComplete
      })
    }

    run()
    return () => {
      cancelled = true
    }
  }, [onComplete])

  return (
    <div className="boot-screen" ref={containerRef}>
      <div className="boot-lines">
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={line.dim ? 'line-dim' : ''}>
            {line.dim ? '> ' : '>> '}
            {line.text}
            {i === visibleLines - 1 && <span className="cursor-blink" />}
          </div>
        ))}
      </div>
    </div>
  )
}