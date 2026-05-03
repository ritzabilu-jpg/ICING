'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

// ── Types ──────────────────────────────────────────────────────────────────

interface ProductInfo {
  type: 'workshop' | 'immersion';
  id: string;
  title: string;
  date: string;
  time: string;
  price: number;
  instructorName?: string;
  dateISO?: string; // raw ISO datetime for calendar links
}

interface CheckoutState {
  bookingId?: string;
  sessionToken?: string;
  visitorId?: string;
  step: number;
  // participant
  name: string;
  email: string;
  phone: string;
  city: string;
  participants: number;
  // auth
  otpSent: boolean;
  otpVerified: boolean;
  // health
  healthDone: boolean;
  // payment
  paymentMethod: 'credit' | 'bit' | 'paybox' | 'phone' | '';
  paymentConfirmed: boolean;
  confirmationCode?: string;
  preferredHours: string;
}

const STORAGE_KEY = 'ck_v1';
const ADMIN_PHONE = '089310715';

const INITIAL_STATE: CheckoutState = {
  step: 1,
  name: '',
  email: '',
  phone: '',
  city: '',
  participants: 1,
  otpSent: false,
  otpVerified: false,
  healthDone: false,
  paymentMethod: '',
  paymentConfirmed: false,
  preferredHours: 'בכל שעה',
};

