'use client';

import { useState, useRef, useEffect } from 'react';

interface TimePickerProps {
  value: string; // "HH:MM" or ""
  onChange: (val: string) => void;
  placeholder?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

export default function TimePicker({ value, onChange, placeholder = 'HH:MM' }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [selHour, setSelHour] = useState(value?.split(':')[0] ?? '');
  const [selMin, setSelMin] = useState(value?.split(':')[1] ?? '');
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Sync internal state when value changes externally
  useEffect(() => {
    setSelHour(value?.split(':')[0] ?? '');
    setSelMin(value?.split(':')[1] ?? '');
  }, [value]);

  function pickHour(h: string) {
    setSelHour(h);
    if (selMin) { onChange(`${h}:${selMin}`); setOpen(false); }
  }

  function pickMin(m: string) {
    setSelMin(m);
    if (selHour) { onChange(`${selHour}:${m}`); setOpen(false); }
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation();
    setSelHour(''); setSelMin('');
    onChange('');
    setOpen(false);
  }

  const hasValue = !!value;

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-20 h-8 text-sm font-mono rounded-lg border-2 text-center transition-colors ${
          hasValue
            ? 'border-red-300 bg-red-50 text-red-600 font-bold'
            : 'border-slate-200 bg-white text-slate-400'
        }`}
      >
        {value || placeholder}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 w-72"
          style={{ right: 0 }}>
          <div className="flex gap-3">
            {/* Hours */}
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-500 mb-2 text-center">שעה</p>
              <div className="grid grid-cols-4 gap-1 max-h-48 overflow-y-auto">
                {HOURS.map(h => (
                  <button key={h} type="button" onClick={() => pickHour(h)}
                    className={`text-xs py-1.5 rounded-lg font-mono transition-colors ${
                      selHour === h
                        ? 'bg-[#0f2942] text-white font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}>
                    {h}
                  </button>
                ))}
              </div>
            </div>
            {/* Minutes */}
            <div className="w-16">
              <p className="text-xs font-bold text-slate-500 mb-2 text-center">דקות</p>
              <div className="flex flex-col gap-1">
                {MINUTES.map(m => (
                  <button key={m} type="button" onClick={() => pickMin(m)}
                    className={`text-sm py-2 rounded-lg font-mono transition-colors ${
                      selMin === m
                        ? 'bg-[#0f2942] text-white font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}>
                    :{m}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {hasValue && (
            <button type="button" onClick={clear}
              className="w-full mt-2 text-xs text-red-400 hover:text-red-600 font-semibold py-1">
              נקה
            </button>
          )}
        </div>
      )}
    </div>
  );
}
