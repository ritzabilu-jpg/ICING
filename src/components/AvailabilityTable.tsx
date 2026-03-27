'use client';

import TimePicker from './TimePicker';

export interface AvailabilitySlot {
  type: 'workshop' | 'immersion';
  day_of_week: number;
  slot_index: number;
  from_time: string;
  to_time: string;
}

interface AvailabilityTableProps {
  type: 'workshop' | 'immersion';
  title: string;
  data: AvailabilitySlot[];
  onChange?: (updated: AvailabilitySlot[]) => void;
  readOnly?: boolean;
}

const DAYS = ['יום א׳', 'יום ב׳', 'יום ג׳', 'יום ד׳', 'יום ה׳', 'יום ו׳', 'מוצאי שבת'];
const SLOTS = [0, 1, 2];

export default function AvailabilityTable({ type, title, data, onChange, readOnly }: AvailabilityTableProps) {
  function getSlot(day: number, idx: number): AvailabilitySlot {
    return data.find(s => s.day_of_week === day && s.slot_index === idx && s.type === type)
      ?? { type, day_of_week: day, slot_index: idx, from_time: '', to_time: '' };
  }

  function update(day: number, idx: number, field: 'from_time' | 'to_time', val: string) {
    if (!onChange) return;
    const existing = data.find(s => s.type === type && s.day_of_week === day && s.slot_index === idx);
    if (existing) {
      onChange(data.map(s =>
        s.type === type && s.day_of_week === day && s.slot_index === idx
          ? { ...s, [field]: val }
          : s
      ));
    } else {
      const newSlot: AvailabilitySlot = { type, day_of_week: day, slot_index: idx, from_time: '', to_time: '' };
      newSlot[field] = val;
      onChange([...data, newSlot]);
    }
  }

  return (
    <div>
      <h3 className="text-sm font-bold text-[#0f2942] mb-2">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="border border-slate-200 px-3 py-2 text-right font-semibold text-slate-600 w-24"></th>
              {SLOTS.map(i => (
                <th key={i} colSpan={2} className="border border-slate-200 px-2 py-2 text-center font-semibold text-slate-600">
                  חלון {i + 1}
                </th>
              ))}
            </tr>
            <tr className="bg-slate-50">
              <th className="border border-slate-200 px-3 py-1.5 text-right font-semibold text-slate-500"></th>
              {SLOTS.flatMap(i => [
                <th key={`f${i}`} className="border border-slate-200 px-2 py-1.5 text-center font-semibold text-slate-500 w-24">משעה</th>,
                <th key={`t${i}`} className="border border-slate-200 px-2 py-1.5 text-center font-semibold text-slate-500 w-24">עד שעה</th>,
              ])}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day, dayIdx) => {
              const rowSlots = SLOTS.map(i => getSlot(dayIdx, i));
              const hasAny = rowSlots.some(s => s.from_time || s.to_time);
              return (
                <tr key={dayIdx} className={hasAny ? 'bg-red-50' : 'bg-white'}>
                  <td className="border border-slate-200 px-3 py-2 font-semibold text-slate-700 text-right whitespace-nowrap">
                    {day}
                  </td>
                  {SLOTS.flatMap(slotIdx => {
                    const slot = getSlot(dayIdx, slotIdx);
                    return [
                      <td key={`f${slotIdx}`} className="border border-slate-200 px-2 py-1.5 text-center">
                        {readOnly
                          ? <span className={`font-mono text-xs ${slot.from_time ? 'text-red-600 font-bold' : 'text-slate-300'}`}>{slot.from_time || '——'}</span>
                          : <TimePicker value={slot.from_time} onChange={v => update(dayIdx, slotIdx, 'from_time', v)} />
                        }
                      </td>,
                      <td key={`t${slotIdx}`} className="border border-slate-200 px-2 py-1.5 text-center">
                        {readOnly
                          ? <span className={`font-mono text-xs ${slot.to_time ? 'text-red-600 font-bold' : 'text-slate-300'}`}>{slot.to_time || '——'}</span>
                          : <TimePicker value={slot.to_time} onChange={v => update(dayIdx, slotIdx, 'to_time', v)} />
                        }
                      </td>,
                    ];
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
