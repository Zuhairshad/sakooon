'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { Icon } from '@/components/ui/Icon';
import type { Product } from '@/lib/shopify/types';
import './main.css';

const KEY = 'sakooon:wish';
const read = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]') || [];
  } catch {
    return [];
  }
};

/**
 * Wishlist page body. The Liquid theme stored saved handles in localStorage
 * (`sakooon:wish`) but its wishlist page had no listing; this renders them.
 */
export default function Wishlist() {
  const [handles, setHandles] = useState<string[] | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const sync = () => setHandles(read());
    sync();
    document.addEventListener('sn:wish', sync);
    window.addEventListener('storage', sync);
    return () => {
      document.removeEventListener('sn:wish', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    if (!handles) return;
    const missing = handles.filter((h) => !products.some((p) => p.handle === h));
    if (!missing.length) return;
    let live = true;
    fetch(`/api/wishlist?handles=${encodeURIComponent(missing.join(','))}`)
      .then((r) => r.json())
      .then((list: Product[]) => live && setProducts((cur) => [...cur, ...list.filter((p) => !cur.some((c) => c.handle === p.handle))]))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [handles, products]);

  // keep heart buttons + counts in sync, and reveal newly rendered cards
  useEffect(() => {
    const SN = window.SN;
    if (!SN) return;
    SN.wish?.paint?.();
    const grid = document.querySelector('[data-snwl-grid]');
    if (grid) grid.querySelectorAll('[data-r]').forEach((el) => el.classList.add('is-in'));
  });

  const shown = handles ? handles.map((h) => products.find((p) => p.handle === h)).filter((p): p is Product => !!p) : [];
  const loading = handles === null || (handles.length > 0 && shown.length === 0);

  return (
    <section
      id="snpg-template--23876059005031__main"
      className="sn-s snpg snpg--simple"
      style={{ '--bg': '#F4EEE4', '--tx': '#1B2130', '--ac': '#A8834F', '--pt': '80px', '--pb': '100px' }}
    >
      <div className="sn-wrap">
        {loading ? (
          <div className="sn-empty" aria-busy="true" style={{ minHeight: 180 }} />
        ) : shown.length ? (
          <>
            <p className="sn-small" style={{ marginBottom: 28 }}>
              {shown.length} {shown.length === 1 ? 'piece' : 'pieces'} saved for later
            </p>
            <div className="sn-grid" data-snwl-grid="" style={{ '--cols': 4 }}>
              {shown.map((p, i) => (
                <ProductCard key={p.handle} product={p} index={i} sizes="(min-width: 990px) 25vw, 50vw" />
              ))}
            </div>
          </>
        ) : (
          <div className="sn-empty">
            <span className="sn-icon-circle" aria-hidden="true">
              <Icon name="heart" />
            </span>
            <p className="sn-h sn-h--m">Your wishlist is empty</p>
            <p className="sn-small">Tap the heart on any piece to keep it here for later.</p>
            <Link className="sn-btn sn-btn--sm" href="/collections/all">
              <span>Shop bedding</span>
              <Icon name="arrow" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
