import client from './client.js'

export async function register({ email, username, password }) {
  const { data } = await client.post('/api/auth/register', { email, username, password })
  return data
}

export async function login({ email, password }) {
  const { data } = await client.post('/api/auth/login', { email, password })
  return data
}
