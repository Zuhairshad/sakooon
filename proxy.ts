import { NextResponse, type NextRequest } from 'next/server';
import { articleExists, handleExists } from '@/lib/shopify/handles';

/** Page templates that exist in code even without a Shopify page record. */
const PAGE_TEMPLATES = ['about', 'contact', 'size-guide', 'quiz', 'favorites', 'wishlist', 'faq'];

/**
 * Returns a real HTTP 404 for unknown product / collection / page / blog URLs.
 * With Cache Components the prerendered shell starts a 200 response before a
 * page-level notFound() can run, so the existence check happens here instead.
 */
export async function proxy(req: NextRequest) {
  const [, kind, a, b] = req.nextUrl.pathname.split('/');
  let exists: boolean | null = true;
  if (kind === 'products' && a) exists = await handleExists('products', decodeURIComponent(a));
  else if (kind === 'collections' && a) exists = await handleExists('collections', decodeURIComponent(a), ['all']);
  else if (kind === 'pages' && a) exists = await handleExists('pages', decodeURIComponent(a), PAGE_TEMPLATES);
  else if (kind === 'policies' && a) exists = await handleExists('policies', decodeURIComponent(a));
  else if (kind === 'blogs' && a) exists = await articleExists(decodeURIComponent(a), b ? decodeURIComponent(b) : undefined);

  if (exists === false) {
    // a path with no route renders app/not-found.tsx
    return NextResponse.rewrite(new URL('/_sn-not-found', req.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/products/:handle', '/collections/:handle', '/pages/:handle', '/policies/:handle', '/blogs/:blog', '/blogs/:blog/:article'],
};
