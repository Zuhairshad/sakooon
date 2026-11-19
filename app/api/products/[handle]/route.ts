import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/shopify';

/** Shopify `/products/{handle}.js`-shaped JSON, used by quick view and the set builder. */
export async function GET(_req: Request, ctx: RouteContext<'/api/products/[handle]'>) {
  const { handle } = await ctx.params;
  const p = await getProduct(handle);
  if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(
    {
      id: p.id,
      handle: p.handle,
      title: p.title,
      vendor: p.vendor,
      type: p.productType,
      url: `/products/${p.handle}`,
      available: p.available,
      price: p.price,
      compare_at_price: p.compareAtPrice,
      price_varies: p.priceVaries,
      featured_image: p.featuredImage?.url ?? null,
      images: p.images.map((i) => i.url),
      options: p.options.map((o) => ({ name: o.name, values: o.values.map((v) => v.name) })),
      variants: p.variants.map((v) => ({
        id: v.numericId,
        title: v.title,
        available: v.available,
        price: v.price,
        compare_at_price: v.compareAtPrice,
        options: v.selectedOptions.map((s) => s.value),
        featured_image: v.image ? { src: v.image.url } : null,
      })),
    },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400' } },
  );
}
