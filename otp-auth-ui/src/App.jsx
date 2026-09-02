import { useRef, useState } from 'react'
import gsap from 'gsap'
import BootSequence from './components/BootSequence.jsx'
import GridBackground from './components/GridBackground.jsx'
import IdentityForm from './components/IdentityForm.jsx'
import VerifyStage from './components/VerifyStage.jsx'
import SuccessScreen from './components/SuccessScreen.jsx'

const STAGES = {
  BOOT: 'boot',
  IDENTITY: 'identity',
  VERIFY: 'verify',
  SUCCESS: 'success'
}

export default function App() {
  const [stage, setStage] = useState(STAGES.BOOT)
  const [identifier, setIdentifier] = useState('')
  const panelRef = useRef(null)

  const transitionTo = (nextStage, updates = () => {}) => {
    const el = panelRef.current
    if (!el) {
      updates()
      setStage(nextStage)
      return
    }
    gsap.to(el, {
      opacity: 0,
      y: -12,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        updates()
        setStage(nextStage)
        gsap.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
      }
    })
  }

  return (
    <div className="app-shell">
      <GridBackground />

      {stage === STAGES.BOOT && (
        <BootSequence onComplete={() => setStage(STAGES.IDENTITY)} />
      )}

      {stage !== STAGES.BOOT && (
        <div className="panel" ref={panelRef}>
          {stage === STAGES.IDENTITY && (
            <IdentityForm
              onSent={(id) => transitionTo(STAGES.VERIFY, () => setIdentifier(id))}
            />
          )}

          {stage === STAGES.VERIFY && (
            <VerifyStage
              identifier={identifier}
              onVerified={() => transitionTo(STAGES.SUCCESS)}
              onBack={() => transitionTo(STAGES.IDENTITY)}
            />
          )}

          {stage === STAGES.SUCCESS && <SuccessScreen identifier={identifier} />}
        </div>
      )}
    </div>
  )
}