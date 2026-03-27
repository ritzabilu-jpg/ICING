'use client';

import { useState } from 'react';

export interface SummarySlot {
  type: 'workshop' | 'immersion';
  day_of_week: number;
  slot_index: number;
  from_time: string;
  to_time: string;
}

export interface SummaryBlocked {
  id: string;
  from_date: string;
  to_date: string;
  reason: string;
}

export interface SummaryInstructor {
  id: string;
  name: string;
  color: string;
  slots: SummarySlot[];
  blocked: SummaryBlocked[];
}

interface Props {
  instructors: SummaryInstructor[];
}

const DAYS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'שבת'];
const SLOTS = [0, 1, 2];

export default function AvailabilitySummaryGrid({ instructors }: Props) {
  const [viewType, setViewType] = useState<'immersion' | 'workshop'>('immersion');

  function getInstructorsForCell(day: number, slotIdx: number) {
    return instructors.filter(inst =>
      inst.slots.some(
        s => s.type === viewType && s.day_of_week === day && s.slot_index === slotIdx && s.from_time
      )
    );
  }

  function getTimeRange(inst: SummaryInstructor, day: number, slotIdx: number) {
    const s = inst.slots.find(
      s => s.type === viewType && s.day_of_week === day && s.slot_index === slotIdx
    );
    if (!s) return '';
    return `${s.from_time}–${s.to_time}`;
  }

  // Get upcoming blocked dates (next 60 days)
  const today = new Date().toISOString().split('T')[0];
  const in60 = new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0];
  const upcomingBlocked = instructors.flatMap(inst =>
    inst.blocked
      .filter(b => b.to_date >= today && b.from_date <= in60)
      .map(b => ({ ...b, instructorName: inst.name, color: inst.color }))
  ).sort((a, b) => a.from_date.localeCompare(b.from_date));

  function fmtDate(d: string) {
    return new Date(d).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' });
  }

  return (
    <div className="space-y-5">
      {/* Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewType('immersion')}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
            viewType === 'immersion'
              ? 'bg-[#0f2942] text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}>
          טבילות
        </button>
        <button
          onClick={() => setViewType('workshop')}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
            viewType === 'workshop'
              ? 'bg-[#0f2942] text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}>
          סדנאות
        </button>
      </div>

      {/* Legend */}
      {instructors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {instructors.map(inst => (
            <span key={inst.id}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full text-white"
              style={{ backgroundColor: inst.color }}>
              {inst.name}
            </span>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[560px]">
          <thead>
            <tr className="bg-slate-50">
              <th className="border border-slate-200 px-3 py-2 text-right font-semibold text-slate-500 w-20">חלון</th>
              {DAYS.map(d => (
                <th key={d} className="border border-slate-200 px-2 py-2 text-center font-bold text-[#0f2942]">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map(slotIdx => (
              <tr key={slotIdx} className="bg-white">
                <td className="border border-slate-200 px-3 py-3 text-xs font-semibold text-slate-500 text-center">
                  חלון {slotIdx + 1}
                </td>
                {DAYS.map((_, dayIdx) => {
                  const available = getInstructorsForCell(dayIdx, slotIdx);
                  return (
                    <td key={dayIdx} className="border border-slate-200 px-2 py-2 text-center align-top min-w-[80px]">
                      {available.length === 0 ? (
                        <span className="text-slate-200 text-xs">—</span>
                      ) : (
                        <div className="flex flex-col gap-1 items-center">
                          {available.map(inst => {
                            const timeRange = getTimeRange(inst, dayIdx, slotIdx);
                            return (
                              <span key={inst.id}
                                title={timeRange}
                                className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full text-white cursor-default whitespace-nowrap"
                                style={{ backgroundColor: inst.color }}>
                                {inst.name}
                                {timeRange && <span className="opacity-80 mr-1 font-normal text-[10px]">{timeRange}</span>}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upcoming blocked dates */}
      {upcomingBlocked.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-600 mb-2">תאריכים חסומים — 60 ימים הקרובים</h3>
          <div className="flex flex-wrap gap-2">
            {upcomingBlocked.map(b => (
              <div key={b.id}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border"
                style={{ borderColor: b.color, backgroundColor: b.color + '15' }}>
                <span className="font-semibold" style={{ color: b.color }}>{b.instructorName}</span>
                <span className="text-slate-600">{fmtDate(b.from_date)}–{fmtDate(b.to_date)}</span>
                {b.reason && <span className="text-slate-400">({b.reason})</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
