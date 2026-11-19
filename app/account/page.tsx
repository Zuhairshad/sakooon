import type { Metadata } from 'next';
import Link from 'next/link';
import PageBanner from '@/components/pages/PageBanner';
import PageBody from '@/components/pages/PageBody';
import Boot from '@/components/theme/Boot';

export const metadata: Metadata = { title: 'Account', robots: { index: false } };

/**
 * Placeholder until Shopify customer accounts are connected: once SHOPIFY_SHOP_ID
 * is set, next.config.ts redirects /account to Shopify before this page renders.
 */
export default function AccountPage() {
  return (
    <>
      <PageBanner title="Your account" />
      <PageBody>
        <p>Sign-in is on its way. Until then, everything you need is a tap away:</p>
        <ul>
          <li>
            <Link href="/pages/wishlist">Your wishlist</Link> — pieces you have saved on this device.
          </li>
          <li>
            <Link href="/cart">Your bag</Link> — review what you are about to order.
          </li>
          <li>
            <Link href="/pages/contact">Track an order or ask a question</Link> — real people, quick answers, 10am to 10pm.
          </li>
        </ul>
        <p>
          <Link href="/collections/all">Continue shopping →</Link>
        </p>
      </PageBody>
      <Boot />
    </>
  );
}
