import type { APIRoute } from 'astro';
import { submitTombstoneOrder, type TombstoneOrderPayload } from '../../../lib/integrations/tombstone-order-provider';
import { isContactRequestAllowed } from '../../../lib/security/contact-rate-limit';

export const prerender = false;
const present = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

export const POST: APIRoute = async ({ request }) => {
  if (!isContactRequestAllowed(request, 'tombstone-order')) return Response.json({ status: 'failed', messages: ['Please wait a few minutes before sending another request.'] }, { status: 429 });
  let payload: TombstoneOrderPayload;
  try { payload = await request.json() as TombstoneOrderPayload; } catch { return Response.json({ status: 'failed', messages: ['Invalid order data.'] }, { status: 400 }); }
  if (!present(payload.product) || !present(payload.personalisation?.deceasedName) || !present(payload.installation?.province) || !present(payload.installation?.town) || !present(payload.installation?.cemetery) || !present(payload.contact?.name) || !present(payload.contact?.phone) || !present(payload.contact?.email) || !present(payload.paymentPreference)) return Response.json({ status: 'failed', messages: ['Please complete the required order details.'] }, { status: 422 });
  // Never log or persist personalisation and contact details in the website layer.
  const result = await submitTombstoneOrder(payload);
  return Response.json(result, { status: result.status === 'failed' ? 502 : 200 });
};
