'use client';
import { useState } from 'react';

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? 'lior2026';

const HEAT_ICON: Record<string, string> = { hot: '🔥', medium: '🌤️', cold: '❄️' };
const STATUS_LABEL: Record<string, string> = {
  new: 'חדש', pending_approval: 'ממתין לאישור', approved: 'אושר',
  sent: 'נשלח', replied: 'ענה', booked: 'הוזמן', lost: 'אבד', not_relevant: 'לא רלוונטי',
};

interface Activity { id: string; type: string; description: string; performed_by: string; created_at: string; }
interface Lead {
  id: string; name: string; phone?: string; email?: string; message?: string;
  source: string; lead_type: string; heat: string; score: number; status: string;
  require_human_review: boolean; draft_message?: string; agent_notes?: string;
  created_at: string; lead_activities?: Activity[];
}

export default function LeadCard({ lead, onUpdate }: { lead: Lead; onUpdate: () => void }) {
  const [draft, setDraft] = useState(lead.draft_message ?? '');
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  async function saveDraft() {
    setSaving(true);
    await fetch(`/api/admin/leads/${lead.id}/draft`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY },
      body: JSON.stringify({ draft_message: draft }),
    });
    setSaving(false);
  }

  async function approve() {
    setApproving(true);
    await fetch(`/api/admin/leads/${lead.id}/approve`, {
      method: 'PATCH',
      headers: { 'x-admin-key': ADMIN_KEY },
    });
    setApproving(false);
    onUpdate();
  }

  async function markNotRelevant() {
    await fetch(`/api/admin/leads/${lead.id}/draft`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY },
      body: JSON.stringify({ draft_message: draft }),
    });
    // update status via a simple workaround — call approve with not_relevant
    await fetch(`/api/admin/leads/${lead.id}/not-relevant`, {
      method: 'PATCH',
      headers: { 'x-admin-key': ADMIN_KEY },
    });
    onUpdate();
  }

  const s: React.CSSProperties = {
    border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, marginBottom: 16,
    background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.06)',
  };

  return (
    <div style={s}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div>
          <strong style={{ fontSize: 16 }}>{lead.name}</strong>
          {lead.require_human_review && <span style={{ marginRight: 8, background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 99, fontSize: 12 }}>⚠️ נדרש מענה ידני</span>}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span>{HEAT_ICON[lead.heat] ?? '❓'}</span>
          <span style={{ fontSize: 13, color: '#64748b' }}>{lead.score}/100</span>
          <span style={{ fontSize: 12, background: '#f1f5f9', padding: '2px 8px', borderRadius: 99 }}>{STATUS_LABEL[lead.status] ?? lead.status}</span>
        </div>
      </div>

      {/* Contact */}
      <div style={{ fontSize: 13, color: '#475569', marginBottom: 8 }}>
        {lead.phone && <span style={{ marginLeft: 12 }}>📞 {lead.phone}</span>}
        {lead.email && <span>✉️ {lead.email}</span>}
      </div>

      {/* Message */}
      <div style={{ background: '#f8fafc', borderRadius: 8, padding: '8px 12px', fontSize: 14, marginBottom: 12, color: '#334155' }}>
        {lead.message}
      </div>

      {/* Agent notes */}
      {lead.agent_notes && (
        <div style={{ fontSize: 12, color: '#7c3aed', marginBottom: 8 }}>💡 {lead.agent_notes}</div>
      )}

      {/* Draft */}
      <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>הודעת מענה:</label>
      <textarea
        value={draft}
        onChange={e => setDraft(e.target.value)}
        rows={4}
        style={{ width: '100%', borderRadius: 8, border: '1px solid #cbd5e1', padding: 8, fontSize: 14, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
      />

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        <button
          onClick={approve}
          disabled={approving || lead.status === 'approved'}
          style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontWeight: 700, cursor: 'pointer', opacity: (approving || lead.status === 'approved') ? 0.5 : 1 }}
        >
          {approving ? '...' : '✓ אשר ושלח'}
        </button>
        <button
          onClick={saveDraft}
          disabled={saving}
          style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontWeight: 600, cursor: 'pointer' }}
        >
          {saving ? '...' : 'שמור ערוך'}
        </button>
        <button
          onClick={markNotRelevant}
          style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 16px', cursor: 'pointer' }}
        >
          לא רלוונטי
        </button>
        <button
          onClick={() => setShowHistory(h => !h)}
          style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 12, cursor: 'pointer', marginRight: 'auto' }}
        >
          {showHistory ? 'הסתר היסטוריה ▲' : 'היסטוריה ▼'}
        </button>
      </div>

      {/* Activities */}
      {showHistory && lead.lead_activities && lead.lead_activities.length > 0 && (
        <div style={{ marginTop: 12, borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
          {lead.lead_activities.map(a => (
            <div key={a.id} style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>
              <span style={{ color: '#475569' }}>{a.type}</span> — {a.description}
              <span style={{ marginRight: 6 }}>{new Date(a.created_at).toLocaleString('he-IL')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
