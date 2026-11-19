import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { TAGS } from '@/lib/shopify';

/**
 * Shopify webhook → cache refresh. Point products/*, collections/* and
 * inventory webhooks at /api/revalidate. Requests are verified with
 * SHOPIFY_WEBHOOK_SECRET (the app's client secret). Alternatively call
 * /api/revalidate?secret=REVALIDATE_SECRET&tag=products manually.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const url = new URL(req.url);
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  const hmac = req.headers.get('x-shopify-hmac-sha256');
  const manual = url.searchParams.get('secret');

  const okManual = !!process.env.REVALIDATE_SECRET && manual === process.env.REVALIDATE_SECRET;
  let okHook = false;
  if (secret && hmac) {
    const digest = crypto.createHmac('sha256', secret).update(raw, 'utf8').digest('base64');
    okHook = digest.length === hmac.length && crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmac));
  }
  if (!okManual && !okHook) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const topic = req.headers.get('x-shopify-topic') || '';
  const tags = new Set<string>();
  if (url.searchParams.get('tag')) tags.add(url.searchParams.get('tag')!);
  if (topic.startsWith('products') || topic.startsWith('inventory')) tags.add(TAGS.products);
  if (topic.startsWith('collections')) tags.add(TAGS.collections);
  if (!tags.size) [TAGS.products, TAGS.collections, TAGS.pages].forEach((t) => tags.add(t));
  tags.forEach((t) => revalidateTag(t, 'max'));
  return NextResponse.json({ revalidated: [...tags], now: Date.now() });
}
