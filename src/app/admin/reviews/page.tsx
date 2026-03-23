'use client';

import { useEffect, useState, useCallback } from 'react';

type Review = {
  id: string;
  name: string;
  role: string | null;
  type: string;
  rating: number;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

const typeLabel: Record<string, string> = {
  individual: 'סדנת יחידים',
  couple: 'סדנת זוגות',
  team: 'סדנת קבוצות',
  immersion: 'טבילה אישית',
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [acting, setActing] = useState<string | null>(null);

  const fetchReviews = useCallback(async (key: string) => {
    setLoading(true);
    const res = await fetch(`/api/reviews?key=${encodeURIComponent(key)}`);
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? 'שגיאה'); setLoading(false); return; }
    setReviews(data.reviews);
    setLoading(false);
  }, []);

  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get('key')
      || localStorage.getItem('admin_key')
      || 'lior2026';
    setAdminKey(key);
    fetchReviews(key);
  }, [fetchReviews]);

  async function act(id: string, action: 'approve' | 'reject') {
    setActing(id + action);
    await fetch(`/api/reviews/approve?id=${id}&key=${encodeURIComponent(adminKey)}&action=${action}`);
    await fetchReviews(adminKey);
    setActing(null);
  }

  const pending = reviews.filter(r => r.status === 'pending');
  const approved = reviews.filter(r => r.status === 'approved');
  const rejected = reviews.filter(r => r.status === 'rejected');

  return (
    <main className="min-h-screen bg-navy-950 text-white p-6 md:p-10" dir="rtl">
      <h1 className="text-3xl font-black text-ice-400 mb-2">ניהול חוות דעת</h1>
      <p className="text-slate-400 mb-8">
        ממתינות: <span className="text-yellow-400 font-bold">{pending.length}</span> |
        מאושרות: <span className="text-green-400 font-bold">{approved.length}</span> |
        נדחו: <span className="text-red-400 font-bold">{rejected.length}</span>
      </p>

      {error && <p className="text-red-400 mb-6">{error}</p>}
      {loading && <p className="text-slate-400">טוען...</p>}

      {/* Pending */}
      {pending.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">⏳ ממתינות לאישור</h2>
          <div className="flex flex-col gap-4">
            {pending.map(r => (
              <ReviewCard key={r.id} r={r} acting={acting}
                onApprove={() => act(r.id, 'approve')}
                onReject={() => act(r.id, 'reject')} />
            ))}
          </div>
        </section>
      )}

      {/* Approved */}
      {approved.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-green-400 mb-4">✅ מאושרות ומפורסמות</h2>
          <div className="flex flex-col gap-4">
            {approved.map(r => (
              <ReviewCard key={r.id} r={r} acting={acting}
                onReject={() => act(r.id, 'reject')} />
            ))}
          </div>
        </section>
      )}

      {/* Rejected */}
      {rejected.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-red-400 mb-4">❌ נדחו</h2>
          <div className="flex flex-col gap-4">
            {rejected.map(r => (
              <ReviewCard key={r.id} r={r} acting={acting}
                onApprove={() => act(r.id, 'approve')} />
            ))}
          </div>
        </section>
      )}

      {!loading && reviews.length === 0 && (
        <p className="text-slate-500 text-center py-20">אין חוות דעת עדיין</p>
      )}
    </main>
  );
}

function ReviewCard({ r, acting, onApprove, onReject }: {
  r: Review;
  acting: string | null;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  return (
    <div className="bg-navy-800 rounded-2xl p-5 border border-navy-700">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="font-bold text-white">{r.name}</span>
        {r.role && <span className="text-slate-400 text-sm">{r.role}</span>}
        <span className="text-xs bg-navy-700 text-slate-300 px-2 py-0.5 rounded-full">
          {typeLabel[r.type] ?? r.type}
        </span>
        <span className="text-yellow-400">{'★'.repeat(r.rating)}</span>
        <span className="text-xs text-slate-500 mr-auto">
          {new Date(r.created_at).toLocaleDateString('he-IL')}
        </span>
      </div>
      <p className="text-slate-300 text-sm leading-relaxed mb-4">"{r.text}"</p>
      <div className="flex gap-3">
        {onApprove && (
          <button
            onClick={onApprove}
            disabled={acting !== null}
            className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors">
            {acting === r.id + 'approve' ? '...' : '✅ אשר ופרסם'}
          </button>
        )}
        {onReject && (
          <button
            onClick={onReject}
            disabled={acting !== null}
            className="bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors">
            {acting === r.id + 'reject' ? '...' : '❌ דחה'}
          </button>
        )}
      </div>
    </div>
  );
}
