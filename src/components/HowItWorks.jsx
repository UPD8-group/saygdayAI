import { Plug, BrainCircuit, Inbox } from 'lucide-react'

const steps = [
  {
    icon: Plug,
    number: '01',
    title: 'Connect your channels',
    description:
      'Phone, Google Business, Facebook, Instagram, website — in 5 minutes.',
  },
  {
    icon: BrainCircuit,
    number: '02',
    title: 'Your AI learns your tone',
    description:
      'It reads how you write and talk to customers, then drafts replies that sound like you.',
  },
  {
    icon: Inbox,
    number: '03',
    title: 'One place. Every message.',
    description:
      'Every customer message lands in one inbox. Every paid customer gets a review request. Every review gets a reply.',
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal mb-3 text-balance">
            One inbox. Every channel.{' '}
            <span className="text-teal">Zero hassle.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map(({ icon: Icon, number, title, description }, i) => (
            <div key={number} className="relative flex flex-col items-start">
              {/* Connector line (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden sm:block absolute top-7 left-[calc(100%+1rem)] w-[calc(2rem)] h-px bg-teal/20 z-10" />
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center">
                  <Icon size={26} className="text-teal" />
                </div>
                <span className="text-4xl font-extrabold text-teal/15 leading-none select-none">
                  {number}
                </span>
              </div>

              <h3 className="text-lg font-bold text-charcoal mb-2">{title}</h3>
              <p className="text-charcoal/60 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
