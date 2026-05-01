import Link from 'next/link';

interface Feature {
  icon: string;
  text: string;
}

interface WorkshopCardProps {
  type: 'individual' | 'couple' | 'team' | 'one-on-one';
  title: string;
  subtitle: string;
  description: string;
  price: string;
  priceNote?: string;
  duration: string;
  capacity: string;
  icon: string;
  features: Feature[];
  highlight?: boolean;
  popular?: boolean;
}

const TYPE_THEME = {
  individual:  { from: '#0ea5e9', to: '#0284c7', shadow: 'shadow-sky-500/30',    text: 'text-sky-400',    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
  couple:      { from: '#8b5cf6', to: '#6d28d9', shadow: 'shadow-violet-500/30', text: 'text-violet-400', badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
  'one-on-one':{ from: '#f59e0b', to: '#d97706', shadow: 'shadow-amber-500/30',  text: 'text-amber-400',  badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  team:        { from: '#10b981', to: '#059669', shadow: 'shadow-emerald-500/30', text: 'text-emerald-400',badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
};

export default function WorkshopCard({
  type, title, subtitle, description, price, priceNote,
  duration, capacity, icon, features, highlight = false, popular = false,
}: WorkshopCardProps) {
  const theme = TYPE_THEME[type];

  return (
    <div className={`relative flex flex-col rounded-3xl transition-all duration-300
                     hover:shadow-2xl hover:-translate-y-2 group overflow-hidden
                     ${highlight
                       ? `border-2 border-white/10 shadow-2xl ${theme.shadow}`
                       : 'border border-slate-200 hover:border-slate-300 shadow-md bg-white'
                     }`}
         style={highlight ? { background: 'linear-gradient(160deg, #0f172a 0%, #0c1a2e 100%)' } : undefined}
    >
      {/* Coloured header banner */}
      <div className="relative h-28 flex items-end justify-between px-6 pb-4 overflow-hidden"
           style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-20"
             style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 0%, transparent 50%)' }} />

        {/* Large icon */}
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm
                        border border-white/30 flex items-center justify-center text-4xl
                        shadow-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>

        {/* Popular badge */}
        {popular && (
          <span className="relative z-10 bg-white/95 text-orange-600 text-xs font-black
                           px-3 py-1.5 rounded-full shadow-lg">
            🔥 הכי פופולרי
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        {/* Title */}
        <div className="mb-4">
          <h3 className={`text-lg font-black leading-tight ${highlight ? 'text-white' : 'text-navy-900'}`}>
            {title}
          </h3>
          <p className={`text-sm font-medium mt-0.5 ${theme.text}`}>
            {subtitle}
          </p>
        </div>

        {/* Description */}
        <p className={`mb-5 text-sm leading-relaxed ${highlight ? 'text-slate-400' : 'text-slate-500'}`}>
          {description}
        </p>

        {/* Features */}
        <ul className="space-y-2 mb-5 flex-1">
          {features.map((f, i) => (
            <li key={i} className={`flex items-start gap-2.5 text-sm
                                    ${highlight ? 'text-slate-300' : 'text-slate-600'}`}>
              <span className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center text-xs flex-shrink-0 border
                                ${highlight ? 'bg-white/8 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                {f.icon}
              </span>
              {f.text}
            </li>
          ))}
        </ul>

        {/* Meta pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className={`text-xs px-3 py-1 rounded-full border ${highlight ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
            ⏱ {duration}
          </span>
          <span className={`text-xs px-3 py-1 rounded-full border ${highlight ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
            👥 {capacity}
          </span>
        </div>

        {/* Price + CTA */}
        <div className={`flex items-center justify-between pt-4 border-t
                         ${highlight ? 'border-white/10' : 'border-slate-100'}`}>
          <div>
            <div className={`text-2xl font-black ${highlight ? 'text-white' : 'text-navy-900'}`}>
              {price}
            </div>
            {priceNote && (
              <div className={`text-xs mt-0.5 ${highlight ? 'text-slate-400' : 'text-slate-400'}`}>
                {priceNote}
              </div>
            )}
          </div>
          <Link
            href={`/booking?type=${type}`}
            className="font-bold px-5 py-2.5 rounded-xl text-sm transition-all
                       hover:scale-105 active:scale-100 whitespace-nowrap text-white
                       shadow-lg hover:shadow-xl"
            style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
          >
            הזמינו עכשיו ←
          </Link>
        </div>
      </div>
    </div>
  );
}
