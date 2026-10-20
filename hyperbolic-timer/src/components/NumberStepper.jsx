import { useId } from 'react'
import InlineError from './InlineError.jsx'

export default function NumberStepper({ label, value, onChange, min, max = 999, error }) {
  const id = useId()
  const errorId = `${id}-error`
  const clamp = (n) => Math.min(max, Math.max(min, n))
  const current = Number(value) || 0

  return (
    <div className="field" data-invalid={Boolean(error)}>
      <label htmlFor={id} className="field__label">{label}</label>
      <div className="stepper">
        <button
          type="button"
          className="stepper__btn"
          aria-label={`Decrease ${label.toLowerCase()}`}
          disabled={current <= min}
          onClick={() => onChange(clamp(current - 1))}
        >
          −
        </button>
        <input
          id={id}
          className="stepper__input"
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) =>
            onChange(event.target.value === '' ? '' : Number(event.target.value))
          }
        />
        <button
          type="button"
          className="stepper__btn"
          aria-label={`Increase ${label.toLowerCase()}`}
          disabled={current >= max}
          onClick={() => onChange(clamp(current + 1))}
        >
          +
        </button>
      </div>
      <InlineError id={errorId} message={error} />
    </div>
  )
}
