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

export default function WorkshopCard({
  type, title, subtitle, description, price, priceNote,
  duration, capacity, icon, features, highlight = false, popular = false,
}: WorkshopCardProps) {
  return (
    <div className={`relative flex flex-col rounded-3xl border-2 transition-all duration-300
                     hover:shadow-2xl hover:-translate-y-2 group overflow-hidden
                     ${highlight
                       ? 'border-ice-500/60 shadow-2xl shadow-ice-500/25'
                       : 'bg-white border-ice-100 hover:border-ice-300 shadow-lg'
                     }`}
         style={highlight ? {
           background: 'linear-gradient(145deg, #0f172a 0%, #0c1a2e 50%, #0f172a 100%)',
         } : undefined}
    >
      {/* Glow accent bar at top for highlight cards */}
      {highlight && (
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-ice-400 to-transparent" />
      )}

      <div className="p-7 flex flex-col flex-1">
        {popular && (
          <div className="flex justify-center mb-4 -mt-3">
            <span className="bg-gradient-to-r from-orange-500 to-orange-400 text-white text-sm font-black px-6 py-1.5 rounded-full shadow-lg shadow-orange-500/40">
              🔥 הכי פופולרי
            </span>
          </div>
        )}

        {/* Icon + Title */}
        <div className="flex items-start gap-4 mb-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 border
                           ${highlight
                             ? 'bg-ice-500/15 border-ice-500/30'
                             : 'bg-gradient-to-br from-ice-50 to-white border-ice-100'}`}>
            {icon}
          </div>
          <div>
            <h3 className={`text-xl font-black leading-tight ${highlight ? 'text-white' : 'text-navy-900'}`}>
              {title}
            </h3>
            <p className={`text-sm font-medium mt-0.5 ${highlight ? 'text-ice-400' : 'text-ice-600'}`}>
              {subtitle}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className={`mb-5 text-sm leading-relaxed ${highlight ? 'text-slate-300' : 'text-slate-500'}`}>
          {description}
        </p>

        {/* Features */}
        <ul className="space-y-2 mb-5 flex-1">
          {features.map((f, i) => (
            <li key={i} className={`flex items-center gap-2.5 text-sm
                                    ${highlight ? 'text-slate-300' : 'text-slate-600'}`}>
              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs flex-shrink-0
                                ${highlight ? 'bg-ice-500/15' : 'bg-ice-50'}`}>
                {f.icon}
              </span>
              {f.text}
            </li>
          ))}
        </ul>

        {/* Meta info */}
        <div className={`flex items-center gap-3 text-xs pb-5 mb-5 border-b flex-wrap
                         ${highlight ? 'text-slate-400 border-white/10' : 'text-slate-400 border-slate-100'}`}>
          <span className={`flex items-center gap-1 px-2 py-1 rounded-full
                            ${highlight ? 'bg-white/5' : 'bg-slate-50'}`}>
            ⏱ {duration}
          </span>
          <span className={`flex items-center gap-1 px-2 py-1 rounded-full
                            ${highlight ? 'bg-white/5' : 'bg-slate-50'}`}>
            👥 {capacity}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className={`text-3xl font-black tracking-tight
                             ${highlight ? 'text-ice-300' : 'text-ice-600'}`}>
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
            className={`font-bold px-5 py-2.5 rounded-xl text-sm transition-all
                        hover:scale-105 active:scale-100 whitespace-nowrap
                        ${highlight
                          ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60'
                          : 'bg-navy-900 hover:bg-navy-800 text-white shadow-md shadow-navy-900/20'
                        }`}
          >
            הזמינו עכשיו
          </Link>
        </div>
      </div>
    </div>
  );
}
