import { useState } from 'react';

// ─── Hardcoded demo client ID ─────────────────────────────────────────────────
const CLIENT_ID = 'CUSTOMER_ID_123';

// The exact single-line snippet customers paste into their site
const WIDGET_SNIPPET = `<script src="https://[YOUR_NETLIFY_URL]/embed.js?clientId=${CLIENT_ID}" defer></script>`;

export default function Dashboard() {
  // ── Training state ──────────────────────────────────────────────────────────
  const [trainUrl, setTrainUrl] = useState('');
  const [trainStatus, setTrainStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [trainMessage, setTrainMessage] = useState('');

  // ── Widget copy state ───────────────────────────────────────────────────────
  const [copied, setCopied] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────────
  async function handleTrain(e) {
    e.preventDefault();
    if (!trainUrl.trim()) return;

    setTrainStatus('loading');
    setTrainMessage('');

    try {
      const res = await fetch('/api/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trainUrl.trim(), clientId: CLIENT_ID }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Training failed.');

      setTrainStatus('success');
      setTrainMessage(data.message || 'Training complete!');
    } catch (err) {
      setTrainStatus('error');
      setTrainMessage(err.message);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(WIDGET_SNIPPET).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* ── Top nav ── */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Kangaroo emoji as a lightweight logo stand-in */}
          <span className="text-2xl">🦘</span>
          <span className="text-xl font-bold tracking-tight">
            Say G&#x27;day <span className="text-emerald-400">AI</span>
          </span>
        </div>
        <span className="text-sm text-slate-400">Customer Dashboard</span>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        {/* ── Welcome header ── */}
        <section>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back 👋
          </h1>
          <p className="text-slate-400 text-lg">
            Train your AI assistant and drop one line of code into any website to
            add an intelligent chat widget in seconds.
          </p>
        </section>

        {/* ── Train section ── */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div>
            <h2 className="text-xl font-semibold mb-1">🧠 Train Your AI</h2>
            <p className="text-slate-400 text-sm">
              Point us at your website and we&#x27;ll scrape the content, chunk it, and
              build your knowledge base automatically.
            </p>
          </div>

          <form onSubmit={handleTrain} className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              placeholder="Enter your Website URL — e.g. https://yourbusiness.com.au"
              value={trainUrl}
              onChange={(e) => setTrainUrl(e.target.value)}
              required
              aria-label="Train your AI: Enter your Website URL"
              className="flex-1 rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm
                         placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500
                         transition"
            />
            <button
              type="submit"
              disabled={trainStatus === 'loading'}
              className="rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50
                         px-6 py-3 text-sm font-semibold transition whitespace-nowrap"
            >
              {trainStatus === 'loading' ? 'Scraping…' : 'Scrape & Train'}
            </button>
          </form>

          {/* Status feedback */}
          {trainStatus === 'success' && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-300">
              ✅ {trainMessage}
            </div>
          )}
          {trainStatus === 'error' && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-300">
              ❌ {trainMessage}
            </div>
          )}
        </section>

        {/* ── Widget code card ── */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div>
            <h2 className="text-xl font-semibold mb-1">🔌 Your Widget Code</h2>
            <p className="text-slate-400 text-sm">
              Paste this single line into the{' '}
              <code className="text-emerald-400">&lt;head&gt;</code> or before the
              closing <code className="text-emerald-400">&lt;/body&gt;</code> tag of
              any webpage to activate your AI chat widget instantly.
            </p>
          </div>

          {/* Snippet display */}
          <div className="relative group">
            <pre
              className="overflow-x-auto rounded-xl bg-slate-950/70 border border-white/10
                         px-4 py-4 text-sm text-emerald-300 font-mono leading-relaxed
                         whitespace-nowrap"
              aria-label="Widget embed code"
            >
              {WIDGET_SNIPPET}
            </pre>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition
              ${copied
                ? 'bg-emerald-600 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
          >
            {copied ? (
              <>
                <span>✓</span> Copied!
              </>
            ) : (
              <>
                <span>📋</span> Copy to Clipboard
              </>
            )}
          </button>
        </section>

        {/* ── Quick-start guide ── */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">🚀 Quick-Start Checklist</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300">
            <li>Enter your website URL above and click <strong>Scrape &amp; Train</strong>.</li>
            <li>Copy the widget snippet and paste it into your website&#x27;s HTML.</li>
            <li>
              Replace <code className="text-emerald-400">[YOUR_NETLIFY_URL]</code> in
              the snippet with your actual Netlify deployment URL.
            </li>
            <li>
              Visit your site — the chat bubble will appear in the bottom-right corner!
            </li>
          </ol>
        </section>
      </main>
    </div>
  );
}
