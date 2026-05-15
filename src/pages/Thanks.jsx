export default function Thanks() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-lg">
        <div className="text-6xl mb-6">👋</div>
        <h1 className="text-4xl font-extrabold text-charcoal mb-4">
          You&apos;re on the list!
        </h1>
        <p className="text-lg text-charcoal/65 mb-8 leading-relaxed">
          We&apos;ll be in touch as soon as Say G&apos;day is ready. You&apos;ll get first access and
          the founder&apos;s price locked in for life.
        </p>

        <div className="bg-teal/8 border border-teal/15 rounded-2xl p-6 mb-8 text-left">
          <p className="font-semibold text-charcoal mb-1">Know another business owner?</p>
          <p className="text-sm text-charcoal/60 leading-relaxed">
            Tell a mate — every referral helps us build something genuinely useful for
            Australian small businesses.
          </p>
        </div>

        <a
          href="/"
          className="inline-flex items-center text-teal font-semibold hover:underline"
        >
          ← Back to home
        </a>
      </div>
    </div>
  )
}
