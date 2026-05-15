import { Inbox, MessageSquareDashed, Star, ShieldCheck, Bot, Globe } from 'lucide-react'

const features = [
  {
    icon: Inbox,
    title: 'Unified inbox',
    description:
      'SMS, Google, Facebook, Instagram and website chat — all in one place. No more app-switching.',
  },
  {
    icon: MessageSquareDashed,
    title: 'AI replies in your voice',
    description:
      'Our AI drafts responses that sound like you wrote them. Review and send, or let it fly.',
  },
  {
    icon: Star,
    title: 'Automatic review chasing',
    description:
      'After every job, Say G\'day sends a friendly nudge asking happy customers to leave a Google review.',
  },
  {
    icon: ShieldCheck,
    title: 'Bad-review catcher',
    description:
      'Unhappy? We redirect that feedback privately to you before it ever hits Google. Fix it before it goes public.',
  },
  {
    icon: Bot,
    title: 'AI replies to your reviews',
    description:
      'Every Google review gets a thoughtful reply — automatically. Good for rankings, great for reputation.',
  },
  {
    icon: Globe,
    title: 'Website chat widget',
    description:
      'Embed a chat bubble on your site. Messages land in the same inbox as everything else.',
  },
]

export default function Features() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal mb-3 text-balance">
            Everything you need.{' '}
            <span className="text-teal">Nothing you don&apos;t.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group flex flex-col gap-4 bg-cream rounded-2xl p-6 border border-teal/8 hover:border-teal/20 hover:shadow-md transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center group-hover:bg-teal/15 transition-colors">
                <Icon size={22} className="text-teal" />
              </div>
              <div>
                <h3 className="font-bold text-charcoal mb-1.5">{title}</h3>
                <p className="text-sm text-charcoal/60 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
