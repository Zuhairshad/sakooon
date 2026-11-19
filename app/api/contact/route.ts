import { NextResponse } from 'next/server';

/**
 * Contact form. Replaces the Liquid theme's `/contact` form (which Shopify
 * emailed to the store owner). Delivery options, in order:
 *  1. CONTACT_WEBHOOK_URL — POSTs the message as JSON (Zapier/Make/Slack/email relay)
 *  2. otherwise the message is logged on the server.
 * Accepts JSON (fetch) or a regular form post (no-JS fallback → redirect).
 */
const FIELDS = ['Topic', 'name', 'phone', 'email', 'Order number', 'body'] as const;

export async function POST(req: Request) {
  const ct = req.headers.get('content-type') || '';
  const isForm = !ct.includes('application/json');
  let data: Record<string, string> = {};
  if (isForm) {
    const fd = await req.formData();
    for (const [k, v] of fd.entries()) data[k.replace(/^contact\[(.*)\]$/, '$1')] = String(v);
  } else {
    data = (await req.json().catch(() => ({}))) as Record<string, string>;
  }
  const msg = Object.fromEntries(FIELDS.map((f) => [f, String(data[f] ?? '').slice(0, 5000)]));
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(msg.email) && msg.body.trim().length > 0;
  if (!valid) {
    return isForm ? NextResponse.redirect(new URL('/pages/contact?error=1', req.url), 303) : NextResponse.json({ error: 'Please add your email and a message.' }, { status: 400 });
  }

  const hook = process.env.CONTACT_WEBHOOK_URL;
  let delivered = false;
  if (hook) {
    const res = await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: 'sakooon.com/pages/contact', ...msg }) }).catch(() => null);
    delivered = !!res?.ok;
    if (!delivered) return isForm ? NextResponse.redirect(new URL('/pages/contact?error=1', req.url), 303) : NextResponse.json({ error: 'Could not send' }, { status: 502 });
  } else {
    console.warn('[contact] CONTACT_WEBHOOK_URL not set — message not delivered:', JSON.stringify(msg));
  }
  return isForm ? NextResponse.redirect(new URL('/pages/contact?sent=1', req.url), 303) : NextResponse.json({ ok: true });
}
