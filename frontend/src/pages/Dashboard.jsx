import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { listFlashcards } from '../api/flashcards.js'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listFlashcards()
      .then(setCards)
      .catch(() => setCards([]))
      .finally(() => setLoading(false))
  }, [])

  const decks = useMemo(() => {
    const grouped = new Map()
    for (const card of cards) {
      const list = grouped.get(card.deck) || []
      list.push(card)
      grouped.set(card.deck, list)
    }
    return Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [cards])

  return (
    <section>
      <div className="page-header">
        <h1>Welcome back, {user.username}</h1>
        <Link to="/flashcards" className="btn-link">Manage cards</Link>
      </div>

      {loading ? (
        <p className="muted">Loading...</p>
      ) : decks.length === 0 ? (
        <p className="muted">
          No flashcards yet. <Link to="/flashcards">Create your first one</Link>.
        </p>
      ) : (
        <div className="deck-grid">
          {decks.map(([deck, deckCards]) => (
            <div key={deck} className="card deck-card">
              <h2 className="deck-name">{deck}</h2>
              <p className="muted">
                {deckCards.length} card{deckCards.length === 1 ? '' : 's'}
              </p>
              <ul className="deck-preview">
                {deckCards.slice(0, 3).map((c) => (
                  <li key={c.id}>{c.front}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
