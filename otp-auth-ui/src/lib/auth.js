/**
 * Auth layer for the OTP flow.
 *
 * This ships in DEMO MODE: any identifier is "accepted" and the valid code
 * is always 123456, so you can see the full animated flow with zero backend.
 *
 * To go live, replace requestOtp/verifyOtp with one of:
 *
 * --- Firebase Phone Auth ---
 *   import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
 *   const confirmationResult = await signInWithPhoneNumber(auth, phone, recaptchaVerifier)
 *   // verify: confirmationResult.confirm(code)
 *
 * --- Supabase Email/Phone OTP ---
 *   import { createClient } from '@supabase/supabase-js'
 *   await supabase.auth.signInWithOtp({ email })
 *   // verify: supabase.auth.verifyOtp({ email, token: code, type: 'email' })
 *
 * --- Custom backend (Twilio Verify / Resend) ---
 *   POST /api/otp/send   { identifier }
 *   POST /api/otp/verify { identifier, code }
 */

const DEMO_CODE = '123456'
const SIMULATED_LATENCY_MS = 900

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function requestOtp(identifier) {
  await wait(SIMULATED_LATENCY_MS)
  // eslint-disable-next-line no-console
  console.info(`[demo] OTP for ${identifier}: ${DEMO_CODE}`)
  return { sent: true }
}

export async function verifyOtp(identifier, code) {
  await wait(600)
  if (code !== DEMO_CODE) {
    throw new Error('ERR_INVALID_CODE :: check and try again')
  }
  return { verified: true, identifier }
}