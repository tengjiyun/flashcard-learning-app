import { useEffect, useState } from 'react'

export default function FlashcardCard({ card, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (!confirming) return
    const timer = setTimeout(() => setConfirming(false), 3000)
    return () => clearTimeout(timer)
  }, [confirming])

  function handleDeleteClick() {
    if (confirming) {
      onDelete(card)
      setConfirming(false)
    } else {
      setConfirming(true)
    }
  }

  return (
    <article className="flashcard">
      <div className="flashcard-body">
        <p className="flashcard-front">{card.front}</p>
        <p className="flashcard-back">{card.back}</p>
      </div>
      <div className="flashcard-meta">
        <span className="flashcard-deck">{card.deck}</span>
        <div className="flashcard-actions">
          <button type="button" className="btn-secondary" onClick={() => onEdit(card)}>
            Edit
          </button>
          <button
            type="button"
            className={confirming ? 'btn-danger-confirm' : 'btn-danger'}
            onClick={handleDeleteClick}
          >
            {confirming ? 'Confirm delete' : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  )
}
