'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SignatureCanvas from 'react-signature-canvas';

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
  preferredHours: '',
};

// ── Main Page ──────────────────────────────────────────────────────────────

export default function CheckoutPage() {
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
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [phoneSubmitting, setPhoneSubmitting] = useState(false);
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const [callbackDeadlineStr, setCallbackDeadlineStr] = useState('');

  // OTP countdown timer
  useEffect(() => {
    if (otpTimer <= 0) return;
    const t = setTimeout(() => setOtpTimer(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [otpTimer]);

  // Auto-advance if otpVerified is true but stuck at step 2 (stale localStorage)
  useEffect(() => {
    if (state.step === 2 && state.otpVerified) {
      const t = setTimeout(() => save({ step: 3 }), 800);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.step, state.otpVerified]);

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
      fetch(`/api/workshops/single?id=${id}`)
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

    // Restore saved checkout state
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(prev => ({ ...prev, ...parsed }));
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
        save({ bookingId: d.booking_id, sessionToken: d.session_token, step: 2 });
      } else {
        setMsg(d.error ?? 'שגיאה ביצירת הזמנה');
      }
    } catch {
      setMsg('שגיאת רשת — נסה שנית');
    }
    setLoading(false);
  }

  async function sendOtp() {
    if (!state.email) { setMsg('יש להזין אימייל'); return; }
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state.email, name: state.name || 'משתמש' }),
      });
      const d = await res.json();
      if (res.ok) {
        save({ otpSent: true });
        setOtpTimer(60);
      } else {
        setMsg(d.error ?? 'שגיאה בשליחת קוד');
      }
    } catch {
      setMsg('שגיאת רשת — נסה שנית');
    }
    setLoading(false);
  }

  async function verifyOtp() {
    if (!otpCode) return;
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state.email, code: otpCode }),
      });
      const d = await res.json();
      if (res.ok) {
        try {
          localStorage.setItem(
            'client_profile_v1',
            JSON.stringify({ name: state.name, email: state.email, phone: state.phone, city: state.city })
          );
        } catch {
          // ignore
        }
        save({ otpVerified: true, visitorId: d.id, step: 3 });
      } else {
        setMsg(d.error ?? 'קוד שגוי');
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
    if (!state.name || !state.phone || !state.preferredHours) return;
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
        save({ confirmationCode: d.confirmation_code, paymentMethod: 'phone' });
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
    'סיכום ההזמנה',
    'כניסה / הרשמה',
    'פרטי משתתפים',
    'הצהרת בריאות',
    'בחירת תשלום',
    'ההזמנה אושרה',
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
            שלב {Math.min(state.step, 5)} מתוך 5 — {stepTitles[state.step] ?? ''}
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
                  טוען...
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
                    {loading ? 'טוען...' : 'המשך לרכישה ›'}
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── STEP 2: Auth (OTP) ── */}
          {state.step === 2 && (
            <div>
              <h2 className="text-2xl font-black text-navy-900 mb-1">{stepTitles[2]}</h2>
              <p className="text-slate-500 text-sm mb-4">נשלח קוד חד-פעמי למייל שלך</p>

              {state.otpVerified ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center text-green-700 font-bold">
                  ✅ אומת בהצלחה! מעביר לשלב הבא...
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    value={state.name}
                    onChange={e => setState(p => ({ ...p, name: e.target.value }))}
                    placeholder="שם מלא"
                    className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <input
                      value={state.email}
                      onChange={e => setState(p => ({ ...p, email: e.target.value }))}
                      placeholder="כתובת אימייל"
                      type="email"
                      className="flex-1 border-2 border-slate-200 focus:border-ice-400 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                    <button
                      onClick={sendOtp}
                      disabled={loading || !state.email || otpTimer > 0}
                      className="bg-navy-800 text-white font-bold px-4 py-3 rounded-xl text-sm disabled:opacity-50 whitespace-nowrap"
                    >
                      {otpTimer > 0 ? `${otpTimer}ש׳` : 'שלח קוד'}
                    </button>
                  </div>

                  {state.otpSent && (
                    <div className="flex gap-2">
                      <input
                        value={otpCode}
                        onChange={e => setOtpCode(e.target.value)}
                        maxLength={6}
                        placeholder="קוד 6 ספרות"
                        className="flex-1 border-2 border-slate-200 focus:border-ice-400 rounded-xl px-4 py-3 text-sm focus:outline-none text-center font-mono text-xl tracking-widest"
                      />
                      <button
                        onClick={verifyOtp}
                        disabled={loading || otpCode.length !== 6}
                        className="bg-ice-600 text-white font-bold px-4 py-3 rounded-xl text-sm disabled:opacity-50"
                      >
                        אמת ✓
                      </button>
                    </div>
                  )}

                  {msg && <p className="text-red-500 text-sm">{msg}</p>}
                </div>
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
                  placeholder="שם מלא *"
                  required
                  className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-4 py-3 text-sm focus:outline-none"
                />
                <input
                  value={state.phone}
                  onChange={e => setState(p => ({ ...p, phone: e.target.value }))}
                  placeholder="טלפון נייד *"
                  type="tel"
                  required
                  className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-4 py-3 text-sm focus:outline-none"
                />
                <input
                  value={state.city}
                  onChange={e => setState(p => ({ ...p, city: e.target.value }))}
                  placeholder="עיר מגורים"
                  className="w-full border-2 border-slate-200 focus:border-ice-400 rounded-xl px-4 py-3 text-sm focus:outline-none"
                />

                {product?.type === 'workshop' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">
                      מספר משתתפים
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
                  {loading ? 'שומר...' : 'המשך ›'}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Health Declaration ── */}
          {state.step === 4 && (
            <HealthStep
              bookingId={state.bookingId ?? ''}
              onDone={() => save({ healthDone: true, step: 5 })}
              onSkip={() => save({ step: 5 })}
            />
          )}

          {/* ── STEP 5: Payment Method ── */}
          {state.step === 5 && product && (
            <div>
              <h2 className="text-2xl font-black text-navy-900 mb-1">{stepTitles[5]}</h2>

              {/* Summary bar */}
              <div className="bg-ice-50 border border-ice-200 rounded-xl px-4 py-2 mb-4 flex justify-between items-center">
                <span className="text-slate-600 text-sm">{product.title}</span>
                <span className="font-black text-ice-700 text-lg">₪{total}</span>
              </div>

              <div className="space-y-3">

                {/* Credit card – coming soon */}
                <div className="w-full border-2 border-slate-100 rounded-2xl p-4 flex items-center justify-between opacity-25 cursor-not-allowed bg-slate-50">
                  <div>
                    <div className="font-black text-slate-400">💳 כרטיס אשראי</div>
                    <div className="text-xs text-slate-300">מאובטח על-ידי טרנזילה</div>
                  </div>
                  <span className="text-xs font-bold bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">בקרוב</span>
                </div>

                {/* Bit – coming soon */}
                <div className="w-full border-2 border-slate-100 rounded-2xl p-4 flex items-center justify-between opacity-25 cursor-not-allowed bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Image src="/Bit logo ביט.png" alt="Bit" width={40} height={24} className="object-contain grayscale" unoptimized />
                    <div>
                      <div className="font-black text-slate-400">Bit</div>
                      <div className="text-xs text-slate-300">העברה מהירה</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">בקרוב</span>
                </div>

                {/* Paybox – coming soon */}
                <div className="w-full border-2 border-slate-100 rounded-2xl p-4 flex items-center justify-between opacity-25 cursor-not-allowed bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Image src="/PAYBOX LOGO פייבוקס.jpg" alt="Paybox" width={50} height={24} className="object-contain grayscale" unoptimized />
                    <div>
                      <div className="font-black text-slate-400">Paybox</div>
                      <div className="text-xs text-slate-300">תשלום דיגיטלי</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">בקרוב</span>
                </div>

                {/* Phone callback – ACTIVE */}
                <div className="border-2 border-ice-400 bg-ice-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">📞</span>
                    <div>
                      <div className="font-black text-navy-900">תשלום טלפוני</div>
                      <div className="text-xs text-slate-500">ניצור קשר ונסגור את ההזמנה יחד</div>
                    </div>
                  </div>

                  {phoneSubmitted ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">✅</div>
                      <p className="font-bold text-green-800 text-sm">הפנייה נשלחה!</p>
                      <p className="text-green-700 text-xs mt-1">נחזור אליך {callbackDeadlineStr}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        value={state.name}
                        onChange={e => setState(p => ({ ...p, name: e.target.value }))}
                        placeholder="שם מלא"
                        className="w-full border border-slate-200 focus:border-ice-400 rounded-xl px-3 py-2 text-sm focus:outline-none"
                      />
                      <input
                        value={state.phone}
                        onChange={e => setState(p => ({ ...p, phone: e.target.value }))}
                        placeholder="מספר טלפון"
                        type="tel"
                        className="w-full border border-slate-200 focus:border-ice-400 rounded-xl px-3 py-2 text-sm focus:outline-none"
                      />
                      <input
                        value={state.email}
                        onChange={e => setState(p => ({ ...p, email: e.target.value }))}
                        placeholder="כתובת אימייל (לקבלת אישור)"
                        type="email"
                        className="w-full border border-slate-200 focus:border-ice-400 rounded-xl px-3 py-2 text-sm focus:outline-none"
                      />
                      <select
                        value={state.preferredHours}
                        onChange={e => setState(p => ({ ...p, preferredHours: e.target.value }))}
                        className="w-full border border-slate-200 focus:border-ice-400 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white"
                      >
                        <option value="">באיזה שעות נוח לך? *</option>
                        <option value="בוקר 08:00-12:00">בוקר 08:00–12:00</option>
                        <option value="צהריים 12:00-16:00">צהריים 12:00–16:00</option>
                        <option value="אחה״צ 16:00-20:00">אחה״צ 16:00–20:00</option>
                        <option value="כל שעה">כל שעה</option>
                      </select>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800">
                        ⏰ {callbackDeadlineStr ? `נחזור אליך ${callbackDeadlineStr}` : 'נחזור אליך תוך 24 שעות'}
                      </div>
                      {msg && <p className="text-red-500 text-xs">{msg}</p>}
                      <button
                        onClick={submitPhoneRequest}
                        disabled={phoneSubmitting || !state.name || !state.phone || !state.preferredHours}
                        className="w-full bg-ice-600 hover:bg-ice-700 disabled:opacity-50 text-white font-black py-3 rounded-xl text-sm transition-colors"
                      >
                        {phoneSubmitting ? 'שולח...' : 'שלח פנייה — נחזור אליך ›'}
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
              <h2 className="text-2xl font-black text-navy-900 mb-2">ההזמנה אושרה!</h2>

              {state.paymentMethod === 'credit' && (
                <p className="text-slate-600 mb-4">התשלום התקבל. נשלח אישור לאימייל שלך.</p>
              )}
              {(state.paymentMethod === 'bit' || state.paymentMethod === 'paybox') && (
                <p className="text-slate-600 mb-4">קיבלנו את אישורך. נאמת ב-24 שעות ונשלח אישור למייל.</p>
              )}
              {state.paymentMethod === 'phone' && (
                <p className="text-slate-600 mb-4">נחזור אליך תוך 24 שעות לסיום התשלום.</p>
              )}

              {state.confirmationCode && (
                <div className="bg-ice-50 border border-ice-200 rounded-2xl p-4 mb-4">
                  <p className="text-xs text-slate-500 mb-1">קוד אישור</p>
                  <p className="font-black text-navy-900 text-2xl font-mono tracking-wider">
                    {state.confirmationCode}
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
                  router.push('/');
                }}
                className="bg-ice-600 hover:bg-ice-700 text-white font-bold px-8 py-3 rounded-2xl"
              >
                חזרה לדף הבית
              </button>
            </div>
          )}
        </div>

        {/* Back button */}
        {state.step > 1 && state.step < 6 && (
          <button
            onClick={() => { setMsg(''); save({ step: state.step - 1 }); }}
            className="mt-4 text-ice-300 hover:text-white text-sm font-semibold mx-auto block"
          >
            ← חזרה לשלב הקודם
          </button>
        )}
      </div>
    </main>
  );
}

// ── Health Step ────────────────────────────────────────────────────────────

function HealthStep({
  bookingId,
  onDone,
  onSkip,
}: {
  bookingId: string;
  onDone: () => void;
  onSkip: () => void;
}) {
  const sigRef = useRef<SignatureCanvas>(null);
  const [form, setForm] = useState({
    has_heart_condition: false,
    has_hypertension: false,
    is_pregnant: false,
    has_raynauds: false,
    has_open_wounds: false,
    other_conditions: '',
    participant_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function submit() {
    const sig = sigRef.current;
    if (!sig || sig.isEmpty()) {
      setMsg('נדרשת חתימה');
      return;
    }
    if (!form.participant_name) {
      setMsg('יש למלא שם משתתף');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('/api/health-declarations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          booking_id: bookingId,
          signature: sig.toDataURL(),
        }),
      });
      const d = await res.json();
      if (res.ok) {
        onDone();
      } else if (res.status === 422 && d.requiresDoctorApproval) {
        setMsg(
          `⚠️ ${d.message ?? 'נמצאו מצבים המצריכים אישור רופא לפני השתתפות.'}`
        );
      } else {
        setMsg(d.error ?? 'שגיאה בשמירת ההצהרה');
      }
    } catch {
      setMsg('שגיאת רשת — נסה שנית');
    }
    setLoading(false);
  }

  const CONDITIONS: [keyof typeof form, string][] = [
    ['has_heart_condition', 'אני סובל/ת ממצב לב'],
    ['is_pregnant', 'אני בהריון'],
    ['has_raynauds', 'אני סובל/ת מתסמונת Raynaud'],
    ['has_hypertension', 'יש לי לחץ דם גבוה'],
    ['has_open_wounds', 'יש לי פצעים פתוחים'],
  ];

  return (
    <div>
      <h2 className="text-2xl font-black text-navy-900 mb-1">הצהרת בריאות</h2>
      <p className="text-slate-500 text-xs mb-4">
        נדרש לפני כל השתתפות. מסמן/ת אמצעי זהירות בטיחותיים.
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

      <input
        value={form.participant_name}
        onChange={e => setForm(p => ({ ...p, participant_name: e.target.value }))}
        placeholder="שם המשתתף"
        className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 text-sm mb-3 focus:outline-none focus:border-ice-400"
      />

      <label className="block text-sm font-semibold text-slate-600 mb-1">חתימה</label>
      <div className="border-2 border-slate-200 rounded-xl overflow-hidden mb-2 bg-white">
        <SignatureCanvas
          ref={sigRef}
          canvasProps={{ width: 400, height: 120, className: 'w-full' }}
        />
      </div>
      <button
        onClick={() => sigRef.current?.clear()}
        className="text-xs text-slate-400 hover:text-slate-600 mb-3 block"
      >
        מחק חתימה
      </button>

      {msg && <p className="text-red-500 text-sm mb-2">{msg}</p>}

      <div className="flex gap-2">
        <button
          onClick={submit}
          disabled={loading}
          className="flex-1 bg-ice-600 hover:bg-ice-700 disabled:opacity-50 text-white font-bold py-3 rounded-2xl text-sm"
        >
          {loading ? 'שומר...' : 'אשר הצהרה ✓'}
        </button>
        <button
          onClick={onSkip}
          className="px-4 py-3 text-slate-400 hover:text-slate-600 text-sm"
        >
          דלג
        </button>
      </div>
    </div>
  );
}
