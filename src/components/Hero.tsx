import Link from 'next/link';

const SNOWFLAKES = [
  { left: '8%',  delay: '0s',   dur: '7s',  size: 6,  opacity: 0.5 },
  { left: '18%', delay: '1.5s', dur: '9s',  size: 4,  opacity: 0.35 },
  { left: '32%', delay: '0.8s', dur: '6s',  size: 8,  opacity: 0.45 },
  { left: '47%', delay: '2.2s', dur: '10s', size: 5,  opacity: 0.3 },
  { left: '61%', delay: '0.3s', dur: '8s',  size: 7,  opacity: 0.4 },
  { left: '74%', delay: '1.8s', dur: '7.5s',size: 4,  opacity: 0.35 },
  { left: '85%', delay: '0.6s', dur: '9.5s',size: 6,  opacity: 0.5 },
  { left: '93%', delay: '2.8s', dur: '6.5s',size: 5,  opacity: 0.3 },
];

export default function Hero() {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-navy-900">

      {/* ── Layer 1: deep animated gradient ── */}
      <div className="absolute inset-0 animate-gradient-shift"
           style={{
             background: 'linear-gradient(135deg, #060d1a, #0a1929, #071422, #060d1a)',
             backgroundSize: '400% 400%',
           }} />

      {/* ── Layer 2: radial glows ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute animate-drift"
             style={{
               width: '600px', height: '600px',
               top: '-15%', left: '-10%',
               background: 'radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 65%)',
               animationDelay: '0s', animationDuration: '12s',
             }} />
        <div className="absolute animate-drift"
             style={{
               width: '500px', height: '500px',
               bottom: '-10%', right: '-8%',
               background: 'radial-gradient(circle, rgba(56,189,248,0.14) 0%, transparent 65%)',
               animationDelay: '3s', animationDuration: '14s',
             }} />
        <div className="absolute animate-drift"
             style={{
               width: '400px', height: '400px',
               top: '30%', left: '40%',
               background: 'radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 65%)',
               animationDelay: '6s', animationDuration: '10s',
             }} />
      </div>

      {/* ── Layer 3: falling snowflakes ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {SNOWFLAKES.map((s, i) => (
          <div key={i} className="absolute animate-snow rounded-full bg-ice-200"
               style={{
                 left: s.left,
                 top: '-20px',
                 width: s.size,
                 height: s.size,
                 opacity: s.opacity,
                 animationDelay: s.delay,
                 animationDuration: s.dur,
               }} />
        ))}
      </div>

      {/* ── Layer 4: ripple rings behind heading ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 rounded-full border border-ice-500/20 animate-ripple" />
        <div className="absolute w-64 h-64 rounded-full border border-ice-400/15 animate-ripple-delay" />
        <div className="absolute w-64 h-64 rounded-full border border-ice-300/10 animate-ripple-delay2" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* Badge – fade in first */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2 bg-ice-500/15 border border-ice-500/30
                          text-ice-300 rounded-full px-5 py-2 text-sm font-semibold mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-ice-400 rounded-full animate-pulse-slow" />
            רחובות | רחוב סירני 52 | מתחם הבריכה הטיפולית
          </div>
        </div>

        {/* Main heading – fade in with shimmer */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] mb-6">
            <span className="text-white">נכנסים לקרח</span>
            <br />
            <span className="hero-shimmer-text">יוצאים חדים וחסינים</span>
          </h1>
        </div>

        {/* Subheading */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-xl md:text-2xl text-slate-300 font-light mb-6 max-w-3xl mx-auto">
            סדנאות אמבטיות קרח מקצועיות ומבוססות מחקר, בליווי מדריכים מוסמכים CWI
          </p>
        </div>

        {/* Benefits pills */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.55s' }}>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {[
              { icon: '🧠', label: 'חוסן מנטלי' },
              { icon: '🎯', label: 'שיפור פוקוס' },
              { icon: '💆', label: 'הורדת סטרס' },
              { icon: '⚡', label: 'עלייה באנרגיה' },
            ].map(b => (
              <span key={b.label}
                    className="flex items-center gap-1.5 bg-white/5 border border-white/10
                               backdrop-blur-sm text-slate-300 text-sm font-medium
                               px-4 py-1.5 rounded-full">
                <span>{b.icon}</span>
                {b.label}
              </span>
            ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/booking"
              className="relative overflow-hidden w-full sm:w-auto text-white font-bold
                         px-10 py-4 rounded-2xl text-xl transition-all duration-200
                         hover:scale-105 active:scale-100 shadow-2xl shadow-orange-500/30
                         bg-gradient-to-l from-orange-500 to-orange-400 hover:shadow-orange-500/50"
            >
              <span className="relative z-10">הזמינו מקום בסדנה הקרובה</span>
              <span className="absolute inset-0 bg-gradient-to-l from-orange-400 via-white/20 to-orange-400
                               opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <a
              href="#workshop-types"
              className="w-full sm:w-auto border-2 border-ice-400/50 text-ice-300
                         hover:border-ice-400 hover:bg-ice-400/10 backdrop-blur-sm
                         font-bold px-10 py-4 rounded-2xl text-xl transition-all duration-200"
            >
              גלו עוד ↓
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div className="animate-fade-in-up mt-14" style={{ animationDelay: '0.9s' }}>
          <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
            {[
              { href: '/#agenda', value: '+127%', label: 'עלייה בנוראדרנלין', sub: 'קרא עוד ↗' },
              { href: null,       value: '5°C',   label: 'טמפרטורת מים',     sub: 'פרוטוקול CWI' },
              { href: '/#agenda', value: "90 דק'", label: 'משך הסדנה',       sub: 'מבנה מלא ↓' },
            ].map((s, i) => {
              const cls = `group text-center px-4 py-4 rounded-2xl border border-white/10
                           bg-white/5 backdrop-blur-sm transition-all duration-300
                           ${s.href ? 'hover:bg-white/10 hover:border-ice-400/30 cursor-pointer' : ''}`;
              const inner = (
                <>
                  <div className="text-2xl md:text-3xl font-black text-ice-300 mb-1 group-hover:text-ice-200 transition-colors">
                    {s.value}
                  </div>
                  <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors leading-tight">
                    {s.label}
                  </div>
                  <div className="text-[10px] text-slate-600 group-hover:text-ice-400 transition-colors mt-1">
                    {s.sub}
                  </div>
                </>
              );
              return s.href
                ? <a key={i} href={s.href} className={cls}>{inner}</a>
                : <div key={i} className={cls}>{inner}</div>;
            })}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-600 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
