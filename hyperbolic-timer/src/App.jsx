import { Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell.jsx'
import CompleteScreen from './screens/CompleteScreen.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import TagsScreen from './screens/TagsScreen.jsx'
import TimerScreen from './screens/TimerScreen.jsx'
import WorkoutFormScreen from './screens/WorkoutFormScreen.jsx'
import WorkoutsScreen from './screens/WorkoutsScreen.jsx'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/workouts" element={<WorkoutsScreen />} />
        <Route path="/workouts/new" element={<WorkoutFormScreen />} />
        <Route path="/workouts/:id/edit" element={<WorkoutFormScreen />} />
        <Route path="/tags" element={<TagsScreen />} />
      </Route>
      <Route path="/timer" element={<TimerScreen />} />
      <Route path="/complete" element={<CompleteScreen />} />
    </Routes>
  )
}

export default App
