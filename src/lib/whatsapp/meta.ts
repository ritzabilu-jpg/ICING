const PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;
const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!;
const API_URL = () => `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`;

const headers = () => ({
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
});

// ─── Send helpers ─────────────────────────────────────────────────────────────

async function post(body: object) {
  const res = await fetch(API_URL(), {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('[WhatsApp API error]', err);
  }
}

export async function sendText(to: string, text: string) {
  await post({
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: text },
  });
}

// Quick reply buttons – max 3, title max 20 chars
export async function sendButtons(
  to: string,
  body: string,
  buttons: { id: string; title: string }[],
) {
  await post({
    messaging_product: 'whatsapp',
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: body },
      action: {
        buttons: buttons.slice(0, 3).map(b => ({
          type: 'reply',
          reply: { id: b.id, title: truncate(b.title, 20) },
        })),
      },
    },
  });
}

// List message – max 10 rows, title max 24 chars
export async function sendList(
  to: string,
  body: string,
  rows: { id: string; title: string }[],
) {
  await post({
    messaging_product: 'whatsapp',
    to,
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: body },
      action: {
        button: 'בחר אפשרות',
        sections: [{
          title: 'אפשרויות',
          rows: rows.slice(0, 10).map(r => ({
            id: r.id,
            title: truncate(r.title, 24),
          })),
        }],
      },
    },
  });
}

export async function markRead(to: string, messageId: string) {
  await post({
    messaging_product: 'whatsapp',
    status: 'read',
    message_id: messageId,
  });
}

// ─── Main dispatcher ──────────────────────────────────────────────────────────

export async function sendResponse(
  to: string,
  text: string,
  options: { id: string; title: string }[],
) {
  if (options.length === 0) {
    await sendText(to, text);
  } else if (options.length <= 3) {
    await sendButtons(to, text, options);
  } else {
    await sendList(to, text, options);
  }
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function truncate(s: string, max: number) {
  return s.length <= max ? s : s.slice(0, max - 1) + '…';
}
