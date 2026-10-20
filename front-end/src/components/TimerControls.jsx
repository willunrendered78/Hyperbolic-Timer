const PRIMARY_LABEL = { ready: 'Start', running: 'Pause', paused: 'Resume' }

export default function TimerControls({ status, onStart, onPause, onReset, onExit }) {
  const onPrimary = status === 'running' ? onPause : onStart

  return (
    <div className="timer-controls">
      <button type="button" className="btn btn--primary" onClick={onPrimary}>
        {PRIMARY_LABEL[status]}
      </button>
      {status !== 'ready' && (
        <button type="button" className="btn btn--secondary" onClick={onReset}>
          Reset
        </button>
      )}
      <button type="button" className="btn btn--secondary" onClick={onExit}>
        Exit
      </button>
    </div>
  )
}
