import { Resend } from 'resend';

const FROM = process.env.EMAIL_FROM || 'noreply@havayot-science.co.il';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || 'placeholder');
}

export interface BookingConfirmationParams {
  to: string;
  userName: string;
  workshopTitle: string;
  workshopType: string;
  dateTime: string;
  confirmationCode: string;
  participants: number;
  totalPrice: number;
  location: string;
}

export async function sendBookingConfirmation(params: BookingConfirmationParams) {
  const {
    to, userName, workshopTitle, workshopType, dateTime,
    confirmationCode, participants, totalPrice, location,
  } = params;

  const typeLabel =
    workshopType === 'individual' ? 'סדנת יחידים' :
    workshopType === 'couple' ? 'סדנת זוגות' :
    'סדנת קבוצות';

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>אישור הזמנה</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; direction: rtl; background: #f0f9ff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #0f172a 0%, #0369a1 100%); padding: 32px 24px; text-align: center; }
        .header h1 { color: #38bdf8; font-size: 28px; margin: 0 0 8px; }
        .header p { color: #e0f2fe; font-size: 16px; margin: 0; }
        .body { padding: 32px 24px; }
        .greeting { font-size: 20px; color: #0f172a; margin-bottom: 24px; }
        .info-card { background: #f0f9ff; border: 2px solid #bae6fd; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0f2fe; }
        .info-row:last-child { border-bottom: none; font-weight: bold; }
        .info-label { color: #475569; }
        .info-value { color: #0f172a; font-weight: 500; }
        .code-box { background: #0f172a; color: #38bdf8; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0; }
        .code-box p { margin: 0 0 8px; color: #94a3b8; font-size: 14px; }
        .code-box span { font-size: 32px; font-weight: bold; letter-spacing: 6px; }
        .instructions { background: #f8fafc; border-right: 4px solid #0ea5e9; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px; }
        .instructions h3 { color: #0369a1; margin: 0 0 12px; font-size: 16px; }
        .instructions ul { margin: 0; padding-right: 20px; color: #334155; }
        .instructions li { margin-bottom: 8px; }
        .footer { background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer p { color: #64748b; font-size: 14px; margin: 4px 0; }
        .footer a { color: #0ea5e9; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ ההזמנה אושרה!</h1>
          <p>חוויות שוויץ המדע – אמבטיות קרח רחובות</p>
        </div>
        <div class="body">
          <p class="greeting">שלום ${userName},</p>
          <p>ההזמנה שלך ל${typeLabel} אושרה בהצלחה. אנו מצפים לראותך!</p>

          <div class="info-card">
            <div class="info-row">
              <span class="info-label">סוג הסדנה</span>
              <span class="info-value">${workshopTitle}</span>
            </div>
            <div class="info-row">
              <span class="info-label">תאריך ושעה</span>
              <span class="info-value">${dateTime}</span>
            </div>
            <div class="info-row">
              <span class="info-label">מיקום</span>
              <span class="info-value">${location}</span>
            </div>
            <div class="info-row">
              <span class="info-label">מספר משתתפים</span>
              <span class="info-value">${participants}</span>
            </div>
            <div class="info-row">
              <span class="info-label">סה"כ לתשלום</span>
              <span class="info-value" style="color: #0ea5e9;">₪${totalPrice}</span>
            </div>
          </div>

          <div class="code-box">
            <p>קוד אישור ההזמנה שלך</p>
            <span>${confirmationCode}</span>
          </div>

          <div class="instructions">
            <h3>🧊 הכנה לסדנה – מה להביא?</h3>
            <ul>
              <li>בגד ים / בגד ספורט נוח</li>
              <li>מגבת גדולה וחמה</li>
              <li>בגדים חמים להחלפה לאחר הסדנה</li>
              <li>שתייה חמה בתרמוס (אופציונלי)</li>
              <li>להגיע 10 דקות לפני תחילת הסדנה</li>
            </ul>
          </div>

          <p style="color: #334155;">לשאלות ושינויים: <a href="tel:089310715">08-9310715</a></p>
        </div>
        <div class="footer">
          <p><strong>חוויות שוויץ המדע</strong></p>
          <p>רחוב סירני 52, רחובות | מתחם הבריכה הטיפולית</p>
          <p><a href="tel:089310715">08-9310715</a> | <a href="tel:089310716">08-9310716</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (!process.env.RESEND_API_KEY) return null;
  return getResend().emails.send({
    from: FROM,
    to,
    subject: `✅ אישור הזמנה – ${workshopTitle} | קוד: ${confirmationCode}`,
    html,
  });
}
