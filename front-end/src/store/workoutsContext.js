import { createContext, useContext } from 'react'

export const WorkoutsContext = createContext(null)

export function useWorkouts() {
  const context = useContext(WorkoutsContext)
  if (!context) throw new Error('useWorkouts must be used inside WorkoutsProvider')
  return context
}
