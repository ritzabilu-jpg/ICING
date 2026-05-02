import type { Metadata } from 'next';
import InstructorsContent from '@/components/InstructorsContent';
import { INSTRUCTORS } from '@/data/instructors';
import { createAdminClient } from '@/lib/supabase';
import type { Instructor } from '@/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'הצוות שלנו – מדריכים מוסמכים',
  description:
    'הכירו את צוות המדריכים המוסמכים של ICING. ' +
    'כולם בעלי הסמכת CWI ועברו קורס הכשרה מקצועי.',
};

async function fetchInstructors(): Promise<Instructor[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('instructors')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Deduplicate by slug — keep first (lowest sort_order) per slug
    const seen = new Set<string>();
    const deduped = (data ?? []).filter((r: any) => {
      const key = r.slug || r.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // DB is source of truth — no static merging
    const list = deduped.map((r: any) => ({ ...r, id: r.slug || r.id, email: r.email_contact }));

    // Shuffle
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;

  } catch (err) {
    console.error('[instructors] DB fetch failed, falling back to static:', err);
    const fallback = [...INSTRUCTORS];
    for (let i = fallback.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fallback[i], fallback[j]] = [fallback[j], fallback[i]];
    }
    return fallback;
  }
}

export default async function InstructorsPage() {
  const instructors: Instructor[] = await fetchInstructors();
  return <InstructorsContent instructors={instructors} />;
}
