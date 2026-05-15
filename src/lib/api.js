// Tiny client for the Netlify functions.
// Listing data lives in memory only — never written to disk or to localStorage.

const BASE = '/api'

async function postJSON(path, body) {
  const res = await fetch(`${BASE}/${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    let detail = ''
    try {
      const j = await res.json()
      detail = j.error || ''
    } catch {
      /* ignore */
    }
    throw new Error(detail || `Request failed (${res.status})`)
  }
  return res.json()
}

// History shape Anthropic-side: [{ role: 'user'|'assistant', text: string }]
// `image` is { media_type: 'image/jpeg'|..., data: 'base64...' } or undefined.
// It is attached to the most recent user message only.

export function frankChat({ messages, image, mode }) {
  return postJSON('frank-chat', { messages, image, mode })
}

export function frankReport({ messages, image }) {
  return postJSON('frank-report', { messages, image })
}

export function createCheckoutSession() {
  return postJSON('create-checkout-session', {})
}
