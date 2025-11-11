import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const navItem = 'px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-50 hover:text-blue-700 transition-colors';
  const active = ({ isActive }) => isActive ? `${navItem} text-blue-700 bg-blue-50` : `${navItem} text-gray-700`;

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
        <Link to="/" className="font-semibold text-blue-700">LearnMate</Link>
        <nav className="flex items-center gap-1">
          <NavLink to="/" className={active}>Home</NavLink>
          <NavLink to="/courses" className={active}>Courses</NavLink>
          <NavLink to="/practice" className={active}>Practice</NavLink>
          <NavLink to="/quiz" className={active}>Quiz</NavLink>
          <NavLink to="/notes" className={active}>Notes</NavLink>
          <NavLink to="/profile" className={active}>Profile</NavLink>
        </nav>
      </div>
    </header>
  )
}
