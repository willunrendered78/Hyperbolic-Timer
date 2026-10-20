import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import PhaseBadge from '../components/PhaseBadge.jsx'
import TimerControls from '../components/TimerControls.jsx'
import TimerDisplay from '../components/TimerDisplay.jsx'
import { defaultWorkout } from '../data/defaultWorkout.js'
import { useIntervalTimer } from '../hooks/useIntervalTimer.js'
import { formatClock } from '../utils/formatClock.js'
import './timer.css'

const PHASE_LABEL = { ready: 'Ready', work: 'Work', rest: 'Rest', paused: 'Paused' }

const CONFIRM_COPY = {
  exit: {
    title: 'Exit timer?',
    message: 'Your current interval will be lost.',
    confirmLabel: 'Exit timer',
  },
  reset: {
    title: 'Reset workout?',
    message: 'You will go back to round 1.',
    confirmLabel: 'Reset',
  },
}

export default function TimerScreen() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const workout = state?.workout ?? defaultWorkout
  const timer = useIntervalTimer(workout)
  const [confirming, setConfirming] = useState(null) // 'exit' | 'reset' | null

  const { status, elapsedMs } = timer
  useEffect(() => {
    if (status === 'complete') {
      navigate('/complete', { replace: true, state: { workout, elapsedMs } })
    }
  }, [status, navigate, workout, elapsedMs])

  const phase = status === 'running' ? timer.segment.type : status
  const next = timer.nextSegment
  const askConfirm = (kind) => {
    timer.pause()
    setConfirming(kind)
  }

  let roundLine = `Round ${timer.segment.round} of ${timer.totalRounds}`
  if (status === 'ready') {
    roundLine = `${workout.rounds} rounds • ${workout.workSeconds}s work • ${workout.restSeconds}s rest`
  } else if (status === 'paused') {
    roundLine = `Paused • ${roundLine}`
  }

  return (
    <main className="timer-screen" data-phase={phase}>
      <header className="timer-screen__header">
        <p className="timer-screen__brand">Hyperbolic Timer</p>
        <p className="timer-screen__workout">{workout.title}</p>
      </header>

      <PhaseBadge phase={PHASE_LABEL[phase]} />

      <TimerDisplay
        remainingMs={timer.remainingMs}
        progress={timer.progress}
        segmentKey={timer.segmentIndex}
      />

      <section className="timer-screen__panel">
        <p className="phase-title" aria-hidden="true">{PHASE_LABEL[phase]}</p>
        <p className="timer-screen__round">{roundLine}</p>
        <p className="timer-screen__next">
          {next
            ? `Next: ${next.type === 'work' ? 'Work' : 'Rest'} ${formatClock(next.ms)}`
            : 'Final interval'}
        </p>
        <TimerControls
          status={status}
          onStart={timer.start}
          onPause={timer.pause}
          onReset={() => askConfirm('reset')}
          onExit={() => askConfirm('exit')}
        />
      </section>

      <ConfirmDialog
        open={confirming !== null}
        {...(CONFIRM_COPY[confirming] ?? CONFIRM_COPY.exit)}
        onCancel={() => setConfirming(null)}
        onConfirm={() => {
          if (confirming === 'exit') navigate('/')
          else timer.reset()
          setConfirming(null)
        }}
      />
    </main>
  )
}
