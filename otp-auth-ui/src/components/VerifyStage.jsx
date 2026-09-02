import { useState } from 'react'
import OtpInput from './OtpInput.jsx'
import TimerRing from './TimerRing.jsx'
import { useOtpTimer } from '../hooks/useOtpTimer.js'
import { verifyOtp, requestOtp } from '../lib/auth.js'

const RESEND_SECONDS = 30

export default function VerifyStage({ identifier, onVerified, onBack }) {
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)
  const [otpKey, setOtpKey] = useState(0) // remount OtpInput to clear boxes on resend
  const { remaining, progress, reset, expired } = useOtpTimer(RESEND_SECONDS, true)

  const handleComplete = async (code) => {
    setChecking(true)
    setError('')
    try {
      await verifyOtp(identifier, code)
      onVerified()
    } catch (err) {
      setError(err.message || 'ERR_INVALID_CODE :: check and try again')
      setOtpKey((k) => k + 1)
    } finally {
      setChecking(false)
    }
  }

  const handleResend = async () => {
    if (!expired) return
    await requestOtp(identifier)
    reset()
    setOtpKey((k) => k + 1)
    setError('')
  }

  return (
    <div>
      <div className="eyebrow">
        <span className="dot" />
        VERIFY_CODE
      </div>
      <h1 className="title">CHECK_YOUR_INBOX</h1>
      <p className="subtitle">
        6-digit code sent to <strong>{identifier}</strong>. Demo mode: use{' '}
        <code>123456</code>.
      </p>

      <OtpInput key={otpKey} onComplete={handleComplete} errorShake={!!error} />
      {error && <p className="error-text">{error}</p>}
      {checking && <p className="mono-dim" style={{ marginTop: 4 }}>verifying...</p>}

      <div className="timer-row">
        <span>{expired ? 'code expired' : `expires in ${remaining}s`}</span>
        <div className="center-col">
          <TimerRing progress={progress} />
        </div>
        <button className="resend-btn" onClick={handleResend} disabled={!expired}>
          resend
        </button>
      </div>

      <button type="button" className="back-link" onClick={onBack}>
        ← change identifier
      </button>
    </div>
  )
}