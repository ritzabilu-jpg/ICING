'use client';
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import LeadCard from '@/components/admin/LeadCard';

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? 'lior2026';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnon);

const STATUS_FILTERS = [
  { value: 'all', label: 'הכל' },
  { value: 'new', label: 'חדשים' },
  { value: 'pending_approval', label: 'ממתינים לאישור' },
  { value: 'approved', label: 'אושרו' },
  { value: 'sent', label: 'נשלחו' },
  { value: 'booked', label: 'הוזמנו' },
  { value: 'not_relevant', label: 'לא רלוונטי' },
];
const HEAT_FILTERS = [
  { value: '', label: 'כל החום' },
  { value: 'hot', label: '🔥 חם' },
  { value: 'medium', label: '🌤️ בינוני' },
  { value: 'cold', label: '❄️ קר' },
];

interface Lead {
  id: string; name: string; phone?: string; email?: string; message?: string;
  source: string; lead_type: string; heat: string; score: number; status: string;
  require_human_review: boolean; draft_message?: string; agent_notes?: string;
  created_at: string; lead_activities?: { id: string; type: string; description: string; performed_by: string; created_at: string; }[];
}

export default function LeadsDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState('pending_approval');
  const [heatFilter, setHeatFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ status: statusFilter });
    if (heatFilter) params.set('heat', heatFilter);
    const res = await fetch(`/api/admin/leads?${params}`, { headers: { 'x-admin-key': ADMIN_KEY } });
    const data = await res.json();
    setLeads(data.leads ?? []);
    setLoading(false);
  }, [statusFilter, heatFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('leads-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => fetchLeads())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchLeads]);

  // KPI counts
  const kpi = {
    new: leads.filter(l => l.status === 'new').length,
    pending: leads.filter(l => l.status === 'pending_approval').length,
    sent: leads.filter(l => l.status === 'sent').length,
    booked: leads.filter(l => l.status === 'booked').length,
  };

  const card = (label: string, value: number, color: string) => (
    <div style={{ background: '#fff', border: `2px solid ${color}`, borderRadius: 12, padding: '16px 24px', textAlign: 'center', minWidth: 120 }}>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{label}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>🧊 ICING — ניהול לידים</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>דשבורד שיווקי · עדכון בזמן אמת</p>

      {/* KPIs */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        {card('לידים חדשים', kpi.new, '#3b82f6')}
        {card('ממתינים לאישור', kpi.pending, '#f59e0b')}
        {card('נשלחו', kpi.sent, '#10b981')}
        {card('הוזמנו', kpi.booked, '#8b5cf6')}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {STATUS_FILTERS.map(f => (
          <button key={f.value} onClick={() => setStatusFilter(f.value)}
            style={{ padding: '6px 14px', borderRadius: 99, border: '1px solid #e2e8f0', background: statusFilter === f.value ? '#1e293b' : '#fff', color: statusFilter === f.value ? '#fff' : '#475569', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            {f.label}
          </button>
        ))}
        <select value={heatFilter} onChange={e => setHeatFilter(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: 99, border: '1px solid #e2e8f0', fontSize: 13, cursor: 'pointer' }}>
          {HEAT_FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </div>

      {/* Leads */}
      {loading ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: 48 }}>טוען...</p>
      ) : leads.length === 0 ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: 48 }}>אין לידים בקטגוריה זו</p>
      ) : (
        leads.map(lead => <LeadCard key={lead.id} lead={lead} onUpdate={fetchLeads} />)
      )}
    </div>
  );
}
