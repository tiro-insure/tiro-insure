export interface TombstoneOrderPayload {
  product: string;
  personalisation: { deceasedName: string; inscription: string };
  installation: { province: string; town: string; cemetery: string };
  contact: { name: string; phone: string; email: string };
  paymentPreference: 'pay_in_full' | 'lay_by';
}

export interface TombstoneOrderResponse { status: 'submitted' | 'unavailable' | 'failed'; reference?: string; messages?: string[]; }

import { emailShell, sendTiroEmail } from './resend-email';

export async function submitTombstoneOrder(payload: TombstoneOrderPayload): Promise<TombstoneOrderResponse> {
  const url = import.meta.env.TIRO_TOMBSTONE_WEBHOOK_URL;
  const secret = import.meta.env.TIRO_TOMBSTONE_WEBHOOK_SECRET;
  if (!url || !secret) {
    const rows: Array<[string, string]> = [
      ['Selected tombstone', payload.product], ['Contact', payload.contact.name], ['Phone', payload.contact.phone], ['Email', payload.contact.email],
      ['Deceased person', payload.personalisation.deceasedName], ['Inscription', payload.personalisation.inscription],
      ['Province', payload.installation.province], ['Town', payload.installation.town], ['Cemetery', payload.installation.cemetery], ['Payment preference', payload.paymentPreference],
    ];
    const delivery = await sendTiroEmail({ subject: 'New TIRO tombstone order request', text: rows.map(([label, value]) => `${label}: ${value}`).join('\n'), html: emailShell('New tombstone order request', rows) });
    if (delivery.status === 'sent') return { status: 'submitted', messages: ['Your order request has been sent to TIRO for follow-up.'] };
    if (delivery.status === 'unavailable') return { status: 'unavailable', messages: ['The TIRO order inbox is not configured in this environment.'] };
    return { status: 'failed', messages: ['TIRO could not submit your tombstone order at this time.'] };
  }
  const body = JSON.stringify(payload);
  const signature = await signPayload(body, secret);
  const response = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-tiro-signature': signature }, body });
  if (!response.ok) return { status: 'failed', messages: ['TIRO could not submit your tombstone order at this time.'] };
  return response.json() as Promise<TombstoneOrderResponse>;
}

async function signPayload(body: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  return Array.from(new Uint8Array(signature)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
