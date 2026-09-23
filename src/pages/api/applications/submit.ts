import type { APIRoute } from 'astro';
import { getApplicationProvider, type ApplicationPayload } from '../../../lib/integrations/application-provider';
import { isContactRequestAllowed } from '../../../lib/security/contact-rate-limit';

export const prerender = false;

const present = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

export const POST: APIRoute = async ({ request }) => {
  if (!isContactRequestAllowed(request, 'application')) return Response.json({ status: 'failed', messages: ['Please wait a few minutes before sending another request.'] }, { status: 429 });
  let payload: ApplicationPayload;
  try {
    payload = await request.json() as ApplicationPayload;
  } catch {
    return Response.json({ status: 'failed', messages: ['Invalid application data.'] }, { status: 400 });
  }

  if (!present(payload.product) || !present(payload.applicant?.firstName) || !present(payload.applicant?.surname) || !present(payload.applicant?.dateOfBirth) || !present(payload.applicant?.phone) || !present(payload.applicant?.email) || !present(payload.dependants) || !present(payload.beneficiary?.name) || !present(payload.beneficiary?.relationship) || !present(payload.paymentMethod)) {
    return Response.json({ status: 'failed', messages: ['Please complete the required application details.'] }, { status: 422 });
  }

  // Application data is deliberately not logged or persisted by the website.
  const result = await getApplicationProvider().submitApplication(payload);
  return Response.json(result, { status: result.status === 'failed' ? 502 : 200 });
};
