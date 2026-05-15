export default function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-teal/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-bold text-teal tracking-tight">
            Say G&apos;day
          </span>
          <span className="hidden sm:inline text-xs font-medium text-sunset border border-sunset/40 rounded-full px-2 py-0.5 ml-1">
            Early access
          </span>
        </a>
        <a
          href="#waitlist"
          className="bg-teal text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-teal-dark transition-colors duration-200"
        >
          Join the list
        </a>
      </div>
    </header>
  )
}
