import { MessageSquare, Star, Smartphone, Facebook, Globe } from 'lucide-react'

const channels = [
  { icon: Smartphone, label: 'SMS' },
  { icon: Star, label: 'Google' },
  { icon: Facebook, label: 'Facebook' },
  { icon: MessageSquare, label: 'Instagram' },
  { icon: Globe, label: 'Website' },
]

function InboxPreview() {
  const messages = [
    { initials: 'SB', name: 'Sarah B.', channel: 'SMS', time: '2m ago', text: 'Hi, is there a spot available Thurs morning?', unread: true },
    { initials: 'MR', name: 'Mike R.', channel: 'Google', time: '14m ago', text: 'Just left you a 5-star review! Thanks so much.', unread: true },
    { initials: 'JL', name: 'Jess L.', channel: 'Facebook', time: '1h ago', text: 'What are your hours on Saturday?', unread: false },
    { initials: 'TC', name: 'Tom C.', channel: 'Website', time: '3h ago', text: 'Do you offer gift vouchers?', unread: false },
  ]

  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0 lg:ml-auto">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-teal/10 rounded-3xl blur-2xl" />

      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-teal/10">
        {/* Header bar */}
        <div className="bg-teal px-4 py-3 flex items-center justify-between">
          <span className="text-white font-semibold text-sm">All messages</span>
          <span className="bg-sunset text-white text-xs font-bold px-2 py-0.5 rounded-full">2 new</span>
        </div>

        {/* Channel pills */}
        <div className="flex gap-1.5 px-3 py-2.5 border-b border-gray-100 overflow-x-auto">
          {channels.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 rounded-full px-2.5 py-1 whitespace-nowrap border border-gray-100">
              <Icon size={11} />
              {label}
            </div>
          ))}
        </div>

        {/* Message list */}
        <div className="divide-y divide-gray-50">
          {messages.map((msg) => (
            <div key={msg.name} className={`flex items-start gap-3 px-4 py-3 ${msg.unread ? 'bg-teal/[0.03]' : ''}`}>
              <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${msg.unread ? 'bg-teal text-white' : 'bg-gray-100 text-gray-500'}`}>
                {msg.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-semibold truncate ${msg.unread ? 'text-charcoal' : 'text-gray-500'}`}>
                      {msg.name}
                    </span>
                    <span className="text-[10px] text-teal bg-teal/10 rounded-full px-1.5 py-0.5 font-medium">
                      {msg.channel}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">{msg.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{msg.text}</p>
              </div>
              {msg.unread && <div className="flex-shrink-0 w-2 h-2 rounded-full bg-sunset mt-1" />}
            </div>
          ))}
        </div>

        {/* AI reply suggestion */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-medium mb-1.5 uppercase tracking-wide">AI suggested reply</p>
          <p className="text-xs text-gray-600 italic">&ldquo;Hey Sarah! We do have a spot Thursday at 9 am — want me to lock it in?&rdquo;</p>
          <div className="flex gap-2 mt-2">
            <button className="text-xs bg-teal text-white rounded-full px-3 py-1 font-medium">Send</button>
            <button className="text-xs text-gray-400 rounded-full px-3 py-1 border border-gray-200">Edit</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream pt-16 pb-20 sm:pt-20 sm:pb-28">
      {/* Subtle background texture */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-teal/[0.03] rounded-bl-[80px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">

          {/* Left: copy */}
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-sunset/15 text-sunset text-sm font-semibold rounded-full px-3.5 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-sunset animate-pulse" />
              Now taking early access sign-ups
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-charcoal leading-[1.1] tracking-tight text-balance mb-6">
              Say g&apos;day to your customers&nbsp;—{' '}
              <span className="text-teal">everywhere they reach out.</span>
            </h1>

            <p className="text-lg sm:text-xl text-charcoal/70 leading-relaxed mb-8 text-balance">
              One inbox for SMS, Google, Facebook, Instagram and your website.
              Automatic review chasing. AI that replies in your voice.
              Built in Australia for Australian small businesses.{' '}
              <strong className="text-charcoal font-semibold">$1 a day. That&apos;s it.</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-6">
              <a
                href="#waitlist"
                className="inline-flex items-center justify-center bg-teal text-white font-bold text-base px-7 py-3.5 rounded-full hover:bg-teal-dark active:scale-95 transition-all duration-200 shadow-lg shadow-teal/25"
              >
                Join the early access list
              </a>
            </div>

            <p className="text-sm text-charcoal/50 font-medium">
              14 days free when we launch. No card to start.
            </p>
          </div>

          {/* Right: inbox preview */}
          <div className="flex-1 w-full">
            <InboxPreview />
          </div>
        </div>
      </div>
    </section>
  )
}
