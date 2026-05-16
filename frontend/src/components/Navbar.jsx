import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthContext.jsx'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    signOut()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">Flashcards</Link>
      <nav className="navbar-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/flashcards">Cards</Link>
            <span className="navbar-user">{user.username}</span>
            <button type="button" className="link-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}
