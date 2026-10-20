import { useEffect, useMemo, useReducer } from 'react'
import { WorkoutsContext } from './workoutsContext.js'

const STORAGE_KEY = 'hyperbolic-timer:v1'

const seedTags = ['HIIT', 'Strength', 'Tabata', 'Bodyweight'].map((name) => ({
  id: crypto.randomUUID(),
  name,
}))

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // fall through to defaults
  }
  return { workouts: [], tags: seedTags }
}

function reducer(state, action) {
  switch (action.type) {
    case 'saveWorkout': {
      const exists = state.workouts.some((w) => w.id === action.workout.id)
      return {
        ...state,
        workouts: exists
          ? state.workouts.map((w) => (w.id === action.workout.id ? action.workout : w))
          : [...state.workouts, action.workout],
      }
    }
    case 'deleteWorkout':
      return { ...state, workouts: state.workouts.filter((w) => w.id !== action.id) }
    case 'addTag':
      return { ...state, tags: [...state.tags, action.tag] }
    case 'renameTag':
      return {
        ...state,
        tags: state.tags.map((t) => (t.id === action.id ? { ...t, name: action.name } : t)),
      }
    case 'deleteTag':
      return {
        tags: state.tags.filter((t) => t.id !== action.id),
        workouts: state.workouts.map((w) => ({
          ...w,
          tagIds: w.tagIds.filter((tagId) => tagId !== action.id),
        })),
      }
    default:
      return state
  }
}

export function WorkoutsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage unavailable; data lives for this session only
    }
  }, [state])

  const value = useMemo(() => {
    const validateTagName = (name, ignoreId) => {
      const trimmed = name.trim()
      if (!trimmed) return 'Tag name is required.'
      const taken = state.tags.some(
        (t) => t.id !== ignoreId && t.name.toLowerCase() === trimmed.toLowerCase(),
      )
      return taken ? 'That tag already exists.' : ''
    }

    return {
      workouts: state.workouts,
      tags: state.tags,
      validateTagName,
      saveWorkout: (workout) =>
        dispatch({
          type: 'saveWorkout',
          workout: {
            ...workout,
            id: workout.id ?? crypto.randomUUID(),
            createdAt: workout.createdAt ?? new Date().toISOString(),
          },
        }),
      deleteWorkout: (id) => dispatch({ type: 'deleteWorkout', id }),
      addTag: (name) => {
        const tag = { id: crypto.randomUUID(), name: name.trim() }
        dispatch({ type: 'addTag', tag })
        return tag
      },
      renameTag: (id, name) => dispatch({ type: 'renameTag', id, name: name.trim() }),
      deleteTag: (id) => dispatch({ type: 'deleteTag', id }),
    }
  }, [state])

  return <WorkoutsContext.Provider value={value}>{children}</WorkoutsContext.Provider>
}
