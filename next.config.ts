import type { NextConfig } from 'next';

/**
 * Shopify keeps serving checkout, customer accounts and policies. These
 * redirects switch on once your store is set up:
 *   SHOPIFY_MYSHOPIFY_DOMAIN  e.g. your-store.myshopify.com
 *   SHOPIFY_SHOP_ID           numeric shop id (customer accounts URL)
 */
const MYSHOPIFY = process.env.SHOPIFY_MYSHOPIFY_DOMAIN;
const SHOP_ID = process.env.SHOPIFY_SHOP_ID;
const ACCOUNTS = SHOP_ID ? `https://shopify.com/${SHOP_ID}/account` : null;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // keep in sync with IMAGE_WIDTHS in lib/utils.ts
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [96, 160, 240, 300, 400, 500, 600],
    qualities: [75],
    formats: ['image/avif', 'image/webp'],
    localPatterns: [{ pathname: '/images/**', search: '' }],
    minimumCacheTTL: 31536000,
  },
  async redirects() {
    const shop = [
      ...(ACCOUNTS
        ? [
            { source: '/account', destination: ACCOUNTS, permanent: false },
            { source: '/account/login', destination: ACCOUNTS, permanent: false },
            { source: '/account/register', destination: ACCOUNTS, permanent: false },
            { source: '/account/:path*', destination: `${ACCOUNTS}/:path*`, permanent: false },
            { source: '/customer_authentication/:path*', destination: ACCOUNTS, permanent: false },
          ]
        : []),
      ...(MYSHOPIFY
        ? [
            { source: '/checkouts/:path*', destination: `https://${MYSHOPIFY}/checkouts/:path*`, permanent: false },
            { source: '/checkout', destination: `https://${MYSHOPIFY}/checkout`, permanent: false },
            { source: '/cart/c/:path*', destination: `https://${MYSHOPIFY}/cart/c/:path*`, permanent: false },
            { source: '/policies/:path*', destination: `https://${MYSHOPIFY}/policies/:path*`, permanent: false },
          ]
        : []),
    ];
    return [
      ...shop,
      // Shopify's alternate page URLs
      { source: '/pages/wishlist/:rest+', destination: '/pages/wishlist', permanent: true },
      { source: '/blogs/:blog/tagged/:tag', destination: '/blogs/:blog', permanent: false },
    ];
  },
};

export default nextConfig;
