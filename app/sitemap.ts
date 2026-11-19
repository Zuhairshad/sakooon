import type { MetadataRoute } from 'next';
import { getCollections, getProducts } from '@/lib/shopify';
import { getBlogs, getPages } from '@/lib/shopify/content';
import { SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, pages, blogs] = await Promise.all([
    getProducts({ first: 250 }).catch(() => []),
    getCollections().catch(() => []),
    getPages().catch(() => []),
    getBlogs().catch(() => []),
  ]);
  const u = (p: string) => `${SITE_URL}${p}`;
  return [
    { url: u('/'), changeFrequency: 'daily', priority: 1 },
    { url: u('/collections'), changeFrequency: 'weekly', priority: 0.6 },
    { url: u('/collections/all'), changeFrequency: 'daily', priority: 0.7 },
    ...collections.map((c) => ({ url: u(`/collections/${c.handle}`), changeFrequency: 'weekly' as const, priority: 0.7 })),
    ...products.map((p) => ({
      url: u(`/products/${p.handle}`),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      images: p.featuredImage ? [p.featuredImage.url] : undefined,
    })),
    ...pages.map((p) => ({ url: u(`/pages/${p.handle}`), lastModified: p.updatedAt, changeFrequency: 'monthly' as const, priority: 0.5 })),
    ...blogs.flatMap((b) => [
      { url: u(`/blogs/${b.handle}`), changeFrequency: 'weekly' as const, priority: 0.4 },
      ...b.articles.map((a) => ({ url: u(`/blogs/${b.handle}/${a.handle}`), lastModified: a.publishedAt, changeFrequency: 'monthly' as const, priority: 0.4 })),
    ]),
  ];
}
