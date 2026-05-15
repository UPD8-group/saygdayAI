const businessTypes = [
  'Salon / Beauty',
  'Trades',
  'Café / Restaurant',
  'Clinic / Allied Health',
  'Retail',
  'Other',
]

const states = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA']

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-extrabold mb-2">Say G&apos;day</div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Say g&apos;day to your customers — everywhere they reach out.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">Company</p>
            <ul className="space-y-2.5">
              {[
                { label: 'About', href: '#' },
                { label: 'Privacy', href: '#' },
                { label: 'Terms', href: '#' },
                { label: 'Contact', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-white/50 hover:text-white text-sm transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Inline signup */}
          <div>
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
              Stay in the loop
            </p>
            <form
              name="footer-waitlist"
              method="POST"
              action="/thanks"
              data-netlify="true"
              netlify-honeypot="bot-field"
              className="flex flex-col gap-2"
            >
              <input type="hidden" name="form-name" value="footer-waitlist" />
              <p className="hidden">
                <label>Don&apos;t fill this out: <input name="bot-field" /></label>
              </p>
              <input
                name="email"
                type="email"
                required
                placeholder="your@email.com.au"
                className="bg-white/10 border border-white/15 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-white/40 transition-all"
              />
              <button
                type="submit"
                className="bg-teal text-white text-sm font-semibold rounded-xl px-4 py-2.5 hover:bg-teal-light transition-colors"
              >
                Join early access
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-white/30 text-sm">
          © 2026 Say G&apos;day. Made in Australia. 🇦🇺
        </div>
      </div>
    </footer>
  )
}
