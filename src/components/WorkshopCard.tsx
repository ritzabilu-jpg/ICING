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
                     hover:shadow-2xl hover:-translate-y-2 group
                     ${highlight
                       ? 'bg-navy-900 border-ice-500 shadow-xl shadow-ice-500/20'
                       : 'bg-white border-ice-100 hover:border-ice-400 shadow-lg'
                     }`}>
      <div className="p-8 flex flex-col flex-1">
        {popular && (
          <div className="flex justify-center mb-4 -mt-4">
            <span className="bg-orange-500 text-white text-sm font-black px-6 py-2 rounded-full shadow-lg shadow-orange-500/40 animate-pulse-slow">
              🔥 הכי פופולרי
            </span>
          </div>
        )}
        {/* Icon + Title */}
        <div className="flex items-start gap-4 mb-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0
                           ${highlight ? 'bg-ice-500/20' : 'bg-ice-50'}`}>
            {icon}
          </div>
          <div>
            <h3 className={`text-xl font-black ${highlight ? 'text-white' : 'text-navy-900'}`}>
              {title}
            </h3>
            <p className={`text-sm font-medium ${highlight ? 'text-ice-400' : 'text-ice-600'}`}>
              {subtitle}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className={`mb-6 text-sm leading-relaxed ${highlight ? 'text-slate-300' : 'text-slate-600'}`}>
          {description}
        </p>

        {/* Features */}
        <ul className="space-y-2.5 mb-6 flex-1">
          {features.map((f, i) => (
            <li key={i} className={`flex items-center gap-2.5 text-sm
                                    ${highlight ? 'text-slate-300' : 'text-slate-600'}`}>
              <span className="text-base flex-shrink-0">{f.icon}</span>
              {f.text}
            </li>
          ))}
        </ul>

        {/* Meta info */}
        <div className={`flex items-center gap-4 text-xs pb-5 mb-5 border-b
                         ${highlight ? 'text-slate-400 border-navy-700' : 'text-slate-500 border-slate-100'}`}>
          <span>⏱ {duration}</span>
          <span>👥 {capacity}</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className={`text-3xl font-black ${highlight ? 'text-ice-400' : 'text-ice-600'}`}>
              {price}
            </div>
            {priceNote && (
              <div className={`text-xs mt-0.5 ${highlight ? 'text-slate-400' : 'text-slate-500'}`}>
                {priceNote}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <Link
              href={`/booking?type=${type}`}
              className={`font-bold px-5 py-2.5 rounded-xl text-sm transition-all
                          hover:scale-105 whitespace-nowrap
                          ${highlight
                            ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/40'
                            : 'bg-navy-900 hover:bg-navy-800 text-white'
                          }`}
            >
              הזמינו עכשיו
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
