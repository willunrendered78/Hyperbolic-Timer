import { useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import EmptyState from '../components/EmptyState.jsx'
import InlineError from '../components/InlineError.jsx'
import { useWorkouts } from '../store/workoutsContext.js'
import './workouts.css'

export default function TagsScreen() {
  const { tags, addTag, renameTag, deleteTag, validateTagName } = useWorkouts()
  const [newName, setNewName] = useState('')
  const [addError, setAddError] = useState('')
  const [editing, setEditing] = useState(null) // { id, name }
  const [editError, setEditError] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)

  const onAdd = (event) => {
    event.preventDefault()
    const error = validateTagName(newName)
    setAddError(error)
    if (error) return
    addTag(newName)
    setNewName('')
  }

  const saveRename = (event) => {
    event.preventDefault()
    const error = validateTagName(editing.name, editing.id)
    setEditError(error)
    if (error) return
    renameTag(editing.id, editing.name)
    setEditing(null)
  }

  return (
    <main className="page">
      <header className="page__header">
        <h1 className="page__title">Tag management</h1>
        <p className="page__lead">Reusable tags you can add to any workout.</p>
      </header>

      <div className="page__layout">
        <section className="page__main" aria-label="Tags">
          {tags.length === 0 ? (
            <EmptyState message="No tags yet. Add one to organize your workouts." />
          ) : (
            <ul className="tag-grid">
              {tags.map((tag) => (
                <li key={tag.id} className="tag-tile">
                  {editing?.id === tag.id ? (
                    <form className="tag-tile__edit" onSubmit={saveRename}>
                      <label htmlFor={`rename-${tag.id}`} className="visually-hidden">
                        Rename {tag.name}
                      </label>
                      <input
                        id={`rename-${tag.id}`}
                        className="field__input"
                        value={editing.name}
                        maxLength={24}
                        autoFocus
                        onChange={(event) => setEditing({ ...editing, name: event.target.value })}
                      />
                      <button type="submit" className="btn btn--secondary btn--small">Save</button>
                      <button
                        type="button"
                        className="btn btn--secondary btn--small"
                        onClick={() => setEditing(null)}
                      >
                        Cancel
                      </button>
                      <InlineError message={editError} />
                    </form>
                  ) : (
                    <>
                      <span className="tag-tile__name">{tag.name}</span>
                      <button
                        type="button"
                        className="btn btn--secondary btn--small"
                        onClick={() => {
                          setEditError('')
                          setEditing({ id: tag.id, name: tag.name })
                        }}
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        className="btn btn--secondary btn--small"
                        aria-label={`Delete ${tag.name}`}
                        onClick={() => setPendingDelete(tag)}
                      >
                        ×
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="page__side">
          <form className="inline-add inline-add--stacked" onSubmit={onAdd} noValidate>
            <label htmlFor="add-tag" className="field__label">New tag</label>
            <input
              id="add-tag"
              className="field__input"
              value={newName}
              maxLength={24}
              onChange={(event) => setNewName(event.target.value)}
            />
            <InlineError message={addError} />
            <button type="submit" className="btn btn--primary">Add tag</button>
          </form>
        </aside>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete "${pendingDelete?.name ?? ''}"?`}
        message="This removes the tag, not the workout."
        confirmLabel="Delete tag"
        cancelLabel="Keep"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          deleteTag(pendingDelete.id)
          setPendingDelete(null)
        }}
      />
    </main>
  )
}
