import { useEffect, useState } from 'react'

import {
  createFlashcard,
  deleteFlashcard,
  listFlashcards,
  updateFlashcard,
} from '../api/flashcards.js'
import FlashcardCard from '../components/FlashcardCard.jsx'
import FlashcardModal from '../components/FlashcardModal.jsx'

export default function FlashcardList() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState(null)

  useEffect(() => {
    refresh()
  }, [])

  async function refresh() {
    setLoading(true)
    setError('')
    try {
      const data = await listFlashcards()
      setCards(data)
    } catch {
      setError('Failed to load flashcards')
    } finally {
      setLoading(false)
    }
  }

  function openNew() {
    setEditingCard(null)
    setModalOpen(true)
  }

  function openEdit(card) {
    setEditingCard(card)
    setModalOpen(true)
  }

  async function handleSubmit(values) {
    if (editingCard) {
      await updateFlashcard(editingCard.id, values)
    } else {
      await createFlashcard(values)
    }
    await refresh()
  }

  async function handleDelete(card) {
    try {
      await deleteFlashcard(card.id)
      setCards((prev) => prev.filter((c) => c.id !== card.id))
    } catch {
      setError('Failed to delete flashcard')
    }
  }

  return (
    <section>
      <div className="page-header">
        <h1>Your flashcards</h1>
        <button type="button" onClick={openNew}>+ New flashcard</button>
      </div>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <p className="muted">Loading...</p>
      ) : cards.length === 0 ? (
        <p className="muted">No flashcards yet. Create your first one.</p>
      ) : (
        <div className="flashcard-grid">
          {cards.map((card) => (
            <FlashcardCard
              key={card.id}
              card={card}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <FlashcardModal
        open={modalOpen}
        initialCard={editingCard}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </section>
  )
}
