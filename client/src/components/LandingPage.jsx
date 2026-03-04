import { Link } from 'react-router-dom';

const features = [
  {
    icon: '🔥',
    title: 'Streak Tracking',
    description: 'Daily routines that reset every morning. Miss a day and your streak resets — the pressure keeps you honest.'
  },
  {
    icon: '⭐',
    title: 'Score System',
    description: 'Earn points for every task you complete. Important tasks pay more. Missed deadlines cost you. Every decision counts.'
  },
  {
    icon: '📊',
    title: 'Real Analytics',
    description: 'See exactly how productive you\'ve been over the last 14 days. No fluff, just your actual data.'
  },
  {
    icon: '⚡',
    title: 'Built for Focus',
    description: 'One-off tasks for your to-do list. Daily routines for your habits. Two tools, one dashboard, zero clutter.'
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-body">

      {/* Nav */}
      <nav className="border-b border-zinc-800/60 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <span className="font-display font-bold text-xl tracking-tight">⚡ Momentum</span>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-zinc-400 hover:text-white transition"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="text-sm bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
          Gamified productivity — actually works
        </div>

        <h1 className="font-display font-bold text-4xl sm:text-6xl text-white leading-tight tracking-tight mb-6">
          Stop managing tasks.
          <br />
          <span className="text-violet-400">Start building momentum.</span>
        </h1>

        <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Most to-do apps are passive lists. Momentum uses streaks, scoring, and daily resets
          to make discipline feel like a game you actually want to win.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            to="/register"
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition shadow-lg shadow-violet-900/30"
          >
            Start for free →
          </Link>
          <Link
            to="/login"
            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-zinc-800/60 py-8">
        <div className="max-w-3xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
          {[
            { value: '+10 pts', label: 'per task done' },
            { value: '+25 pts', label: 'per important task' },
            { value: '+50 pts', label: '7-day streak bonus' }
          ].map(s => (
            <div key={s.label}>
              <p className="font-display font-bold text-2xl text-violet-400">{s.value}</p>
              <p className="text-zinc-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-center mb-12">
          Everything you need. Nothing you don't.
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map(f => (
            <div
              key={f.title}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 transition"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-display font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-br from-violet-900/30 to-zinc-900 border border-violet-500/20 rounded-2xl p-10 text-center">
          <h2 className="font-display font-bold text-2xl sm:text-3xl mb-3">
            Your streak starts today.
          </h2>
          <p className="text-zinc-400 text-sm mb-6">Free. No credit card. Just discipline.</p>
          <Link
            to="/register"
            className="inline-block bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl font-semibold text-sm transition shadow-lg shadow-violet-900/40"
          >
            Create your account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 px-6 py-6 text-center text-zinc-600 text-xs">
        Built with focus. © {new Date().getFullYear()} Momentum.
      </footer>
    </div>
  );
}