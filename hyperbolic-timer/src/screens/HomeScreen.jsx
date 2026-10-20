import { Link } from 'react-router-dom'
import './timer.css'

export default function HomeScreen() {
  return (
    <main className="home-screen">
      <h1 className="title-saiyan">
        Hyperbolic
        <br />
        Timer
      </h1>
      <p className="home-screen__tagline">Train harder. Stay focused.</p>
      <Link to="/timer" className="btn btn--primary home-screen__cta">Start training</Link>
    </main>
  )
}
