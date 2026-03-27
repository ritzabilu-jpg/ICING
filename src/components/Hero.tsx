import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden
                        bg-navy-900">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 20% 80%, rgba(14, 165, 233, 0.25) 0%, transparent 55%), ' +
            'radial-gradient(ellipse at 80% 15%, rgba(56, 189, 248, 0.2) 0%, transparent 55%), ' +
            'radial-gradient(ellipse at 50% 50%, rgba(15, 23, 42, 0.9) 0%, #0f172a 100%)',
        }}
      />

      {/* Floating ice particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-float"
            style={{
              width: `${[80, 120, 60, 100, 50, 90][i]}px`,
              height: `${[80, 120, 60, 100, 50, 90][i]}px`,
              background: `rgba(14, 165, 233, ${[0.3, 0.15, 0.25, 0.2, 0.3, 0.15][i]})`,
              left: `${[10, 30, 60, 75, 20, 85][i]}%`,
              top: `${[20, 60, 15, 70, 80, 40][i]}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${6 + i * 0.8}s`,
              filter: 'blur(20px)',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-ice-500/20 border border-ice-500/40
                        text-ice-300 rounded-full px-5 py-2 text-sm font-semibold mb-8">
          <span className="w-2 h-2 bg-ice-400 rounded-full animate-pulse-slow" />
          רחובות | רחוב סירני 52 | מתחם הבריכה הטיפולית
        </div>

        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white
                       leading-[1.05] mb-6">
          נכנסים לקרח
          <br />
          <span className="text-ice-400">יוצאים חדים וחסינים</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-slate-300 font-light mb-4 max-w-3xl mx-auto">
          סדנאות אמבטיות קרח מקצועיות ומבוססות מחקר, בליווי מדריכים מוסמכים CWI
        </p>

        {/* Benefits row */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-12
                        text-slate-400 text-sm md:text-base">
          {[
            { icon: '🧠', label: 'חוסן מנטלי' },
            { icon: '🎯', label: 'שיפור פוקוס' },
            { icon: '💆', label: 'הורדת סטרס' },
            { icon: '⚡', label: 'עלייה באנרגיה' },
          ].map(b => (
            <div key={b.label} className="flex items-center gap-2">
              <span>{b.icon}</span>
              <span className="font-medium">{b.label}</span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/booking"
            className="w-full sm:w-auto bg-ice-500 hover:bg-ice-600 text-white font-bold
                       px-10 py-4 rounded-2xl text-xl transition-all duration-200
                       hover:scale-105 shadow-xl shadow-ice-500/30 active:scale-100"
          >
            הזמינו מקום בסדנה הקרובה
          </Link>
          <a
            href="#workshop-types"
            className="w-full sm:w-auto border-2 border-ice-400/60 text-ice-300
                       hover:border-ice-400 hover:bg-ice-400/10
                       font-bold px-10 py-4 rounded-2xl text-xl transition-all duration-200"
          >
            גלו עוד ↓
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            { value: '+127%', label: 'עלייה בנוראדרנלין' },
            { value: '5°C', label: 'טמפרטורת מים' },
            { value: '90 דק\'', label: 'משך הסדנה' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-black text-ice-400 mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
