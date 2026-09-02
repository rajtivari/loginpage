const RADIUS = 16
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function TimerRing({ progress }) {
  const offset = CIRCUMFERENCE * (1 - progress)

  return (
    <svg width="40" height="40" className="ring">
      <circle className="track" cx="20" cy="20" r={RADIUS} />
      <circle
        className="progress"
        cx="20"
        cy="20"
        r={RADIUS}
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
      />
    </svg>
  )
}