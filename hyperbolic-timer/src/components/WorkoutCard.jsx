import TagChip from './TagChip.jsx'

export default function WorkoutCard({ workout, tagNames, onStart, onEdit, onDelete }) {
  return (
    <article className="workout-card">
      <div className="workout-card__info">
        <h2 className="workout-card__title">{workout.title}</h2>
        <p className="workout-card__meta">
          {workout.rounds} rounds • {workout.workSeconds}s work • {workout.restSeconds}s rest
        </p>
        {tagNames.length > 0 && (
          <div className="chip-row">
            {tagNames.map((name) => <TagChip key={name} name={name} />)}
          </div>
        )}
      </div>
      <div className="workout-card__actions">
        <button type="button" className="btn btn--primary" onClick={onStart}>Start</button>
        <button type="button" className="btn btn--secondary btn--small" onClick={onEdit}>Edit</button>
        <button type="button" className="btn btn--secondary btn--small" onClick={onDelete}>Delete</button>
      </div>
    </article>
  )
}
