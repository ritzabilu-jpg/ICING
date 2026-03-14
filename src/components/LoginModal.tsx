'use client';

import { useState } from 'react';

interface Props {
  initialName?: string;
  onClose: () => void;
  onLogin: (id: string, name: string, role: string) => void;
}

export default function LoginModal({ initialName = '', onClose, onLogin }: Props) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!name.trim() || !phone.trim()) return;
    setLoading(true);
    setError('');
    const res = await fetch('/api/visitor-profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), phone: phone.trim(), code: code.trim() || undefined }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || 'שגיאה בכניסה'); return; }
    localStorage.setItem('visitor_id', data.id);
    localStorage.setItem('visitor_name', data.name);
    localStorage.setItem('visitor_role', data.role);
    onLogin(data.id, data.name, data.role);
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm" dir="rtl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-navy-900">כניסה למערכת</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">שם מלא</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="הכנס שמך"
              autoFocus
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-right focus:outline-none focus:ring-2 focus:ring-ice-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">טלפון</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="05X-XXXXXXX"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-right focus:outline-none focus:ring-2 focus:ring-ice-400"
            />
          </div>

          {!showCode ? (
            <button onClick={() => setShowCode(true)} className="text-xs text-slate-400 hover:text-ice-600 underline">
              מדריך / מנהל? לחץ כאן
            </button>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">קוד מדריך / מנהל</label>
              <input
                type="password"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="הכנס קוד גישה"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-right focus:outline-none focus:ring-2 focus:ring-ice-400"
              />
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={!name.trim() || !phone.trim() || loading}
            className="w-full bg-ice-600 hover:bg-ice-700 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-colors"
          >
            {loading ? 'נכנס...' : 'כניסה'}
          </button>
        </div>
      </div>
    </div>
  );
}
