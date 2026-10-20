import { Link, Navigate, useLocation } from 'react-router-dom'
import { formatClock } from '../utils/formatClock.js'
import './timer.css'

export default function CompleteScreen() {
  const { state } = useLocation()
  if (!state?.workout) return <Navigate to="/" replace />
  const { workout, elapsedMs } = state

  return (
    <main className="complete-screen">
      <h1 className="title-saiyan complete-screen__title">
        Training
        <br />
        complete
      </h1>
      <section className="complete-screen__summary">
        <h2 className="complete-screen__workout">{workout.title}</h2>
        <dl className="complete-screen__stats">
          <div>
            <dt>Elapsed</dt>
            <dd>{formatClock(elapsedMs)}</dd>
          </div>
          <div>
            <dt>Rounds</dt>
            <dd>{workout.rounds} / {workout.rounds}</dd>
          </div>
        </dl>
        <div className="timer-controls">
          <Link to="/" className="btn btn--primary">Back to home</Link>
          <Link to="/timer" state={{ workout }} className="btn btn--secondary">Train again</Link>
        </div>
      </section>
    </main>
  )
}
