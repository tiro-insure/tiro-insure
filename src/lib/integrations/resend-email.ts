const resendEndpoint = 'https://api.resend.com/emails';
const defaultRecipient = 'tiro.insure@gmail.com';

export interface ResendAttachment {
  filename: string;
  content: string;
}

export interface TiroEmail {
  subject: string;
  text: string;
  html: string;
  attachments?: ResendAttachment[];
}

export type EmailDelivery =
  | { status: 'sent'; id?: string }
  | { status: 'unavailable' }
  | { status: 'failed' };

/** Sends to the fixed TIRO inbox. Customer-supplied addresses are never used as mail recipients. */
export async function sendTiroEmail(message: TiroEmail): Promise<EmailDelivery> {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const configuredFrom = import.meta.env.RESEND_FROM_EMAIL;
  const recipient = import.meta.env.TIRO_REQUEST_RECIPIENT ?? defaultRecipient;
  if (!apiKey || !configuredFrom || !recipient) return { status: 'unavailable' };

  const from = configuredFrom.includes('<') ? configuredFrom : `TIRO requests <${configuredFrom}>`;
  try {
    const response = await fetch(resendEndpoint, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        subject: message.subject.replace(/[\r\n]+/g, ' '),
        text: message.text,
        html: message.html,
        attachments: message.attachments,
      }),
    });

    if (!response.ok) return { status: 'failed' };
    const result = await response.json() as { id?: string };
    return { status: 'sent', id: result.id };
  } catch {
    return { status: 'failed' };
  }
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character);
}

export function emailShell(title: string, rows: Array<[string, string]>) {
  const details = rows.map(([label, value]) => `<tr><th style="padding:8px 12px;text-align:left;background:#f3f5f7;color:#071a3d">${escapeHtml(label)}</th><td style="padding:8px 12px">${escapeHtml(value || 'Not provided')}</td></tr>`).join('');
  return `<!doctype html><html><body style="margin:0;background:#f3f5f7;font-family:Arial,sans-serif;color:#182230"><main style="max-width:680px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden"><header style="padding:24px;background:#071a3d;color:#fff"><p style="margin:0;font-size:12px;font-weight:700;letter-spacing:1px">TIRO DIGITAL</p><h1 style="margin:8px 0 0;font-size:24px">${escapeHtml(title)}</h1></header><section style="padding:24px"><p>A new website request needs TIRO's attention.</p><table style="width:100%;border-collapse:collapse;font-size:14px">${details}</table><p style="margin:24px 0 0;color:#667085;font-size:12px">Sent securely from the TIRO website. This information is not stored by the website.</p></section></main></body></html>`;
}
