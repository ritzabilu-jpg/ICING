// Google Sheets integration for Lior's booking slots
// Spreadsheet: https://docs.google.com/spreadsheets/d/1NZmaEaFo46CEPGvx78w7BKG1ZQ48KBgYkQ7jlaBSfFc
//
// Sheet structure (after setup):
// Row 1: headers — תאריך | שעה | שם 1 | טל 1 | שם 2 | טל 2 | ... | שם 10 | טל 10
// Row 2: 19.3.2026 | 08:00 | (participants)
// Row 3: 19.3.2026 | 09:30 | (participants)
// Row 4: 19.3.2026 | 11:00 | (participants)

const SPREADSHEET_ID = '1NZmaEaFo46CEPGvx78w7BKG1ZQ48KBgYkQ7jlaBSfFc';
const MAX_PARTICIPANTS = 10;

export const LIOR_TIME_SLOTS = [
  { label: '08:00', date: '19.3.2026', sheetRow: 2 },
  { label: '09:30', date: '19.3.2026', sheetRow: 3 },
  { label: '11:00', date: '19.3.2026', sheetRow: 4 },
];

export interface SlotInfo {
  label: string;
  date: string;
  count: number;
  full: boolean;
}

// Returns column letter(s) from 0-based index (0→A, 1→B, 25→Z, 26→AA, ...)
function colLetter(index: number): string {
  let result = '';
  let i = index + 1;
  while (i > 0) {
    const rem = (i - 1) % 26;
    result = String.fromCharCode(65 + rem) + result;
    i = Math.floor((i - 1) / 26);
  }
  return result;
}

// Name for slot n (0-based): columns C,E,G,... (indices 2,4,6,...)
// Phone for slot n (0-based): columns D,F,H,... (indices 3,5,7,...)
function nameCol(n: number) { return colLetter(2 + n * 2); }
function phoneCol(n: number) { return colLetter(3 + n * 2); }

async function getAccessToken(): Promise<string | null> {
  const keyStr = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!keyStr) return null;

  try {
    const key = JSON.parse(keyStr) as {
      client_email: string;
      private_key: string;
    };

    // Build JWT for Google OAuth2
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const payload = {
      iss: key.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    const b64 = (obj: object) =>
      Buffer.from(JSON.stringify(obj)).toString('base64url');
    const unsigned = `${b64(header)}.${b64(payload)}`;

    // Sign with RS256 using Node.js crypto
    const { createSign } = await import('crypto');
    const sign = createSign('RSA-SHA256');
    sign.update(unsigned);
    const signature = sign.sign(key.private_key, 'base64url');
    const jwt = `${unsigned}.${signature}`;

    // Exchange for access token
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json() as { access_token?: string };
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

async function sheetsGet(token: string, range: string) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json() as { values?: string[][] };
  return data.values ?? [];
}

async function sheetsUpdate(token: string, range: string, values: string[][]) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=RAW`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  });
  return res.ok;
}

export async function getSlotOccupancy(): Promise<SlotInfo[]> {
  const token = await getAccessToken();
  if (!token) {
    return LIOR_TIME_SLOTS.map(s => ({ label: s.label, date: s.date, count: 0, full: false }));
  }

  try {
    // Read all data rows (rows 2-4, columns A through last phone column)
    const lastCol = phoneCol(MAX_PARTICIPANTS - 1); // V for 10 participants
    const values = await sheetsGet(token, `Sheet1!A1:${lastCol}4`);
    if (!values) {
      return LIOR_TIME_SLOTS.map(s => ({ label: s.label, date: s.date, count: 0, full: false }));
    }

    return LIOR_TIME_SLOTS.map(slot => {
      const row = values[slot.sheetRow - 1] ?? [];
      let count = 0;
      for (let n = 0; n < MAX_PARTICIPANTS; n++) {
        const nameIdx = 2 + n * 2;
        if (row[nameIdx]?.trim()) count++;
      }
      return { label: slot.label, date: slot.date, count, full: count >= MAX_PARTICIPANTS };
    });
  } catch {
    return LIOR_TIME_SLOTS.map(s => ({ label: s.label, date: s.date, count: 0, full: false }));
  }
}

export async function addBookingToSheet(
  timeLabel: string,
  name: string,
  phone: string,
): Promise<{ success: boolean; sheetsConfigured: boolean; error?: string }> {
  const token = await getAccessToken();
  if (!token) {
    return { success: false, sheetsConfigured: false, error: 'Google Sheets לא מוגדר' };
  }

  const slot = LIOR_TIME_SLOTS.find(s => s.label === timeLabel);
  if (!slot) return { success: false, sheetsConfigured: true, error: 'מועד לא תקין' };

  try {
    const lastCol = phoneCol(MAX_PARTICIPANTS - 1);
    const rowNum = slot.sheetRow;
    const values = await sheetsGet(token, `Sheet1!C${rowNum}:${lastCol}${rowNum}`);
    const rowData = values?.[0] ?? [];

    // Find next empty name slot
    let nextSlot = -1;
    for (let n = 0; n < MAX_PARTICIPANTS; n++) {
      const nameIdx = n * 2; // relative to column C
      if (!rowData[nameIdx]?.trim()) {
        nextSlot = n;
        break;
      }
    }

    if (nextSlot === -1) return { success: false, sheetsConfigured: true, error: 'המועד מלא' };

    // Write name + phone to the pair of cells
    const range = `Sheet1!${nameCol(nextSlot)}${rowNum}:${phoneCol(nextSlot)}${rowNum}`;
    const ok = await sheetsUpdate(token, range, [[name, phone]]);
    return ok
      ? { success: true, sheetsConfigured: true }
      : { success: false, sheetsConfigured: true, error: 'שגיאת כתיבה לגיליון' };
  } catch (e) {
    return { success: false, sheetsConfigured: true, error: String(e) };
  }
}
