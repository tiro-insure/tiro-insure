const windowMs = 10 * 60 * 1000;
const maxAttempts = 4;
const attempts = new Map<string, number[]>();

/** A best-effort, memory-only guard. It never writes request data to a database or log. */
export function isContactRequestAllowed(request: Request, area: string) {
  const rawAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? 'unknown';
  const key = `${area}:${rawAddress}`;
  const now = Date.now();
  const active = (attempts.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs);
  if (active.length >= maxAttempts) return false;
  active.push(now);
  attempts.set(key, active);
  return true;
}
