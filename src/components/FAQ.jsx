import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'When does it launch?',
    a: "We're building it now. Join the early access list and you'll be among the first to use it, with a founder's price locked in for life.",
  },
  {
    q: "How is this different from Podium or Birdeye?",
    a: "Same idea, built here, priced for Australian small businesses. We're $1 a day. They're $400+ a month.",
  },
  {
    q: 'What channels does it connect to?',
    a: "SMS, Google Business messages, Facebook DMs, Instagram DMs, your website chat. Email coming.",
  },
  {
    q: 'Is my data stored in Australia?',
    a: "Yes. All data hosted on Australian servers. We never train AI on your customer conversations.",
  },
  {
    q: "Do I need a website?",
    a: "No. Plenty of small businesses run everything off Instagram and Google. Say G'day works either way.",
  },
  {
    q: "What if I'm not technical?",
    a: "If you can send a text message, you can use Say G'day. Setup is 5 minutes.",
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-charcoal/10 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        aria-expanded={open}
      >
        <span className="font-semibold text-charcoal group-hover:text-teal transition-colors text-base">
          {q}
        </span>
        <ChevronDown
          size={20}
          className={`flex-shrink-0 text-teal transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="pb-5 text-charcoal/65 leading-relaxed text-[15px]">{a}</p>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal text-center mb-12">
          Got questions?
        </h2>

        <div className="divide-y-0">
          {faqs.map(({ q, a }) => (
            <FAQItem key={q} q={q} a={a} />
          ))}
        </div>
      </div>
    </section>
  )
}
