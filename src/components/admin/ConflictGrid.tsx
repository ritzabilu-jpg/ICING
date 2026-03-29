'use client';

import { useState } from 'react';

export interface ConflictItem {
  date: string;
  time: string;
  existingId: string;
  existingInstructorId: string | null;
  existingInstructorName: string;
  newInstructorId: string | null;
  newInstructorName: string;
  newSlot: Record<string, unknown>;
}

export interface CleanSlot {
  slot_date: string;
  slot_time: string;
  instructor_id?: string;
  max_participants: number;
  notes: string;
  [key: string]: unknown;
}

interface Props {
  conflicts: ConflictItem[];
  clean: CleanSlot[];
  onConfirm: (decisions: { existingId: string; keepExisting: boolean; newSlot?: Record<string, unknown> }[], clean: CleanSlot[]) => void;
  onCancel: () => void;
  confirming: boolean;
}

function fmtDate(d: string) {
  const [y, m, day] = d.split('-');
  void y;
  return `${day}.${m}`;
}

export default function ConflictGrid({ conflicts, clean, onConfirm, onCancel, confirming }: Props) {
  // default: keep existing instructor (true = keep existing, false = use new)
  const [decisions, setDecisions] = useState<Record<string, boolean>>(() => {
    const d: Record<string, boolean> = {};
    for (const c of conflicts) d[c.existingId] = true;
    return d;
  });

  const dates = [...new Set([
    ...conflicts.map(c => c.date),
    ...clean.map(s => s.slot_date),
  ])].sort();

  const times = [...new Set([
    ...conflicts.map(c => c.time),
    ...clean.map(s => s.slot_time),
  ])].sort();

  const conflictMap = new Map<string, ConflictItem>();
  for (const c of conflicts) conflictMap.set(`${c.date}|${c.time}`, c);

  const cleanSet = new Set<string>();
  for (const s of clean) cleanSet.add(`${s.slot_date}|${s.slot_time}`);

  function handleConfirm() {
    const resolved = conflicts.map(c => ({
      existingId: c.existingId,
      keepExisting: decisions[c.existingId] ?? true,
      newSlot: (decisions[c.existingId] ?? true) ? undefined : c.newSlot,
    }));
    onConfirm(resolved, clean);
  }

  return (
    <div className="bg-orange-50 rounded-3xl border-2 border-orange-200 shadow-sm p-6">
      <h2 className="text-lg font-black text-orange-800 mb-1">⚠️ נמצאו קונפליקטים – {conflicts.length} מועדים</h2>
      <p className="text-xs text-slate-500 mb-4">
        תאים אדומים = מועד קיים עם מדריך אחר. בחר מי ידריך בכל מועד כזה.
        {clean.length > 0 && <span className="mr-1 text-green-700">תאים ירוקים ({clean.length}) ייצרו אוטומטית.</span>}
      </p>

      <div className="overflow-auto max-h-96 border border-orange-100 rounded-xl">
        <table className="text-xs border-collapse w-full">
          <thead className="sticky top-0 bg-orange-50 z-10">
            <tr>
              <th className="border border-slate-200 px-2 py-1.5 bg-slate-100 text-right font-bold">שעה</th>
              {dates.map(d => (
                <th key={d} className="border border-slate-200 px-2 py-1.5 bg-slate-100 font-bold text-center min-w-[90px]">
                  {fmtDate(d)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map(t => (
              <tr key={t}>
                <td className="border border-slate-200 px-2 py-1 font-mono font-bold text-slate-600 bg-slate-50 whitespace-nowrap">
                  {t}
                </td>
                {dates.map(d => {
                  const mapKey = `${d}|${t}`;
                  const conflict = conflictMap.get(mapKey);
                  const isClean = cleanSet.has(mapKey);

                  if (conflict) {
                    const keepExisting = decisions[conflict.existingId] ?? true;
                    return (
                      <td key={d} className="border border-red-300 bg-red-50 px-1 py-0.5">
                        <select
                          value={keepExisting ? 'existing' : 'new'}
                          onChange={e => setDecisions(prev => ({
                            ...prev,
                            [conflict.existingId]: e.target.value === 'existing',
                          }))}
                          className="text-xs border border-red-300 rounded p-0.5 w-full bg-white"
                        >
                          <option value="existing">🔵 {conflict.existingInstructorName}</option>
                          <option value="new">🟢 {conflict.newInstructorName}</option>
                        </select>
                      </td>
                    );
                  }

                  if (isClean) {
                    return (
                      <td key={d} className="border border-green-300 bg-green-50 px-2 py-1 text-center text-green-700 font-bold">
                        ✓
                      </td>
                    );
                  }

                  return <td key={d} className="border border-slate-100 px-2 py-1" />;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 mt-4 flex-wrap">
        <button
          onClick={handleConfirm}
          disabled={confirming}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold px-6 py-2 rounded-xl text-sm transition-colors"
        >
          {confirming ? 'יוצר...' : `✅ אשר ויצור ${conflicts.length + clean.length} מועדים`}
        </button>
        <button
          onClick={onCancel}
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-6 py-2 rounded-xl text-sm transition-colors"
        >
          ביטול
        </button>
      </div>
    </div>
  );
}
