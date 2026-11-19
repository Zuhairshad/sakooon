'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { whenIdle } from '@/lib/theme/lite';
import type { Upsell } from './CartDrawer';

const CartDrawer = dynamic(() => import('./CartDrawer'), { ssr: false });

/**
 * The cart drawer is hidden until opened, so it is neither server-rendered nor
 * part of the first-load JS: it mounts once the page is idle. Until then the
 * header cart link simply opens /cart.
 */
export default function LazyCartDrawer({ upsell }: { upsell: Upsell[] }) {
  const [show, setShow] = useState(false);
  useEffect(() => whenIdle(() => setShow(true)), []);
  return show ? <CartDrawer upsell={upsell} /> : null;
}
