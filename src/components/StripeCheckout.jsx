import { useEffect, useMemo, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js'
import { createCheckoutSession } from '../lib/api.js'

const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

export default function StripeCheckout({ open, onClose, onComplete }) {
  const [clientSecret, setClientSecret] = useState(null)
  const [error, setError] = useState('')

  const stripePromise = useMemo(
    () => (PUBLISHABLE_KEY ? loadStripe(PUBLISHABLE_KEY) : null),
    []
  )

  useEffect(() => {
    if (!open) {
      setClientSecret(null)
      setError('')
      return
    }
    if (!PUBLISHABLE_KEY) {
      setError(
        'Stripe publishable key not configured. Set VITE_STRIPE_PUBLISHABLE_KEY.'
      )
      return
    }
    let cancelled = false
    createCheckoutSession()
      .then((data) => {
        if (!cancelled) setClientSecret(data.client_secret)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Could not start checkout.')
      })
    return () => {
      cancelled = true
    }
  }, [open])

  if (!open) return null

  const options = clientSecret
    ? {
        clientSecret,
        onComplete: () => onComplete?.(),
      }
    : null

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Pay for the full report"
    >
      <div className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-line bg-ink shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
              Full report
            </p>
            <p className="text-sm text-body">A$4.75 — one-off, test mode</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-line px-2 py-1 text-xs text-muted hover:text-body"
            aria-label="Cancel checkout"
          >
            Cancel
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          {error && (
            <div className="px-4 py-6 text-sm text-red-600">{error}</div>
          )}
          {!error && !clientSecret && (
            <div className="px-4 py-10 text-center text-sm text-stone-600">
              Loading checkout…
            </div>
          )}
          {!error && clientSecret && stripePromise && (
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </div>
    </div>
  )
}
