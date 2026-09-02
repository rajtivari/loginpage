import { useRef, useState } from 'react'

export function useOtpFocus(length = 6) {
  const [values, setValues] = useState(Array(length).fill(''))
  const inputRefs = useRef([])

  const focusIndex = (i) => {
    const el = inputRefs.current[i]
    if (el) el.focus()
  }

  const handleChange = (i, rawValue) => {
    const digit = rawValue.replace(/[^0-9]/g, '').slice(-1)
    setValues((prev) => {
      const next = [...prev]
      next[i] = digit
      return next
    })
    if (digit && i < length - 1) {
      focusIndex(i + 1)
    }
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !values[i] && i > 0) {
      focusIndex(i - 1)
    }
    if (e.key === 'ArrowLeft' && i > 0) {
      focusIndex(i - 1)
    }
    if (e.key === 'ArrowRight' && i < length - 1) {
      focusIndex(i + 1)
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length)
    if (!pasted) return
    e.preventDefault()
    const next = Array(length).fill('')
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    setValues(next)
    focusIndex(Math.min(pasted.length, length - 1))
  }

  const reset = () => {
    setValues(Array(length).fill(''))
    focusIndex(0)
  }

  const code = values.join('')
  const isComplete = code.length === length

  return {
    values,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    focusIndex,
    reset,
    code,
    isComplete
  }
}