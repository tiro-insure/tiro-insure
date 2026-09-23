import type { APIRoute } from 'astro';
import { emailShell, sendTiroEmail } from '../../../lib/integrations/resend-email';
import { isContactRequestAllowed } from '../../../lib/security/contact-rate-limit';

export const prerender = false;
const permittedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maxImageBytes = 5 * 1024 * 1024;
const present = (value: FormDataEntryValue | null) => typeof value === 'string' && value.trim().length > 0;

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  for (const byte of new Uint8Array(buffer)) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export const POST: APIRoute = async ({ request }) => {
  if (!isContactRequestAllowed(request, 'custom-design')) return Response.json({ status: 'failed', messages: ['Please wait a few minutes before sending another request.'] }, { status: 429 });
  const form = await request.formData();
  const file = form.get('inspiration');
  if (!present(form.get('description')) || !present(form.get('budget')) || !present(form.get('province')) || !present(form.get('town')) || !present(form.get('name')) || !present(form.get('phone')) || !present(form.get('email'))) return Response.json({ status: 'failed', messages: ['Please complete the required custom design details.'] }, { status: 422 });
  if (file instanceof File && file.size > 0 && (!permittedTypes.has(file.type) || file.size > maxImageBytes)) return Response.json({ status: 'failed', messages: ['Upload a JPG, PNG, or WebP image up to 5 MB.'] }, { status: 422 });

  const url = import.meta.env.TIRO_TOMBSTONE_WEBHOOK_URL;
  const secret = import.meta.env.TIRO_TOMBSTONE_WEBHOOK_SECRET;
  if (!url || !secret) {
    const rows: Array<[string, string]> = [
      ['Design request', String(form.get('description'))], ['Preferred material', String(form.get('material') ?? '')], ['Budget', String(form.get('budget'))],
      ['Province', String(form.get('province'))], ['Town', String(form.get('town'))], ['Contact', String(form.get('name'))], ['Phone', String(form.get('phone'))], ['Email', String(form.get('email'))],
    ];
    const attachments = file instanceof File && file.size > 0
      ? [{ filename: file.name, content: arrayBufferToBase64(await file.arrayBuffer()) }]
      : undefined;
    const delivery = await sendTiroEmail({ subject: 'New TIRO custom tombstone design request', text: rows.map(([label, value]) => `${label}: ${value}`).join('\n'), html: emailShell('New custom tombstone design request', rows), attachments });
    if (delivery.status === 'sent') return Response.json({ status: 'submitted', messages: ['Your custom design request has been sent to TIRO for follow-up.'] });
    if (delivery.status === 'unavailable') return Response.json({ status: 'unavailable', messages: ['The TIRO custom design inbox is not configured in this environment.'] });
    return Response.json({ status: 'failed', messages: ['TIRO could not submit your custom design request at this time.'] }, { status: 502 });
  }

  const metadata = { type: 'custom_design', description: form.get('description'), preferredMaterial: form.get('material'), budget: form.get('budget'), province: form.get('province'), town: form.get('town'), name: form.get('name'), phone: form.get('phone'), email: form.get('email') };
  const signature = await signPayload(JSON.stringify(metadata), secret);
  const upstream = new FormData();
  upstream.set('metadata', JSON.stringify(metadata));
  if (file instanceof File && file.size > 0) upstream.set('inspiration', file, file.name);
  const response = await fetch(url, { method: 'POST', headers: { 'x-tiro-signature': signature }, body: upstream });
  if (!response.ok) return Response.json({ status: 'failed', messages: ['TIRO could not submit your custom design request at this time.'] }, { status: 502 });
  return Response.json(await response.json());
};

async function signPayload(body: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  return Array.from(new Uint8Array(signature)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
