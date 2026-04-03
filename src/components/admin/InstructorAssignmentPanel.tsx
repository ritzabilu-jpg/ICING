'use client';

export interface AssignableInstructor {
  id: string;
  name: string;
  roles?: string[];
}

interface Props {
  workshopId: string;
  immersionGuideId: string | null;
  workshopFacilitatorId: string | null;
  instructors: AssignableInstructor[];
  adminKey: string;
  onUpdate: (wsId: string, field: 'immersion_guide_id' | 'workshop_facilitator_id', value: string | null) => void;
  hasConflict?: boolean;
}

export default function InstructorAssignmentPanel({
  workshopId, immersionGuideId, workshopFacilitatorId,
  instructors, adminKey, onUpdate, hasConflict,
}: Props) {
  const guides      = instructors.filter(i => !i.roles || i.roles.includes('immersion_guide'));
  const facilitators = instructors.filter(i => !i.roles || i.roles.includes('workshop_facilitator'));

  async function assign(field: 'immersion_guide_id' | 'workshop_facilitator_id', rawValue: string) {
    const newId = rawValue || null;
    onUpdate(workshopId, field, newId);
    await fetch(`/api/admin/instructor-workshops?key=${encodeURIComponent(adminKey)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: workshopId, [field]: newId }),
    });
  }

  const guideOk = !!immersionGuideId;
  const facilOk = !!workshopFacilitatorId;

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* מטביל */}
      <div className="flex items-center gap-1">
        <span className="text-[9px] text-slate-400 shrink-0" title="מטביל">🏊</span>
        <select
          value={immersionGuideId ?? ''}
          onChange={e => assign('immersion_guide_id', e.target.value)}
          className={`text-[11px] border rounded px-0.5 py-0.5 w-full font-semibold leading-tight ${
            hasConflict && guideOk
              ? 'border-red-300 bg-white text-red-700'
              : !guideOk
              ? 'border-yellow-400 bg-yellow-50 text-yellow-800'
              : 'border-green-300 bg-white text-green-700'
          }`}
        >
          <option value="">— מטביל —</option>
          {guides.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </div>

      {/* מנחה */}
      <div className="flex items-center gap-1">
        <span className="text-[9px] text-slate-400 shrink-0" title="מנחה">🎤</span>
        <select
          value={workshopFacilitatorId ?? ''}
          onChange={e => assign('workshop_facilitator_id', e.target.value)}
          className={`text-[11px] border rounded px-0.5 py-0.5 w-full font-semibold leading-tight ${
            !facilOk
              ? 'border-yellow-400 bg-yellow-50 text-yellow-800'
              : 'border-blue-300 bg-white text-blue-700'
          }`}
        >
          <option value="">— מנחה —</option>
          {facilitators.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </div>

      {hasConflict && (
        <div className="text-[9px] text-red-500 font-bold leading-tight">⚠ קונפליקט עם טבילה</div>
      )}
    </div>
  );
}
