import { createAdminClient } from '@/lib/supabase';
import { nodeMap, treeRoot, type TreeNode } from './tree';

// ─── Session management ───────────────────────────────────────────────────────

export async function getSession(phone: string): Promise<string> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('whatsapp_sessions')
    .select('current_node_id')
    .eq('phone', phone)
    .single();
  return data?.current_node_id ?? 'root';
}

export async function setSession(phone: string, nodeId: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from('whatsapp_sessions').upsert(
    { phone, current_node_id: nodeId, updated_at: new Date().toISOString() },
    { onConflict: 'phone' }
  );
}

export async function resetSession(phone: string): Promise<void> {
  await setSession(phone, 'root');
}

// ─── Tree traversal ───────────────────────────────────────────────────────────

const RESET_WORDS = ['התחל', 'חזור', 'תפריט', 'menu', 'start', 'reset', 'שלום', 'היי', 'הי', 'בוקר', 'ערב'];

export interface BotResponse {
  text: string;
  options: { id: string; title: string }[];
  nodeId: string;
  isTerminal: boolean; // end or agent → reset session after sending
}

export function processInput(
  currentNodeId: string,
  selectedOptionId: string | null,
  freeText: string | null,
): BotResponse {
  // Reset keywords → back to root
  if (freeText && RESET_WORDS.some(w => freeText.toLowerCase().includes(w.toLowerCase()))) {
    return buildResponse('root');
  }

  const currentNode = nodeMap.get(currentNodeId);
  if (!currentNode) return buildResponse('root');

  let targetOptionId: string | null = selectedOptionId;

  // If no button was clicked, try to match free text to an option
  if (!targetOptionId && freeText) {
    const opts = currentNode.children.filter(c => c.type === 'options');
    const norm = (s: string) => s.trim().toLowerCase().replace(/[₪\s–-]/g, '');
    const match = opts.find(o => norm(o.text).includes(norm(freeText)) || norm(freeText).includes(norm(o.text)));
    targetOptionId = match?.id ?? null;
  }

  if (!targetOptionId) {
    // Nothing matched → repeat current node
    return buildResponse(currentNodeId);
  }

  const optionNode = nodeMap.get(targetOptionId);
  if (!optionNode || optionNode.children.length === 0) {
    return buildResponse(currentNodeId);
  }

  // Navigate to the option's first child (the display node)
  return buildResponse(optionNode.children[0].id);
}

function buildResponse(nodeId: string): BotResponse {
  const node = nodeMap.get(nodeId) ?? treeRoot;
  const options = node.children
    .filter(c => c.type === 'options')
    .map(c => ({ id: c.id, title: c.text }));

  return {
    text: node.text,
    options,
    nodeId: node.id,
    isTerminal: node.type === 'end' || node.type === 'agent',
  };
}
