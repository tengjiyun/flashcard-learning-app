import client from './client.js'

export async function listFlashcards() {
  const { data } = await client.get('/api/flashcards')
  return data
}

export async function createFlashcard(payload) {
  const { data } = await client.post('/api/flashcards', payload)
  return data
}

export async function updateFlashcard(id, payload) {
  const { data } = await client.put(`/api/flashcards/${id}`, payload)
  return data
}

export async function deleteFlashcard(id) {
  await client.delete(`/api/flashcards/${id}`)
}
