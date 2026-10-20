import { Link } from 'react-router-dom'
import { useWorkouts } from '../store/workoutsContext.js'
import './timer.css'

export default function HomeScreen() {
  const { workouts } = useWorkouts()

  return (
    <main className="home-screen">
      <h1 className="title-saiyan">
        Hyperbolic
        <br />
        Timer
      </h1>
      <p className="home-screen__tagline">Train harder. Stay focused.</p>
      {workouts.length === 0 && (
        <p className="home-screen__empty">No workouts yet. Create your first session.</p>
      )}
      <div className="home-screen__actions">
        <Link to="/workouts" className="btn btn--primary">Start training</Link>
        <Link to="/workouts/new" className="btn btn--secondary">Create workout</Link>
      </div>
    </main>
  )
}
