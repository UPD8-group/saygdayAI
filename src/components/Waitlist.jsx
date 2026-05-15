const businessTypes = [
  'Salon / Beauty',
  'Trades',
  'Café / Restaurant',
  'Clinic / Allied Health',
  'Retail',
  'Other',
]

const states = [
  'ACT',
  'NSW',
  'NT',
  'QLD',
  'SA',
  'TAS',
  'VIC',
  'WA',
]

export default function Waitlist() {
  return (
    <section className="bg-teal py-20 sm:py-28" id="waitlist">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 text-balance">
            Get early access
          </h2>
          <p className="text-teal-light/80 text-lg">
            Join the list and lock in the founder&apos;s price — $365/year for life.
            14 days free when we launch.
          </p>
        </div>

        <form
          name="waitlist"
          method="POST"
          action="/thanks"
          data-netlify="true"
          netlify-honeypot="bot-field"
          className="flex flex-col gap-4"
        >
          <input type="hidden" name="form-name" value="waitlist" />
          <p className="hidden">
            <label>Don&apos;t fill this out: <input name="bot-field" /></label>
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-white/80 mb-1.5">
                Your name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Jane Smith"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white/80 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="jane@yourbusiness.com.au"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="business-type" className="block text-sm font-semibold text-white/80 mb-1.5">
                Business type
              </label>
              <select
                id="business-type"
                name="business_type"
                required
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="text-charcoal">Select type...</option>
                {businessTypes.map((t) => (
                  <option key={t} value={t} className="text-charcoal">{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-semibold text-white/80 mb-1.5">
                State / Territory
              </label>
              <select
                id="state"
                name="state"
                required
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="text-charcoal">Select state...</option>
                {states.map((s) => (
                  <option key={s} value={s} className="text-charcoal">{s}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 w-full bg-sunset text-white font-bold text-base px-6 py-4 rounded-full hover:brightness-105 active:scale-[0.98] transition-all duration-200 shadow-xl shadow-black/20"
          >
            Join the early access list →
          </button>

          <p className="text-center text-white/50 text-xs font-medium">
            No spam. No card required. Unsubscribe any time.
          </p>
        </form>
      </div>
    </section>
  )
}
