/**
 * Shared instructor-auth helpers used by all /api/instructor/* routes.
 */
import { createAdminClient } from '@/lib/supabase';

/**
 * Resolves a visitor_id → instructors.id (and name/slug).
 * Uses limit(1) + order so duplicate instructor rows don't break maybeSingle().
 */
export async function resolveInstructor(visitorId: string): Promise<{
  instructorId: string;
  instructorName: string;
  instructorSlug: string;
  email: string;
} | null> {
  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from('visitor_profiles')
    .select('email, role')
    .eq('id', visitorId)
    .maybeSingle();

  if (!profile || !['instructor', 'admin'].includes(profile.role)) return null;

  const { data: rows } = await supabase
    .from('instructors')
    .select('id, name, slug')
    .eq('email_contact', profile.email)
    .order('created_at', { ascending: false })
    .limit(1);

  const inst = rows?.[0];
  if (!inst) return null;

  return {
    instructorId: inst.id,
    instructorName: inst.name,
    instructorSlug: inst.slug ?? '',
    email: profile.email,
  };
}
