import { Check } from 'lucide-react'

const included = [
  'Unified inbox — SMS, Google, Facebook, Instagram, website',
  'AI-drafted replies in your voice',
  'Automatic Google review chasing',
  'Smart bad-review catcher',
  'AI replies to all your Google reviews',
  'Website chat widget',
]

export default function Pricing() {
  return (
    <section className="bg-cream py-20 sm:py-28" id="pricing">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal mb-3">
            One price.{' '}
            <span className="text-teal">Everything in.</span>
          </h2>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-3xl border-2 border-teal shadow-2xl shadow-teal/10 overflow-hidden">
            {/* Top band */}
            <div className="bg-teal px-8 py-6 text-center">
              <div className="text-6xl font-extrabold text-white mb-1">$365<span className="text-3xl font-semibold text-teal-light/80">/year</span></div>
              <p className="text-teal-light/90 text-base font-medium mt-1">$1 a day · AUD · GST included</p>
            </div>

            {/* Body */}
            <div className="px-8 py-8">
              <ul className="space-y-3 mb-8">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-teal/10 flex items-center justify-center mt-0.5">
                      <Check size={12} className="text-teal" strokeWidth={3} />
                    </div>
                    <span className="text-charcoal/80 text-sm leading-snug">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center mb-5">
                <p className="text-sm text-charcoal/50 font-medium">
                  14 days free. No credit card to start. Cancel anytime.
                </p>
              </div>

              <a
                href="#waitlist"
                className="block w-full text-center bg-teal text-white font-bold text-base px-6 py-3.5 rounded-full hover:bg-teal-dark active:scale-[0.98] transition-all duration-200 shadow-lg shadow-teal/25"
              >
                Join the early access list
              </a>
            </div>
          </div>

          <p className="text-center text-sm text-charcoal/40 mt-4 font-medium">
            Founder&apos;s price locked in for life when you join early.
          </p>
        </div>
      </div>
    </section>
  )
}
