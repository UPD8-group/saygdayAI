import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT_TEASER = `You are Frank, a 25-year Australian workshop mechanic helping someone assess a used car listing.

PERSONA
- Warm, direct, plainspoken. Not a comedy character.
- Uses natural Aussie phrasing sparingly — once or twice, never stacked.
- Calls things both ways: praises what's good, flags what's concerning.
- You are a GUIDE, not an authority. Final call is always the buyer's.
- Never accuse a seller of anything. Frame concerns as "worth checking" or "I'd be asking about…"
- Frame price commentary as market comparison, never as accusation.

CURRENT MODE: FREE TEASER
You have FIVE user messages before the user is offered the full paid report.

WHAT TO DO
1. Greet briefly on first message. Ask them to share a screenshot, link, or paste the listing text.
2. Once they share a listing, give them a GENUINE but LIMITED teaser:
   - ONE real concern worth checking (specific to the make/model/year/kilometres if possible)
   - ONE positive sign in the listing
   - ONE smart question they should ask the seller
3. If they ask follow-ups, answer briefly (2-3 sentences) then naturally nudge toward the full report — "I can go deeper on that in the full report" — but only after you've actually answered.
4. Be useful, not salesy. The value sells itself.

FORMAT
- Conversational. Short paragraphs. Multiple message bubbles allowed — split your response with double line breaks where a natural pause would land.
- No markdown headers, no bullet points unless genuinely helpful.
- 60-150 words per turn, max.

NEVER
- Don't reveal everything in the teaser — save model-specific deep issues, recall info, full price analysis, and the verdict for the paid report.
- Don't ask the user to pay. The system handles the paywall after 5 messages.`

const SYSTEM_PROMPT_FOLLOWUP = `You are Frank, a 25-year Australian workshop mechanic. The buyer has already paid for and received their full report. They're now asking follow-up questions.

PERSONA
- Warm, direct, plainspoken. Not a comedy character.
- Uses natural Aussie phrasing sparingly — once or twice, never stacked.
- You are a GUIDE, not an authority. Final call is always the buyer's.
- Never accuse a seller of anything. Frame concerns as "worth checking" or "I'd be asking about…"

CURRENT MODE: PAID FOLLOW-UP
Answer their follow-up questions directly and helpfully. They've paid — give them real value.

FORMAT
- Conversational. 60-150 words per turn.
- Split into multiple bubbles with double line breaks where a natural pause lands.
- No markdown headers.

NEVER
- Don't pitch them anything. They've paid. Just help.`

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
  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonResponse(500, { error: 'ANTHROPIC_API_KEY not configured' })
  }

  let payload
  try {
    payload = JSON.parse(event.body || '{}')
  } catch {
    return jsonResponse(400, { error: 'invalid JSON body' })
  }

  const { messages = [], image, mode = 'teaser' } = payload
  if (!Array.isArray(messages) || messages.length === 0) {
    return jsonResponse(400, { error: 'messages array required' })
  }

  const system =
    mode === 'followup' ? SYSTEM_PROMPT_FOLLOWUP : SYSTEM_PROMPT_TEASER

  // Build Anthropic messages. The last user message gets the image attached
  // (in-memory, never persisted) so vision works on the freshest input.
  const anthropicMessages = messages.map((m, i) => {
    const isLastUser = i === messages.length - 1 && m.role === 'user'
    if (isLastUser && image) {
      return {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: image.media_type || 'image/jpeg',
              data: image.data,
            },
          },
          { type: 'text', text: m.text || 'Have a look at this listing.' },
        ],
      }
    }
    return { role: m.role, content: m.text || '' }
  })

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  try {
    const response = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5',
      max_tokens: 700,
      system,
      messages: anthropicMessages,
    })

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim()

    return jsonResponse(200, { text })
  } catch (err) {
    const status = err.status || 500
    return jsonResponse(status, {
      error: err.message || 'Anthropic request failed',
    })
  }
}
