import { useAuth } from '../auth/AuthContext.jsx'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <section>
      <h1>Welcome back, {user.username}</h1>
      <p className="muted">Your flashcards will appear here.</p>
    </section>
  )
}
