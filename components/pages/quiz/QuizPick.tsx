import Link from 'next/link';
import type { Product } from '@/lib/shopify/types';
import { img, money } from '@/lib/utils';

/** Recommended product shown on a quiz result card. */
export default function QuizPick({ product: p }: { product?: Product }) {
  if (!p) return null;
  const im = p.featuredImage?.url;
  return (
    <Link
      href={`/products/${p.handle}`}
      className="sn-glass"
      style={{ display: 'grid', gridTemplateColumns: '56px 1fr', alignItems: 'center', gap: 14, padding: '10px 18px 10px 10px', borderRadius: 18, border: '1px solid color-mix(in srgb, #fff 14%, transparent)', maxWidth: 420 }}
    >
      <span className="sn-media" style={{ aspectRatio: '4 / 5', borderRadius: 12 }}>
        {im ? <img src={img(im, 160)} alt="" width={56} height={70} loading="lazy" /> : null}
      </span>
      <span style={{ display: 'grid', gap: 2 }}>
        <small style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', opacity: 0.7 }}>Our pick for you</small>
        <b style={{ font: '400 1.05rem/1.25 var(--f-head)' }}>{p.title}</b>
        <span style={{ fontSize: 13, color: 'var(--ac)' }}>{money(p.price)}</span>
      </span>
    </Link>
  );
}
