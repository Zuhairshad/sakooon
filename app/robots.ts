import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/** Mirrors the Shopify defaults that matter for a headless storefront. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/cart', '/checkouts/', '/checkout', '/account', '/search', '/*?*variant=*&', '/collections/*sort_by*', '/*/collections/*sort_by*'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
