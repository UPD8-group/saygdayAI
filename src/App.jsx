import { useReducer, useState, useCallback } from 'react'
import ChatWindow from './components/ChatWindow.jsx'
import ChatInput from './components/ChatInput.jsx'
import Disclaimer from './components/Disclaimer.jsx'
import {
  initialState,
  reduce,
  inputDisabled,
  inputPlaceholder,
  shouldOpenPaywall,
  PHASES,
} from './lib/chat-state.js'
import { frankChat } from './lib/api.js'

const FRANK_GREETING = {
  id: 'greeting',
  role: 'assistant',
  text:
    "G'day. I'm Frank. Drop a screenshot or paste the listing text and I'll have a proper look — tell you what I'd be checking, what's worth asking the seller, and whether the price stacks up.",
}

const PAYWALL_PROMPT = {
  role: 'assistant',
  text:
    "Right, I've given you the early read. If you want the full rundown — known issues for this exact model, recalls, what owners actually report, a proper price check against the market, and my verdict — that's the full report. A$4.75, one-off. Want me to pull it together?",
}

// Split a response into multiple bubbles on blank-line boundaries.
function splitIntoBubbles(text) {
  if (!text) return []
  return text
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean)
}

// Realistic typing delay scaled to length, clamped to 800–1500ms.
function typingDelayFor(text) {
  const base = 600 + text.length * 18
  return Math.min(1500, Math.max(800, base))
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

export default function App() {
  const [messages, setMessages] = useState([FRANK_GREETING])
  const [chat, dispatch] = useReducer(reduce, undefined, initialState)
  const [isTyping, setIsTyping] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const addMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), ...msg }])
  }, [])

  // Convert the visible message log into the wire format Anthropic expects.
  function buildHistory(extraUserMessage) {
    const visible = [...messages]
    if (extraUserMessage) visible.push(extraUserMessage)
    return visible
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, text: m.text || '' }))
  }

  async function deliverFrankReply(replyText) {
    const bubbles = splitIntoBubbles(replyText)
    for (let i = 0; i < bubbles.length; i++) {
      setIsTyping(true)
      await sleep(typingDelayFor(bubbles[i]))
      setIsTyping(false)
      addMessage({ role: 'assistant', text: bubbles[i] })
    }
  }

  async function handleSend({ text }) {
    setErrorMsg('')
    const userMsg = { role: 'user', text }
    addMessage(userMsg)
    dispatch({ type: 'USER_MESSAGE_SENT' })

    const mode = chat.phase === PHASES.FOLLOWUP ? 'followup' : 'teaser'

    try {
      const { text: reply } = await frankChat({
        messages: buildHistory(userMsg),
        mode,
      })
      await deliverFrankReply(reply)
    } catch (err) {
      setIsTyping(false)
      setErrorMsg(err.message || 'Something went wrong talking to Frank.')
      addMessage({
        role: 'assistant',
        text:
          "Bugger — my line dropped out for a second. Try that again in a moment.",
      })
      return
    }

    // Check paywall transition AFTER Frank has responded so the conversation
    // feels natural — the buyer gets value before the offer.
    if (shouldOpenPaywall({ ...chat, teaserUserCount: chat.teaserUserCount + 1 })) {
      await sleep(600)
      addMessage(PAYWALL_PROMPT)
      dispatch({ type: 'OPEN_PAYWALL' })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
          <img
            src="/frank.jpg"
            onError={(e) => {
              e.currentTarget.src = '/frank-placeholder.svg'
            }}
            alt="Frank"
            className="h-12 w-12 rounded-full border border-line object-cover sm:h-14 sm:w-14"
          />
          <div className="min-w-0">
            <h1 className="font-display text-2xl tracking-wide text-amber sm:text-3xl">
              MECHANIC FRANK
            </h1>
            <p className="truncate font-mono text-[11px] uppercase tracking-widest text-muted sm:text-xs">
              25 years on the tools · here to help
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl">
          <ChatWindow messages={messages} isTyping={isTyping} />
          {errorMsg && (
            <p className="px-6 pb-2 text-center text-xs text-red-400">{errorMsg}</p>
          )}
        </div>
      </main>

      <ChatInput
        onSend={handleSend}
        disabled={isTyping || inputDisabled(chat)}
        placeholder={inputPlaceholder(chat)}
      />
      <Disclaimer />
    </div>
  )
}
