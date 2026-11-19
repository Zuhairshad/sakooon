'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/shopify/types';
import { productsByHandles } from '@/lib/shopify/product-actions';
import { recent } from '@/lib/theme/lite';
import ProductCard from './ProductCard';
import { RailShell } from './RecsRail';
import './product-recent.css';

/** "Recently viewed" — read from localStorage, rendered client-side like the theme. */
export default function RecentRail({ id, current, bg = '#FBF8F2' }: { id: string; current?: string; bg?: string }) {
  const [list, setList] = useState<Product[] | null>(null);
  useEffect(() => {
    const handles = recent.get().filter((h) => h && h !== current).slice(0, 8);
    if (!handles.length) return;
    let live = true;
    productsByHandles(handles).then((ps) => live && setList(ps));
    return () => {
      live = false;
    };
  }, [current]);

  useEffect(() => {
    if (!list?.length) return;
    const r = document.getElementById(id);
    if (r) requestAnimationFrame(() => window.SN?.boot?.(r));
  }, [list, id]);

  if (!list?.length) return null;
  return (
    <RailShell id={id} variant="recent" bg={bg} eyebrow="Still thinking?" title="Recently" em="viewed" dataCurrent={current}>
      {list.map((p, i) => (
        <ProductCard key={p.handle} product={p} index={i} sizes="310px" lite />
      ))}
    </RailShell>
  );
}
