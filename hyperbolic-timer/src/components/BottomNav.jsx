import { NavLink } from 'react-router-dom'

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main">
      <NavLink to="/" end className="bottom-nav__link">Home</NavLink>
      <NavLink to="/workouts" className="bottom-nav__link">Workouts</NavLink>
    </nav>
  )
}
