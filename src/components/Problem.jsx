import { Layers, Star, AlertCircle } from 'lucide-react'

const problems = [
  {
    icon: Layers,
    text: 'Messages buried in five different apps',
  },
  {
    icon: Star,
    text: 'Reviews you never asked for, never came',
  },
  {
    icon: AlertCircle,
    text: 'Leads that slipped through the cracks',
  },
]

export default function Problem() {
  return (
    <section className="bg-charcoal py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-center leading-tight mb-4 text-balance">
          Your customers are everywhere.{' '}
          <span className="text-sunset">You can&apos;t be.</span>
        </h2>

        <div className="grid sm:grid-cols-3 gap-4 mt-12 mb-12">
          {problems.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex flex-col items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-sunset/20 flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-sunset" />
              </div>
              <p className="text-white/90 font-medium text-base leading-snug">{text}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-white/60 text-lg max-w-2xl mx-auto">
          Sound familiar? You&apos;re not alone — and you&apos;re{' '}
          <span className="text-white font-semibold">losing customers because of it.</span>
        </p>
      </div>
    </section>
  )
}
