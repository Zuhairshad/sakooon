import { NextResponse, type NextRequest } from 'next/server';
import { predictiveSearch } from '@/lib/shopify';

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') || '').trim().slice(0, 80);
  if (q.length < 2) return NextResponse.json({ products: [], collections: [], pages: [], articles: [] });
  const d = await predictiveSearch(q).catch(() => ({ products: [], collections: [], pages: [], articles: [] }));
  return NextResponse.json(d, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600' } });
}
