import Stripe from 'stripe'

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'method not allowed' })
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return jsonResponse(500, { error: 'STRIPE_SECRET_KEY not configured' })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const amount = Number(process.env.STRIPE_PRICE_AMOUNT_CENTS || 475)
  const currency = (process.env.STRIPE_CURRENCY || 'aud').toLowerCase()

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode: 'payment',
      // Stay on the page — no redirect. The client listens for the `complete`
      // event from Embedded Checkout and triggers the report inline.
      redirect_on_completion: 'never',
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: amount,
            product_data: {
              name: 'Mechanic Frank — Full Report',
              description:
                "Frank's full read on the listing: known issues, recalls, owner feedback, market price check, verdict.",
            },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        description: 'Mechanic Frank — Full Report (A$4.75)',
      },
    })

    return jsonResponse(200, { client_secret: session.client_secret })
  } catch (err) {
    return jsonResponse(err.statusCode || 500, {
      error: err.message || 'Stripe session creation failed',
    })
  }
}
