import { Route, Routes } from 'react-router-dom'
import CompleteScreen from './screens/CompleteScreen.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import TimerScreen from './screens/TimerScreen.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/timer" element={<TimerScreen />} />
      <Route path="/complete" element={<CompleteScreen />} />
    </Routes>
  )
}

export default App
