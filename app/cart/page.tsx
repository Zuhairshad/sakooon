import type { Metadata } from 'next';
import { getProducts } from '@/lib/shopify';
import CartPageMain from '@/components/cart/CartPageMain';
import RecsRail from '@/components/product/RecsRail';
import Boot from '@/components/theme/Boot';
import '@/components/cart/cart-recs.css';

export const metadata: Metadata = { title: 'Your Shopping Cart', robots: { index: false } };

export default async function CartPage() {
  const products = await getProducts({ first: 8, sortKey: 'TITLE' }).catch(() => []);
  return (
    <>
      <CartPageMain />
      <RecsRail
        id="snrc-template--23876058775655__recs"
        products={products}
        bg="#FBF8F2"
        variant="collection"
        eyebrow="Finish the bed"
        title="Pairs"
        em="beautifully"
      />
      <Boot />
    </>
  );
}