// ── Main Page ──────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.productSlug as string;

  const IMMERSION_PACKAGES: Record<string, { title: string; price: number }> = {
    single:   { title: 'טבילה בודדת',     price: 80  },
    '5pack':  { title: 'חבילת 5 טבילות',  price: 350 },
    '10pack': { title: 'חבילת 10 טבילות', price: 550 },
    monthly:  { title: 'חופשי חודשי',     price: 600 },
  };

  const [state, setState] = useState<CheckoutState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [phoneSubmitting, setPhoneSubmitting] = useState(false);
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const [callbackDeadlineStr, setCallbackDeadlineStr] = useState('');
  const [bitClicked, setBitClicked] = useState(false);

  // Auto-advance if stuck at step 2 (OTP/registration removed)
  useEffect(() => {
    if (state.step === 2) {
      save({ step: 3 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.step]);

  // Compute callback deadline string on load
  useEffect(() => {
    setCallbackDeadlineStr(computeDeadlineStr());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Parse slug and load product info + saved state
  useEffect(() => {
    if (!slug) return;

    // slug format: workshop-{UUID} or immersion-{UUID}
    const dashIdx = slug.indexOf('-');
    if (dashIdx === -1) return;
    const type = slug.slice(0, dashIdx) as 'workshop' | 'immersion';
    const id = slug.slice(dashIdx + 1);

    if (type === 'workshop') {
      const wtype = searchParams.get('wtype') ?? 'individual';
      fetch(`/api/workshops/single?id=${id}&type=${wtype}`)
        .then(r => r.json())
        .then(d => {
          if (d.workshop) {
            const w = d.workshop;
            const dt = new Date(w.date_time);
            setProduct({
              type: 'workshop',
              id: w.id,
              title: w.title ?? 'סדנה',
              date: dt.toLocaleDateString('he-IL', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }),
              time: dt.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
              price: w.price,
              instructorName: w.instructor?.name,
              dateISO: dt.toISOString(),
            });
          }
        })
        .catch(() => setMsg('שגיאה בטעינת הסדנה'));
    } else if (type === 'immersion') {
      const pkgKey = searchParams.get('pkg') ?? 'single';
      const pkgInfo = IMMERSION_PACKAGES[pkgKey] ?? IMMERSION_PACKAGES['single'];
      fetch(`/api/immersion-slots/single?id=${id}`)
        .then(r => r.json())
        .then(d => {
          if (d.slot) {
            const s = d.slot;
            setProduct({
              type: 'immersion',
              id: s.id,
              title: `טבילה במים קרים – ${pkgInfo.title}`,
              date: new Date(s.slot_date + 'T00:00:00').toLocaleDateString('he-IL', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              }),
              time: s.slot_time.slice(0, 5),
              price: pkgInfo.price,
              instructorName: s.instructor_name,
              dateISO: s.slot_date + 'T' + s.slot_time.slice(0, 5),
            });
          }
        })
        .catch(() => setMsg('שגיאה בטעינת חלון הטבילה'));
    }

    // Restore saved checkout state — only if same product
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.product_id && parsed.product_id !== id) {
          // Different product — clear stale state
          localStorage.removeItem(STORAGE_KEY);
        } else {
          setState(prev => ({ ...prev, ...parsed }));
        }
      }
    } catch {
      // ignore parse errors
    }

    // Pre-fill profile
    try {
      const profile = localStorage.getItem('client_profile_v1');
      if (profile) {
        const p = JSON.parse(profile);
        setState(prev => ({
          ...prev,
          name: p.name || prev.name,
          email: p.email || prev.email,
          phone: p.phone || prev.phone,
          city: p.city || prev.city,
        }));
      }
    } catch {
      // ignore
    }
  }, [slug]);

  function save(updates: Partial<CheckoutState>) {
    setState(prev => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            product_id: slug?.split('-').slice(1).join('-') ?? '',
            bookingId: next.bookingId,
            sessionToken: next.sessionToken,
            step: next.step,
            paymentMethod: next.paymentMethod,
            otpSent: next.otpSent,
            otpVerified: next.otpVerified,
            healthDone: next.healthDone,
            name: next.name,
            email: next.email,
            phone: next.phone,
            city: next.city,
            participants: next.participants,
            confirmationCode: next.confirmationCode,
          })
        );
      } catch {
        // storage may be unavailable
      }
      return next;
    });
  }

  // ── API calls ────────────────────────────────────────────────────────────

  async function createDraft() {
    if (!product) return;
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('/api/checkout/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_type: product.type, product_id: product.id }),
      });
      const d = await res.json();
      if (d.booking_id) {
        save({ bookingId: d.booking_id, sessionToken: d.session_token, step: 3 });
      } else {
        setMsg(d.error ?? 'שגיאה ביצירת הזמנה');
      }
    } catch {
      setMsg('שגיאת רשת — נסה שנית');
    }
    setLoading(false);
  }

  async function saveParticipants() {
    if (!state.name || !state.phone) { setMsg('יש למלא שם וטלפון'); return; }
    setLoading(true);
    setMsg('');
    try {
      if (state.bookingId && state.sessionToken) {
        await fetch('/api/checkout/draft', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            booking_id: state.bookingId,
            session_token: state.sessionToken,
            user_name: state.name,
            email: state.email,
            phone: state.phone,
            city: state.city,
            participants: state.participants,
          }),
        });
      }
      try {
        localStorage.setItem(
          'client_profile_v1',
          JSON.stringify({ name: state.name, email: state.email, phone: state.phone, city: state.city })
        );
      } catch {
        // ignore
      }
      save({ step: 4 });
    } catch {
      setMsg('שגיאת רשת — נסה שנית');
    }
    setLoading(false);
  }

  async function confirmPayment(method: 'credit' | 'bit' | 'paybox' | 'phone') {
    if (!state.bookingId || !state.sessionToken) return;
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('/api/checkout/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: state.bookingId,
          session_token: state.sessionToken,
          payment_method: method,
        }),
      });
      const d = await res.json();
      if (res.ok) {
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
        save({ paymentMethod: method, confirmationCode: d.confirmation_code, step: 6, paymentConfirmed: true });
      } else {
        setMsg(d.error ?? 'שגיאה באישור התשלום');
      }
    } catch {
      setMsg('שגיאת רשת — נסה שנית');
    }
    setLoading(false);
  }

  function computeDeadlineStr(): string {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const isWeekend = day === 5 || day === 6 || (day === 4 && hour >= 12);
    const hebrewDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    if (isWeekend) {
      const daysToSun = day === 0 ? 7 : (7 - day);
      const sun = new Date(now);
      sun.setDate(now.getDate() + daysToSun);
      return `ביום ${hebrewDays[0]} ${String(sun.getDate()).padStart(2,'0')}/${String(sun.getMonth()+1).padStart(2,'0')} עד שעה 18:00`;
    }
    const dl = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return `ביום ${hebrewDays[dl.getDay()]} ${String(dl.getDate()).padStart(2,'0')}/${String(dl.getMonth()+1).padStart(2,'0')} עד שעה ${String(dl.getHours()).padStart(2,'0')}:${String(dl.getMinutes()).padStart(2,'0')}`;
  }

  async function submitPhoneRequest() {
    if (!state.name || !state.phone) return;
    setPhoneSubmitting(true);
    setMsg('');
    const deadlineStr = computeDeadlineStr();
    setCallbackDeadlineStr(deadlineStr);
    try {
      const res = await fetch('/api/checkout/phone-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.name,
          phone: state.phone,
          email: state.email,
          preferred_hours: state.preferredHours,
          product_title: product?.title,
          product_date: product?.date,
          product_time: product?.time,
          product_date_iso: product?.dateISO,
          booking_id: state.bookingId,
        }),
      });
      const d = await res.json();
      if (res.ok) {
        setCallbackDeadlineStr(d.deadline_str ?? deadlineStr);
        setPhoneSubmitted(true);
        save({ confirmationCode: d.confirmation_code, paymentMethod: 'phone', step: 6 });
      } else {
        setMsg(d.error ?? 'שגיאה בשליחת הפנייה');
      }
    } catch {
      setMsg('שגיאת רשת — נסה שנית');
    }
    setPhoneSubmitting(false);
  }

  function goToTranzila() {
    if (!product || !state.bookingId) return;
    confirmPayment('credit').then(() => {
      const supplier = process.env.NEXT_PUBLIC_TRANZILA_SUPPLIER ?? 'icing';
      const qp = new URLSearchParams({
        sum: String(product.price * state.participants),
        currency: '1',
        lang: 'heb',
        tranmode: 'A',
        email: state.email,
        contact: state.name,
        pdesc: product.title,
        success_url_address: `${window.location.origin}/checkout/success?bookingId=${state.bookingId}&paid=true`,
        fail_url_address: `${window.location.origin}/checkout/failed?bookingId=${state.bookingId}`,
      });
      window.location.href = `https://direct.tranzila.com/${supplier}/iframenew.php?${qp}`;
    });
  }

  const total = product ? product.price * state.participants : 0;

  const stepTitles = [
    '',
    t('checkout_step1'),
    t('checkout_step2'),
    t('checkout_step3'),
    t('checkout_step4'),
    t('checkout_step5'),
    t('checkout_step6'),
  ];

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-navy-900 to-navy-800 py-8 px-4"
      dir="rtl"
    >
      <div className="max-w-lg mx-auto">

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map(n => (
              <div
                key={n}
                className={`flex-1 h-1 rounded-full mx-0.5 transition-all ${
                  state.step > n
                    ? 'bg-ice-400'
                    : state.step === n
                    ? 'bg-white'
                    : 'bg-navy-700'
                }`}
              />
            ))}
          </div>
          <p className="text-ice-300 text-sm text-center">
            {t('checkout_of5').replace('{n}', String(Math.min(state.step, 5)))} — {stepTitles[state.step] ?? ''}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6">

          {/* ── STEP 1: Product Summary ── */}
          {state.step === 1 && (
            <div>
              <h1 className="text-2xl font-black text-navy-900 mb-1">{stepTitles[1]}</h1>

              {!product ? (
                <div className="py-8 text-center text-slate-400">
                  <div className="w-6 h-6 border-2 border-ice-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  {t('checkout_loading')}
                </div>
              ) : (
                <>
                  <div className="bg-ice-50 border border-ice-200 rounded-2xl p-4 my-4 space-y-2 text-sm">
                    <div className="text-xl font-black text-navy-900">{product.title}</div>
                    <div className="text-slate-600">📅 {product.date}</div>
                    <div className="text-slate-600">🕐 {product.time}</div>
                    {product.instructorName && (
                      <div className="text-slate-600">👤 {product.instructorName}</div>
                    )}
                    <div className="text-3xl font-black text-ice-600 pt-2">₪{product.price}</div>
                  </div>
                  {msg && <p className="text-red-500 text-sm mb-3">{msg}</p>}
                  <button
                    onClick={createDraft}
                    disabled={loading}
                    className="w-full bg-ice-600 hover:bg-ice-700 disabled:opacity-50 text-white font-black text-lg py-4 rounded-2xl transition-colors"
                  >
                    {loading ? t('checkout_loading') : t('checkout_continue')}
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── STEP 3: Participants ── */}
          {state.step === 3 && (
            <div>
              <h2 className="text-2xl font-black text-navy-900 mb-4">{stepTitles[3]}</h2>
              <div className="space-y-3">
                <input
                  value={state.name}
                  onChange={e => setState(p => ({ ...p, name: e.target.value }))}
                  placeholder={t('checkout_name_ph') + ' *'}
                  required
                  className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-4 py-3 text-sm focus:outline-none"
                />
                <input
                  value={state.phone}
                  onChange={e => setState(p => ({ ...p, phone: e.target.value }))}
                  placeholder={t('checkout_phone_ph') + ' *'}
                  type="tel"
                  required
                  className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-4 py-3 text-sm focus:outline-none"
                />
                <input
                  value={state.city}
                  onChange={e => setState(p => ({ ...p, city: e.target.value }))}
                  placeholder={t('checkout_city_ph')}
                  className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-4 py-3 text-sm focus:outline-none"
                />

                {product?.type === 'workshop' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">
                      {t('checkout_participants_label')}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={state.participants}
                      onChange={e => setState(p => ({ ...p, participants: Number(e.target.value) }))}
                      className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                )}

                {msg && <p className="text-red-500 text-sm">{msg}</p>}
                <button
                  onClick={saveParticipants}
                  disabled={loading}
                  className="w-full bg-ice-600 hover:bg-ice-700 disabled:opacity-50 text-white font-black text-lg py-4 rounded-2xl transition-colors"
                >
                  {loading ? t('checkout_saving') : t('checkout_next')}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Health Declaration ── */}
          {state.step === 4 && (
            <HealthStep
              bookingId={state.bookingId ?? ''}
              participantName={state.name}
              onDone={() => save({ healthDone: true, step: 5 })}
              onSkip={() => save({ step: 5 })}
            />
          )}

          {/* ── STEP 5: Payment Method ── */}
          {state.step === 5 && !product && (
            <div className="py-8 text-center text-slate-400">
              <div className="w-6 h-6 border-2 border-ice-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              {t('checkout_loading')}
            </div>
          )}
          {state.step === 5 && product && (
            <div>
              <h2 className="text-2xl font-black text-navy-900 mb-1">{stepTitles[5]}</h2>

              {/* Summary bar */}
              <div className="bg-ice-50 border border-ice-200 rounded-xl px-4 py-2 mb-4 flex justify-between items-center">
                <span className="text-slate-600 text-sm">{product.title}</span>
                <span className="font-black text-ice-700 text-lg">₪{total}</span>
              </div>

              <div className="space-y-3">

                {/* Credit card */}
                {state.paymentMethod !== 'credit' ? (
                  <button
                    onClick={() => save({ paymentMethod: 'credit' })}
                    className="w-full border-2 border-slate-200 hover:border-slate-400 rounded-2xl p-4 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-black text-navy-900">{t('checkout_credit')}</div>
                      <div className="text-xs text-slate-500">{t('checkout_credit_secured')}</div>
                    </div>
                    <span className="text-ice-600 text-lg">›</span>
                  </button>
                ) : (
                  <div className="border-2 border-orange-300 bg-orange-50 rounded-2xl p-4">
                    <div className="font-black text-navy-900 mb-3">{t('checkout_credit')}</div>
                    <div className="bg-white border border-orange-200 rounded-xl px-4 py-3 mb-3 text-sm">
                      <p className="text-slate-700">{t('checkout_unavailable')}</p>
                    </div>
                    <button
                      onClick={submitPhoneRequest}
                      disabled={phoneSubmitting || !state.name || !state.phone}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-black py-3 rounded-xl text-sm transition-colors"
                    >
                      {phoneSubmitting ? t('health_saving') : t('checkout_reserve')}
                    </button>
                    <button
                      onClick={() => save({ paymentMethod: '' })}
                      className="w-full text-slate-400 hover:text-slate-600 text-xs mt-2"
                    >
                      {t('checkout_back_payment')}
                    </button>
                  </div>
                )}

                {/* Bit – ACTIVE */}
                {state.paymentMethod !== 'bit' ? (
                  <button
                    onClick={() => save({ paymentMethod: 'bit' })}
                    className="w-full border-2 border-slate-200 hover:border-blue-400 rounded-2xl p-4 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Image src="/Bit logo ביט.png" alt="Bit" width={40} height={24} className="object-contain" unoptimized />
                      <div className="text-right">
                        <div className="font-black text-navy-900">Bit</div>
                        <div className="text-xs text-slate-500">{t('checkout_bit_quick')}</div>
                      </div>
                    </div>
                    <span className="text-ice-600 text-lg">›</span>
                  </button>
                ) : (
                  <div className="border-2 border-blue-400 bg-blue-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Image src="/Bit logo ביט.png" alt="Bit" width={40} height={24} className="object-contain" unoptimized />
                      <div>
                        <div className="font-black text-navy-900">{t('checkout_bit_title')}</div>
                        <div className="text-xs text-slate-500">{t('checkout_bit_direct')}</div>
                      </div>
                    </div>
                      <div className="bg-white border border-blue-200 rounded-xl px-4 py-3 mb-3">
                      <div className="text-center mb-2">
                        <div className="text-xs text-slate-500 mb-0.5">{t('checkout_amount')}</div>
                        <div className="text-3xl font-black text-blue-700">₪{total}</div>
                      </div>
                      <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                        <span className="text-xs text-slate-500">{t('checkout_bit_number_label')}</span>
                        <span className="font-black text-navy-900 text-lg tracking-wide" dir="ltr">052-4500825</span>
                      </div>
                    </div>
                    <div className="bg-blue-100 rounded-xl px-3 py-2 mb-3 text-xs text-blue-900 space-y-1">
                      <p className="font-bold">{t('checkout_bit_steps')}</p>
                      <p>{t('checkout_bit_step1')}</p>
                      <p>2. שלח ₪{total} למספר <span className="font-bold" dir="ltr">052-4500825</span></p>
                      <p>{t('checkout_bit_step3')}</p>
                    </div>
                    {!bitClicked ? (
                      <button
                        onClick={() => setBitClicked(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-center py-3 rounded-xl text-sm transition-colors mb-2"
                      >
                        {t('checkout_bit_opened')}
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800 text-center">
                          {t('checkout_bit_wait')}
                        </div>
                        <button
                          onClick={() => confirmPayment('bit')}
                          disabled={loading}
                          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-black py-3 rounded-xl text-sm transition-colors"
                        >
                          {loading ? t('health_saving') : t('checkout_bit_paid')}
                        </button>
                        <button
                          onClick={() => setBitClicked(false)}
                          className="w-full text-blue-600 text-xs"
                        >
                          {t('checkout_bit_not_yet')}
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => { save({ paymentMethod: '' }); setBitClicked(false); }}
                      className="w-full text-slate-400 hover:text-slate-600 text-xs mt-2"
                    >
                      {t('checkout_back_payment')}
                    </button>
                  </div>
                )}

                {/* Paybox */}
                {state.paymentMethod !== 'paybox' ? (
                  <button
                    onClick={() => save({ paymentMethod: 'paybox' })}
                    className="w-full border-2 border-slate-200 hover:border-slate-400 rounded-2xl p-4 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Image src="/PAYBOX LOGO פייבוקס.jpg" alt="Paybox" width={50} height={24} className="object-contain" unoptimized />
                      <div>
                        <div className="font-black text-navy-900">Paybox</div>
                        <div className="text-xs text-slate-500">{t('checkout_paybox_digital')}</div>
                      </div>
                    </div>
                    <span className="text-ice-600 text-lg">›</span>
                  </button>
                ) : (
                  <div className="border-2 border-orange-300 bg-orange-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Image src="/PAYBOX LOGO פייבוקס.jpg" alt="Paybox" width={50} height={24} className="object-contain" unoptimized />
                      <div className="font-black text-navy-900">Paybox</div>
                    </div>
                    <div className="bg-white border border-orange-200 rounded-xl px-4 py-3 mb-3 text-sm">
                      <p className="text-slate-700">{t('checkout_unavailable')}</p>
                    </div>
                    <button
                      onClick={submitPhoneRequest}
                      disabled={phoneSubmitting || !state.name || !state.phone}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-black py-3 rounded-xl text-sm transition-colors"
                    >
                      {phoneSubmitting ? t('health_saving') : t('checkout_reserve')}
                    </button>
                    <button
                      onClick={() => save({ paymentMethod: '' })}
                      className="w-full text-slate-400 hover:text-slate-600 text-xs mt-2"
                    >
                      {t('checkout_back_payment')}
                    </button>
                  </div>
                )}

                {/* Phone callback – ACTIVE */}
                <div className="border-2 border-ice-400 bg-ice-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">📞</span>
                    <div>
                      <div className="font-black text-navy-900">{t('checkout_phone_callback')}</div>
                      <div className="text-xs text-slate-500">{t('checkout_phone_desc')}</div>
                    </div>
                  </div>

                  {phoneSubmitted ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">✅</div>
                      <p className="font-bold text-green-800 text-sm">{t('checkout_phone_sent')}</p>
                      <p className="text-green-700 text-xs mt-1">נחזור אליך {callbackDeadlineStr}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        value={state.name}
                        onChange={e => setState(p => ({ ...p, name: e.target.value }))}
                        placeholder={t('checkout_name_ph')}
                        className="w-full border border-slate-200 focus:border-ice-400 rounded-xl px-3 py-2 text-sm focus:outline-none"
                      />
                      <input
                        value={state.phone}
                        onChange={e => setState(p => ({ ...p, phone: e.target.value }))}
                        placeholder={t('checkout_phone_ph')}
                        type="tel"
                        className="w-full border border-slate-200 focus:border-ice-400 rounded-xl px-3 py-2 text-sm focus:outline-none"
                      />
                      <input
                        value={state.email}
                        onChange={e => setState(p => ({ ...p, email: e.target.value }))}
                        placeholder={t('checkout_phone_email_ph')}
                        type="email"
                        className="w-full border border-slate-200 focus:border-ice-400 rounded-xl px-3 py-2 text-sm focus:outline-none"
                      />
                      <select
                        value={state.preferredHours}
                        onChange={e => setState(p => ({ ...p, preferredHours: e.target.value }))}
                        className="w-full border border-slate-200 focus:border-ice-400 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white"
                      >
                        <option value={t('checkout_hours_any')}>{t('checkout_hours_any_label')} — {t('checkout_hours_any')}</option>
                        <option value={t('checkout_hours_morning')}>{t('checkout_hours_morning')}</option>
                        <option value={t('checkout_hours_noon')}>{t('checkout_hours_noon')}</option>
                        <option value={t('checkout_hours_afternoon')}>{t('checkout_hours_afternoon')}</option>
                      </select>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800">
                        ⏰ {callbackDeadlineStr ? `נחזור אליך ${callbackDeadlineStr}` : t('checkout_phone_24h')}
                      </div>
                      {msg && <p className="text-red-500 text-xs">{msg}</p>}
                      <button
                        onClick={submitPhoneRequest}
                        disabled={phoneSubmitting || !state.name || !state.phone}
                        className="w-full bg-ice-600 hover:bg-ice-700 disabled:opacity-50 text-white font-black py-3 rounded-xl text-sm transition-colors"
                      >
                        {phoneSubmitting ? t('hc_sending') : t('checkout_phone_send')}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {msg && !state.paymentMethod && <p className="text-red-500 text-sm mt-3">{msg}</p>}
            </div>
          )}

          {/* ── STEP 6: Confirmation ── */}
          {state.step === 6 && (
            <div className="text-center py-4">
              <div className="text-6xl mb-4">🧊</div>
              <h2 className="text-2xl font-black text-navy-900 mb-2">{t('checkout_step6')}</h2>

              {state.paymentMethod === 'credit' && (
                <p className="text-slate-600 mb-4">{t('checkout_confirmed_credit')}</p>
              )}
              {(state.paymentMethod === 'bit' || state.paymentMethod === 'paybox') && (
                <p className="text-slate-600 mb-4">{t('checkout_confirmed_bit')}</p>
              )}
              {state.paymentMethod === 'phone' && (
                <p className="text-slate-600 mb-4">{t('checkout_confirmed_phone')}</p>
              )}

              {state.confirmationCode && (
                <div className="bg-ice-50 border border-ice-200 rounded-2xl p-4 mb-4">
                  <p className="text-xs text-slate-500 mb-1">{t('checkout_confirm_code')}</p>
                  <p className="font-black text-navy-900 text-2xl font-mono tracking-wider">
                    {state.confirmationCode}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 items-center">
                <button
                  onClick={() => {
                    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
                    router.push('/');
                  }}
                  className="bg-ice-600 hover:bg-ice-700 text-white font-bold px-8 py-3 rounded-2xl"
                >
                  {t('checkout_home')}
                </button>
                <button
                  onClick={() => router.push('/science')}
                  className="border-2 border-ice-400 text-ice-700 hover:bg-ice-50 font-bold px-8 py-3 rounded-2xl transition-colors text-sm"
                >
                  {t('checkout_science_link')}
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="border-2 border-navy-300 text-navy-700 hover:bg-navy-50 font-bold px-8 py-3 rounded-2xl transition-colors text-sm"
                >
                  {t('checkout_my_bookings')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Back button */}
        {state.step > 1 && state.step < 6 && (
          <button
            onClick={() => { setMsg(''); save({ step: state.step - 1 }); }}
            className="mt-4 text-ice-300 hover:text-white text-sm font-semibold mx-auto block"
          >
            {t('checkout_back')}
          </button>
        )}
      </div>
    </main>
  );
}

// ── Health Step ────────────────────────────────────────────────────────────

function HealthStep({
  bookingId,
  participantName,
  onDone,
  onSkip,
}: {
  bookingId: string;
  participantName: string;
  onDone: () => void;
  onSkip: () => void;
}) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    has_heart_condition: false,
    has_hypertension: false,
    is_pregnant: false,
    has_raynauds: false,
    has_open_wounds: false,
    other_conditions: '',
    participant_name: participantName,
  });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function submit() {
    if (!agreed) { setMsg(t('health_confirm_required')); return; }
    if (!form.participant_name) { setMsg(t('health_name_required')); return; }
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('/api/health-declarations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          booking_id: bookingId,
          signature: 'checkbox-approved',
        }),
      });
      const d = await res.json();
      if (res.ok) {
        onDone();
      } else if (res.status === 422 && d.requiresDoctorApproval) {
        setMsg(`⚠️ ${d.message ?? 'נמצאו מצבים המצריכים אישור רופא לפני השתתפות.'}`);
      } else {
        setMsg(d.error ?? 'שגיאה בשמירת ההצהרה');
      }
    } catch {
      setMsg('שגיאת רשת — נסה שנית');
    }
    setLoading(false);
  }

  const CONDITIONS: [keyof typeof form, string][] = [
    ['has_heart_condition', t('health_condition')],
    ['is_pregnant', t('health_pregnant')],
    ['has_raynauds', t('health_raynauds')],
    ['has_hypertension', t('health_hypertension')],
    ['has_open_wounds', t('health_wounds')],
  ];

  return (
    <div>
      <h2 className="text-2xl font-black text-navy-900 mb-1">{t('checkout_step4')}</h2>
      <p className="text-slate-500 text-xs mb-4">
        {t('health_before')}
      </p>

      <div className="space-y-2 text-sm mb-4">
        {CONDITIONS.map(([k, label]) => (
          <label key={k} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form[k] as boolean}
              onChange={e => setForm(p => ({ ...p, [k]: e.target.checked }))}
              className="w-4 h-4 accent-ice-500"
            />
            <span>{label}</span>
          </label>
        ))}
      </div>

      <label className="block text-sm font-semibold text-slate-700 mb-1">{t('health_full_name')}</label>
      <input
        value={form.participant_name}
        onChange={e => setForm(p => ({ ...p, participant_name: e.target.value }))}
        placeholder={t('health_participant_ph')}
        className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 text-sm mb-4 focus:outline-none focus:border-ice-400"
      />

      <label className="flex items-start gap-3 cursor-pointer mb-4 bg-ice-50 border border-ice-200 rounded-xl p-3">
        <input
          type="checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          className="w-5 h-5 mt-0.5 accent-ice-500 flex-shrink-0"
        />
        <span className="text-sm text-slate-700 leading-relaxed">
          {t('health_agree')}
        </span>
      </label>

      {msg && <p className="text-red-500 text-sm mb-2">{msg}</p>}

      <div className="flex gap-2">
        <button
          onClick={submit}
          disabled={loading || !agreed}
          className="flex-1 bg-ice-600 hover:bg-ice-700 disabled:opacity-50 text-white font-bold py-3 rounded-2xl text-sm"
        >
          {loading ? t('health_saving') : t('health_submit')}
        </button>
        <button
          onClick={onSkip}
          className="px-4 py-3 text-slate-400 hover:text-slate-600 text-sm"
        >
          {t('health_skip')}
        </button>
      </div>
    </div>
  );
}
