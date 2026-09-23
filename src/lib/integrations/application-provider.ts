export type ApplicationStatus = 'issued' | 'submitted' | 'unavailable' | 'failed';

export interface ApplicationPayload {
  product: string;
  applicant: {
    firstName: string;
    surname: string;
    dateOfBirth: string;
    phone: string;
    email: string;
  };
  dependants: string;
  beneficiary: { name: string; relationship: string };
  paymentMethod: string;
}

export interface ApplicationResponse {
  status: ApplicationStatus;
  application_reference?: string;
  policy_number?: string;
  premium?: number;
  cover_amount?: number;
  effective_date?: string;
  documents?: Array<{ name: string; url: string }>;
  messages?: string[];
}

export interface ApplicationProvider {
  submitApplication(payload: ApplicationPayload): Promise<ApplicationResponse>;
}

import { emailShell, sendTiroEmail } from './resend-email';

class WebhookApplicationProvider implements ApplicationProvider {
  constructor(private readonly url: string, private readonly secret: string) {}

  async submitApplication(payload: ApplicationPayload): Promise<ApplicationResponse> {
    const body = JSON.stringify(payload);
    const signature = await signPayload(body, this.secret);
    const response = await fetch(this.url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-tiro-signature': signature },
      body,
    });

    if (!response.ok) return { status: 'failed', messages: ['TIRO could not process the application at this time.'] };
    return response.json() as Promise<ApplicationResponse>;
  }
}

class UnconfiguredApplicationProvider implements ApplicationProvider {
  async submitApplication(): Promise<ApplicationResponse> {
    return { status: 'unavailable', messages: ['The TIRO policy handoff is not configured in this environment.'] };
  }
}

class ResendApplicationProvider implements ApplicationProvider {
  async submitApplication(payload: ApplicationPayload): Promise<ApplicationResponse> {
    const rows: Array<[string, string]> = [
      ['Requested cover', payload.product], ['Applicant', `${payload.applicant.firstName} ${payload.applicant.surname}`],
      ['Date of birth', payload.applicant.dateOfBirth], ['Phone', payload.applicant.phone], ['Email', payload.applicant.email],
      ['Dependants', payload.dependants], ['Beneficiary', `${payload.beneficiary.name} (${payload.beneficiary.relationship})`], ['Payment preference', payload.paymentMethod],
    ];
    const delivery = await sendTiroEmail({ subject: 'New TIRO funeral cover request', text: rows.map(([label, value]) => `${label}: ${value}`).join('\n'), html: emailShell('New funeral cover request', rows) });
    if (delivery.status === 'sent') return { status: 'submitted', messages: ['Your request has been sent to TIRO for follow-up.'] };
    if (delivery.status === 'unavailable') return { status: 'unavailable', messages: ['The TIRO request inbox is not configured in this environment.'] };
    return { status: 'failed', messages: ['TIRO could not send your request at this time.'] };
  }
}

export function getApplicationProvider(): ApplicationProvider {
  const url = import.meta.env.TIRO_APPLICATION_WEBHOOK_URL;
  const secret = import.meta.env.TIRO_APPLICATION_WEBHOOK_SECRET;
  if (url && secret) return new WebhookApplicationProvider(url, secret);
  if (import.meta.env.RESEND_API_KEY && import.meta.env.RESEND_FROM_EMAIL) return new ResendApplicationProvider();
  return new UnconfiguredApplicationProvider();
}

async function signPayload(body: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  return Array.from(new Uint8Array(signature)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
