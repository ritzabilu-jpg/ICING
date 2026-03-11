export interface TranzilaPaymentParams {
  amount: number; // in NIS (shekels)
  bookingId: string;
  customerEmail: string;
  customerName: string;
  productName: string;
}

/**
 * Builds the Tranzila hosted payment page URL.
 * This approach requires no PCI DSS compliance on our end —
 * Tranzila handles all card data on their servers.
 *
 * Replace SUPPLIER_NAME with your Tranzila supplier ID.
 */
export function buildTranzilaPaymentURL(params: TranzilaPaymentParams): string {
  const supplier = process.env.TRANZILA_SUPPLIER || 'SUPPLIER_NAME';
  const baseUrl = `https://direct.tranzila.com/${supplier}/iframenew.php`;
  const baseAppUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const query = new URLSearchParams({
    sum: params.amount.toFixed(2),
    currency: '1',       // 1 = ILS
    tranmode: 'A',       // Authorization
    nologo: '1',
    lang: 'heb',
    cred_type: '1',      // Regular credit
    email: params.customerEmail,
    contact: params.customerName,
    pdesc: params.productName,
    successUrl: `${baseAppUrl}/booking/success?id=${params.bookingId}&paid=true`,
    failUrl: `${baseAppUrl}/booking/failed?id=${params.bookingId}`,
  });

  return `${baseUrl}?${query.toString()}`;
}

/**
 * Format price in NIS for display
 */
export function formatPrice(amount: number): string {
  return `₪${amount.toLocaleString('he-IL')}`;
}
