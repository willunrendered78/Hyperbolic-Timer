export default function PhaseBadge({ phase }) {
  return (
    <p className="phase-badge" role="status" aria-live="polite">
      {phase}
    </p>
  )
}
