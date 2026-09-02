import { useRef, useState } from 'react'
import gsap from 'gsap'
import { requestOtp } from '../lib/auth.js'

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const isValidPhone = (v) => /^\+?[0-9]{10,14}$/.test(v)

export default function IdentityForm({ onSent }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const btnRef = useRef(null)

  const spawnRipple = (e) => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const ripple = document.createElement('span')
    ripple.className = 'ripple'
    ripple.style.left = `${e.clientX - rect.left}px`
    ripple.style.top = `${e.clientY - rect.top}px`
    btn.appendChild(ripple)
    setTimeout(() => ripple.remove(), 600)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const trimmed = value.trim()
    if (!isValidEmail(trimmed) && !isValidPhone(trimmed)) {
      setError('ERR_INVALID_FORMAT :: enter a valid email or phone number')
      gsap.fromTo('.field', { x: 0 }, { x: 6, duration: 0.08, yoyo: true, repeat: 3 })
      return
    }

    setLoading(true)
    try {
      await requestOtp(trimmed)
      onSent(trimmed)
    } catch (err) {
      setError(err.message || 'ERR_DISPATCH_FAILED :: try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="eyebrow">
        <span className="dot" />
        SECURE_LOGIN
      </div>
      <h1 className="title">ACCESS_TERMINAL</h1>
      <p className="subtitle">
        Enter your email or phone number. We'll transmit a one-time code to verify it's you.
      </p>

      <div className="field">
        <label className="field-label" htmlFor="identifier">
          ENTER_IDENTIFIER
        </label>
        <input
          id="identifier"
          className="terminal-input"
          placeholder="you@example.com or +91XXXXXXXXXX"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          autoFocus
        />
        <div className="input-underline" />
        {error && <p className="error-text">{error}</p>}
      </div>

      <button
        ref={btnRef}
        type="submit"
        className="btn-primary"
        disabled={loading}
        onClick={spawnRipple}
      >
        {loading ? 'TRANSMITTING...' : 'SEND_CODE'}
      </button>
    </form>
  )
}