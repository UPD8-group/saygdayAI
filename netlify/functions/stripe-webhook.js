import Stripe from 'stripe'

// We deliberately do NOT persist anything. This handler only logs the event
// so the Stripe dashboard webhook sees a 200 and stops retrying.

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'method not allowed' }
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return { statusCode: 500, body: 'STRIPE_SECRET_KEY not configured' }
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return { statusCode: 500, body: 'STRIPE_WEBHOOK_SECRET not configured' }
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const sig = event.headers['stripe-signature']
  if (!sig) return { statusCode: 400, body: 'missing stripe-signature' }

  // Netlify base64-encodes the raw body when isBase64Encoded is true.
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body

  let stripeEvent
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return { statusCode: 400, body: `webhook signature failed: ${err.message}` }
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object
    // Log only — no DB write.
    console.log(
      `[stripe-webhook] checkout.session.completed id=${session.id} amount=${session.amount_total} currency=${session.currency}`
    )
  } else {
    console.log(`[stripe-webhook] received ${stripeEvent.type}`)
  }

  return { statusCode: 200, body: 'ok' }
}
