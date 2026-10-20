import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import InlineError from '../components/InlineError.jsx'
import NumberStepper from '../components/NumberStepper.jsx'
import TagChip from '../components/TagChip.jsx'
import { useWorkouts } from '../store/workoutsContext.js'
import './workouts.css'

const BLANK = { title: '', rounds: 8, workSeconds: 20, restSeconds: 10, tagIds: [] }

const isWhole = (value, min) => Number.isInteger(value) && value >= min

function validate(draft) {
  const errors = {}
  if (!draft.title.trim()) errors.title = 'Workout title is required.'
  if (!isWhole(draft.rounds, 1)) errors.rounds = 'Rounds must be greater than zero.'
  if (!isWhole(draft.workSeconds, 1)) errors.workSeconds = 'Work seconds must be greater than zero.'
  if (!isWhole(draft.restSeconds, 0)) errors.restSeconds = 'Rest seconds cannot be negative.'
  return errors
}

export default function WorkoutFormScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { workouts, tags, saveWorkout, addTag, validateTagName } = useWorkouts()
  const existing = workouts.find((w) => w.id === id)
  const [draft, setDraft] = useState(existing ?? BLANK)
  const [errors, setErrors] = useState({})
  const [newTag, setNewTag] = useState('')
  const [tagError, setTagError] = useState('')

  if (id && !existing) return <Navigate to="/workouts" replace />

  const update = (field) => (value) => setDraft((d) => ({ ...d, [field]: value }))
  const toggleTag = (tagId) =>
    setDraft((d) => ({
      ...d,
      tagIds: d.tagIds.includes(tagId) ? d.tagIds.filter((t) => t !== tagId) : [...d.tagIds, tagId],
    }))

  const submitTag = () => {
    const error = validateTagName(newTag)
    setTagError(error)
    if (error) return
    const tag = addTag(newTag)
    setDraft((d) => ({ ...d, tagIds: [...d.tagIds, tag.id] }))
    setNewTag('')
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const found = validate(draft)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    saveWorkout({ ...draft, title: draft.title.trim() })
    navigate('/workouts')
  }

  return (
    <main className="page">
      <header className="page__header">
        <h1 className="page__title">{existing ? 'Edit workout' : 'Create workout'}</h1>
        <p className="page__lead">Defaults are set for a beginner Tabata. Change anything you like.</p>
      </header>

      <form className="form" onSubmit={onSubmit} noValidate>
        <div className="field" data-invalid={Boolean(errors.title)}>
          <label htmlFor="title" className="field__label">Workout title</label>
          <input
            id="title"
            className="field__input"
            value={draft.title}
            maxLength={60}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'title-error' : undefined}
            onChange={(event) => update('title')(event.target.value)}
          />
          <InlineError id="title-error" message={errors.title} />
        </div>

        <NumberStepper label="Rounds" min={1} value={draft.rounds} onChange={update('rounds')} error={errors.rounds} />
        <NumberStepper label="Work seconds" min={1} value={draft.workSeconds} onChange={update('workSeconds')} error={errors.workSeconds} />
        <NumberStepper label="Rest seconds" min={0} value={draft.restSeconds} onChange={update('restSeconds')} error={errors.restSeconds} />

        <div className="field" role="group" aria-labelledby="tags-label">
          <span id="tags-label" className="field__label">Tags</span>
          <div className="chip-row">
            {tags.map((tag) => (
              <TagChip
                key={tag.id}
                name={tag.name}
                selected={draft.tagIds.includes(tag.id)}
                onToggle={() => toggleTag(tag.id)}
              />
            ))}
          </div>
          <div className="inline-add">
            <label htmlFor="new-tag" className="visually-hidden">New tag name</label>
            <input
              id="new-tag"
              className="field__input"
              placeholder="New tag"
              value={newTag}
              maxLength={24}
              onChange={(event) => setNewTag(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  submitTag()
                }
              }}
            />
            <button type="button" className="btn btn--secondary" onClick={submitTag}>Add tag</button>
          </div>
          <InlineError message={tagError} />
        </div>

        <div className="form__actions">
          <button type="submit" className="btn btn--primary">Save workout</button>
          <button type="button" className="btn btn--secondary" onClick={() => navigate('/workouts')}>
            Cancel
          </button>
        </div>
      </form>
    </main>
  )
}
