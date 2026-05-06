import { NextRequest, NextResponse } from 'next/server';
import { getSession, setSession, resetSession, processInput } from '@/lib/whatsapp/bot';
import { sendResponse, markRead } from '@/lib/whatsapp/meta';

// ─── GET – Meta webhook verification ─────────────────────────────────────────

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const mode = p.get('hub.mode');
  const token = p.get('hub.verify_token');
  const challenge = p.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('[WhatsApp] Webhook verified');
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse('Forbidden', { status: 403 });
}

// ─── POST – Incoming messages ─────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Must respond 200 quickly; process async
  processMessage(body).catch(e => console.error('[WhatsApp] processing error', e));
  return NextResponse.json({ ok: true });
}

async function processMessage(body: Record<string, unknown>) {
  const entry = (body?.entry as unknown[])?.[0] as Record<string, unknown>;
  const value = (entry?.changes as unknown[])?.[0] as { value?: Record<string, unknown> };
  const messages = value?.value?.messages as unknown[] | undefined;

  if (!messages?.length) return;

  const msg = messages[0] as Record<string, unknown>;
  const from = msg.from as string;
  const msgId = msg.id as string;
  const msgType = msg.type as string;

  // Mark as read (fire and forget)
  markRead(from, msgId).catch(() => {});

  // Extract selection or free text
  let selectedOptionId: string | null = null;
  let freeText: string | null = null;

  if (msgType === 'text') {
    freeText = (msg.text as { body: string })?.body ?? null;
  } else if (msgType === 'interactive') {
    const interactive = msg.interactive as Record<string, unknown>;
    const iType = interactive?.type as string;
    if (iType === 'button_reply') {
      selectedOptionId = (interactive.button_reply as { id: string }).id;
    } else if (iType === 'list_reply') {
      selectedOptionId = (interactive.list_reply as { id: string }).id;
    }
  } else {
    // Unsupported message type (image, audio, etc.) – send menu again
    freeText = null;
  }

  // Load session and process
  const currentNodeId = await getSession(from);
  const response = processInput(currentNodeId, selectedOptionId, freeText);

  // Send response to user
  await sendResponse(from, response.text, response.options);

  // Update session
  if (response.isTerminal) {
    await resetSession(from);
  } else {
    await setSession(from, response.nodeId);
  }
}
