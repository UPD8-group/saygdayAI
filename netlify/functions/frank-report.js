import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are Frank, a 25-year Australian workshop mechanic helping someone assess a used car listing.

PERSONA
- Warm, direct, plainspoken. Not a comedy character.
- Uses natural Aussie phrasing sparingly — once or twice, never stacked.
- Calls things both ways: praises what's good, flags what's concerning.
- You are a GUIDE, not an authority. Final call is always the buyer's.
- Never accuse a seller of anything. Frame concerns as "worth checking" or "I'd be asking about…"
- Frame price commentary as market comparison ("similar 2018 Hilux SR5s with that km count are sitting around X–Y on Carsales right now"), never as accusation.

CURRENT MODE: PAID REPORT
The buyer has paid for the full report. Deliver the goods — model-specific deep issues, recalls, owner feedback, market price check, verdict.

OUTPUT FORMAT — STRICT
Return ONLY a single JSON object, no markdown fences, no preamble, no trailing text. The object MUST match this schema exactly:

{
  "overall_impression": "string — 2-3 sentences, your gut read",
  "things_to_check": [
    { "priority": "high|medium|low", "item": "string — what to check", "why": "string — why it matters" }
  ],
  "known_model_issues": "string — 2-4 sentences on the model's reputation, common faults at this age/km",
  "owner_feedback": "string — 2-3 sentences on what real owners say (loves and gripes)",
  "recall_info": "string — 1-2 sentences on any known recalls or TSBs for this model",
  "price_assessment": "string — 2-3 sentences framing the asking price against the current Australian market",
  "questions_for_seller": ["string", "string", "string", "string", "string"],
  "verdict": {
    "tier": "solid_find|closer_look|proceed_with_caution|keep_looking",
    "summary": "string — 2-3 sentences explaining the tier"
  }
}

Rules:
- "things_to_check" must have 4–6 items.
- "questions_for_seller" must have exactly 5 strings.
- "verdict.tier" must be one of those four exact strings.
- If you genuinely don't know something for sure (e.g. a specific recall), say so honestly in the field — don't fabricate.
- Never accuse the seller. Frame everything as "worth checking" / "I'd be asking about".
- Write in Frank's voice throughout — warm, direct, Australian, plainspoken.`

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }
}

// Strip ```json fences and leading/trailing chatter, then JSON.parse.
function parseReportText(raw) {
  let s = (raw || '').trim()
  // Strip ```json ... ``` or ``` ... ```
  const fence = /^```(?:json)?\s*([\s\S]*?)\s*```$/i.exec(s)
  if (fence) s = fence[1].trim()
  // If the model wrapped the JSON in prose, grab the outermost object.
  if (s[0] !== '{') {
    const start = s.indexOf('{')
    const end = s.lastIndexOf('}')
    if (start >= 0 && end > start) s = s.slice(start, end + 1)
  }
  return JSON.parse(s)
}

const VALID_TIERS = new Set([
  'solid_find',
  'closer_look',
  'proceed_with_caution',
  'keep_looking',
])

function validateReport(r) {
  if (!r || typeof r !== 'object') throw new Error('report is not an object')
  if (typeof r.overall_impression !== 'string')
    throw new Error('overall_impression missing')
  if (!Array.isArray(r.things_to_check) || r.things_to_check.length === 0)
    throw new Error('things_to_check missing')
  if (typeof r.known_model_issues !== 'string')
    throw new Error('known_model_issues missing')
  if (typeof r.owner_feedback !== 'string')
    throw new Error('owner_feedback missing')
  if (typeof r.recall_info !== 'string') throw new Error('recall_info missing')
  if (typeof r.price_assessment !== 'string')
    throw new Error('price_assessment missing')
  if (
    !Array.isArray(r.questions_for_seller) ||
    r.questions_for_seller.length < 3
  )
    throw new Error('questions_for_seller missing')
  if (!r.verdict || !VALID_TIERS.has(r.verdict.tier))
    throw new Error('verdict tier invalid')
  if (typeof r.verdict.summary !== 'string')
    throw new Error('verdict.summary missing')
  return r
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

  const { messages = [], image, listing_text } = payload

  // Build the Anthropic message list from the teaser transcript so Frank has
  // full context. If a fresh image was attached, include it on the last
  // user message. If listing_text was supplied separately, append it.
  const anthropicMessages = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role, content: m.text || '' }))

  if (listing_text) {
    anthropicMessages.push({
      role: 'user',
      content: `Listing text:\n${listing_text}`,
    })
  }

  // Always end with an explicit request for the report.
  const finalReq = image
    ? {
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
          {
            type: 'text',
            text:
              'Pull together the full report now. JSON only, no fences, matching the schema.',
          },
        ],
      }
    : {
        role: 'user',
        content:
          'Pull together the full report now. JSON only, no fences, matching the schema.',
      }
  anthropicMessages.push(finalReq)

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  try {
    const response = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: anthropicMessages,
    })

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')

    const report = validateReport(parseReportText(text))
    return jsonResponse(200, { report })
  } catch (err) {
    const status = err.status || 500
    return jsonResponse(status, {
      error: err.message || 'Anthropic request failed',
    })
  }
}
