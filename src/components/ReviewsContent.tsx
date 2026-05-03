'use client';

import ReviewForm from '@/components/ReviewForm';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Review {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  type: string;
}

const STATS: { value: string; key: 'reviews_stat1_label' | 'reviews_stat2_label' | 'reviews_stat3_label' | 'reviews_stat4_label' }[] = [
  { value: '98%', key: 'reviews_stat1_label' },
  { value: '500+', key: 'reviews_stat2_label' },
  { value: '4.9/5', key: 'reviews_stat3_label' },
  { value: '85%', key: 'reviews_stat4_label' },
];

export default function ReviewsContent({ reviews }: { reviews: Review[] }) {
  const { t } = useLanguage();

  const typeLabel: Record<string, string> = {
    individual: t('reviews_type_individual'),
    couple: t('reviews_type_couple'),
    team: t('reviews_type_group'),
    immersion: t('reviews_type_immersion'),
  };

  return (
    <main id="main-content" className="min-h-screen bg-navy-950 py-16 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl md:text-5xl font-black text-center text-white mb-4">
          {t('reviews_title')}
        </h1>
        <p className="text-xl text-center text-slate-400 mb-4 max-w-2xl mx-auto">
          {t('reviews_sub')}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-16">
          {STATS.map(s => (
            <div key={s.key} className="text-center bg-navy-800 rounded-2xl py-6 border border-navy-700">
              <div className="text-3xl font-black text-ice-400 mb-1">{s.value}</div>
              <div className="text-slate-400 text-sm">{t(s.key)}</div>
            </div>
          ))}
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {reviews.map((r, i) => (
            <div key={r.id ?? i}
              className="bg-navy-800 rounded-2xl p-6 border border-navy-700 hover:border-ice-500/30 transition-all duration-300 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-0.5">
                  {[...Array(r.rating)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <span className="text-xs bg-ice-500/20 text-ice-400 px-3 py-1 rounded-full font-medium">
                  {typeLabel[r.type] ?? r.type}
                </span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5">
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ice-500/30 rounded-full flex items-center justify-center text-ice-400 font-bold text-sm flex-shrink-0">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{r.name}</p>
                  {r.role && <p className="text-slate-500 text-xs">{r.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit form */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-center text-white mb-8">{t('reviews_share_title')}</h2>
          <ReviewForm />
        </div>
      </div>
    </main>
  );
}
