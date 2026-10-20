import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import EmptyState from '../components/EmptyState.jsx'
import WorkoutCard from '../components/WorkoutCard.jsx'
import { useWorkouts } from '../store/workoutsContext.js'
import './workouts.css'

export default function WorkoutsScreen() {
  const navigate = useNavigate()
  const { workouts, tags, deleteWorkout } = useWorkouts()
  const [filterId, setFilterId] = useState('all')
  const [pendingDelete, setPendingDelete] = useState(null)

  const visible = filterId === 'all' ? workouts : workouts.filter((w) => w.tagIds.includes(filterId))
  const tagName = (id) => tags.find((t) => t.id === id)?.name

  return (
    <main className="page">
      <header className="page__header">
        <h1 className="page__title">My workouts</h1>
        <p className="page__lead">Pick a saved routine and start training.</p>
      </header>

      <div className="page__layout">
        <section className="page__main" aria-label="Workouts">
          {visible.length === 0 ? (
            <EmptyState
              message={
                workouts.length === 0
                  ? 'No workouts yet. Create your first session.'
                  : 'No workouts have this tag.'
              }
            />
          ) : (
            <ul className="card-list">
              {visible.map((workout) => (
                <li key={workout.id}>
                  <WorkoutCard
                    workout={workout}
                    tagNames={workout.tagIds.map(tagName).filter(Boolean)}
                    onStart={() => navigate('/timer', { state: { workout } })}
                    onEdit={() => navigate(`/workouts/${workout.id}/edit`)}
                    onDelete={() => setPendingDelete(workout)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="page__side">
          <Link to="/workouts/new" className="btn btn--primary">Create workout</Link>
          {tags.length > 0 && (
            <div className="filter" role="group" aria-label="Filter by tag">
              <p className="filter__label">Filter</p>
              <div className="chip-row">
                {[{ id: 'all', name: 'All' }, ...tags].map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    className="tag-chip tag-chip--toggle"
                    aria-pressed={filterId === tag.id}
                    onClick={() => setFilterId(tag.id)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <Link to="/tags" className="text-link">Manage tags</Link>
        </aside>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete "${pendingDelete?.title ?? ''}"?`}
        message="This removes the workout. It cannot be undone."
        confirmLabel="Delete workout"
        cancelLabel="Keep"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          deleteWorkout(pendingDelete.id)
          setPendingDelete(null)
        }}
      />
    </main>
  )
}
