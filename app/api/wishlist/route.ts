import { NextResponse, type NextRequest } from 'next/server';
import { getProductsByHandles } from '@/lib/shopify';

/** Normalized products for the wishlist page: /api/wishlist?handles=a,b,c */
export async function GET(req: NextRequest) {
  const handles = (req.nextUrl.searchParams.get('handles') || '')
    .split(',')
    .map((h) => h.trim())
    .filter((h) => /^[a-z0-9-]{1,120}$/.test(h))
    .slice(0, 60);
  if (!handles.length) return NextResponse.json([]);
  const products = await getProductsByHandles(handles).catch(() => []);
  return NextResponse.json(products, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400' } });
}
