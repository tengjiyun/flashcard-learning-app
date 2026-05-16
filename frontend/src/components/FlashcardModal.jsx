import { useEffect, useState } from 'react'

const EMPTY = { deck: 'General', front: '', back: '' }

export default function FlashcardModal({ open, initialCard, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm(
      initialCard
        ? { deck: initialCard.deck, front: initialCard.front, back: initialCard.back }
        : EMPTY,
    )
    setError('')
  }, [open, initialCard])

  if (!open) return null

  function update(field) {
    return (event) => setForm((f) => ({ ...f, [field]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSubmit(form)
      onClose()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{initialCard ? 'Edit flashcard' : 'New flashcard'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Deck
            <input
              type="text"
              value={form.deck}
              onChange={update('deck')}
              maxLength={100}
              required
            />
          </label>
          <label>
            Front
            <textarea
              value={form.front}
              onChange={update('front')}
              rows={3}
              required
              autoFocus
            />
          </label>
          <label>
            Back
            <textarea
              value={form.back}
              onChange={update('back')}
              rows={3}
              required
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
