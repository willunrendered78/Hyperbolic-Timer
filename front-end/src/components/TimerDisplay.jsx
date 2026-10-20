import { formatClock } from '../utils/formatClock.js'

export default function TimerDisplay({ remainingMs, progress, segmentKey }) {
  return (
    <div className="timer-display">
      <svg className="timer-ring" viewBox="0 0 100 100" aria-hidden="true">
        <circle className="timer-ring__track" cx="50" cy="50" r="45" />
        {/* keyed per interval so the arc resets instantly instead of sweeping back */}
        <circle
          key={segmentKey}
          className="timer-ring__arc"
          cx="50"
          cy="50"
          r="45"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - progress}
        />
      </svg>
      <p className="timer-digits" role="timer" aria-live="off">
        {formatClock(remainingMs)}
      </p>
    </div>
  )
}
