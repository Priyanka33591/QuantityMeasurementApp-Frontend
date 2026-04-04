const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

function authHeaders(extra = {}) {
  const headers = { ...extra }
  const token = localStorage.getItem('qma_token')
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(text || `Login failed (${res.status})`)
  }
  return text
}

export async function signup({ username, password, email }) {
  const res = await fetch(`${API_BASE}/api/v1/quantities/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email: email || null }),
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(text || `Signup failed (${res.status})`)
  }
  return text
}

export async function performOperation(body) {
  console.log("API:", API_BASE)

  const res = await fetch(`${API_BASE}/api/v1/quantities/perform`, {
    method: 'POST',
    headers: authHeaders({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(body),
  })

  const text = await res.text()
  if (!res.ok) {
    throw new Error(text || `Request failed (${res.status})`)
  }

  return JSON.parse(text)
}

export async function fetchHistory() {
  const res = await fetch(`${API_BASE}/api/v1/quantities/history`, {
    headers: authHeaders(),
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(text || `Failed to load history (${res.status})`)
  }
  return JSON.parse(text)
}

export async function fetchLatestHistory(limit = 10) {
  const res = await fetch(
    `${API_BASE}/api/v1/quantities/history/latest?limit=${encodeURIComponent(limit)}`,
    { headers: authHeaders() }
  )
  const text = await res.text()
  if (!res.ok) {
    throw new Error(text || `Failed to load history (${res.status})`)
  }
  return JSON.parse(text)
}
