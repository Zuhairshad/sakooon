'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { addToCart, getCart, updateLine, updateNote } from '@/lib/shopify/cart';
import { afterPaint } from '@/components/theme/useAfterPaint';
import type { Cart } from '@/lib/shopify/types';

type Ctx = {
  cart: Cart | null;
  ready: boolean;
  pending: boolean;
  busyLine: string | null;
  add: (items: { id: string | number; quantity?: number; properties?: Record<string, string> }[], open?: boolean) => Promise<Cart | null>;
  change: (lineId: string, qty: number) => Promise<void>;
  note: (note: string) => Promise<void>;
};

const CartCtx = createContext<Ctx | null>(null);
export const useCart = () => {
  const c = useContext(CartCtx);
  if (!c) throw new Error('useCart outside CartProvider');
  return c;
};

function paintCount(n: number) {
  document.querySelectorAll<HTMLElement>('[data-sn-cart-count]').forEach((el) => {
    // unchanged (e.g. the first load of an empty cart): no bump, or the
    // keyframes would briefly pop a hidden "0" badge
    if (el.textContent === String(n)) return;
    el.textContent = String(n);
    el.classList.toggle('is-empty', !n);
    el.classList.remove('is-bump');
    void el.offsetWidth;
    el.classList.add('is-bump');
  });
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [ready, setReady] = useState(false);
  const [busyLine, setBusyLine] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const cartRef = useRef(cart);
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  // load the cart after the first paint; it is never above-the-fold content
  useEffect(
    () =>
      afterPaint(() => {
        getCart().then((c) => {
          setCart(c);
          setReady(true);
        });
      }),
    [],
  );

  useEffect(() => {
    if (ready) paintCount(cart?.totalQuantity || 0);
    document.dispatchEvent(new CustomEvent('sn:cart:updated', { detail: cart }));
  }, [cart, ready]);

  const add = useCallback<Ctx['add']>(async (items, open = true) => {
    const res = await addToCart(items);
    if (res.cart) setCart(res.cart);
    const SN = window.SN;
    if (res.error || !res.cart) {
      SN?.toast?.(res.error || 'Could not add to cart', 'close');
      if (!res.cart) throw new Error(res.error);
    }
    if (open) SN?.open?.('SnCart');
    return res.cart;
  }, []);

  const change = useCallback<Ctx['change']>(async (lineId, qty) => {
    setBusyLine(lineId);
    try {
      const c = await updateLine(lineId, Math.max(0, qty));
      if (c) setCart(c);
    } finally {
      setBusyLine(null);
    }
  }, []);

  const note = useCallback<Ctx['note']>(async (n) => {
    const c = await updateNote(n);
    if (c) setCart(c);
  }, []);

  // bridge for the DOM-driven theme runtime ([data-sn-add], quick view, builder…)
  useEffect(() => {
    const SN = (window.SN = window.SN || {});
    SN.cart = {
      add: (items: { id: string | number; quantity?: number; properties?: Record<string, string> }[], open?: boolean) => new Promise((res, rej) => start(() => add(items, open).then(res, rej))),
      change: (lineId: string, qty: number) => change(lineId, qty),
      count: paintCount,
      open: () => SN.open?.('SnCart'),
      get: () => cartRef.current,
    };
    SN.addToCart = (items: { id: string | number; quantity?: number; properties?: Record<string, string> }[]) => SN.cart.add(items, true);
  }, [add, change]);

  const value = useMemo(() => ({ cart, ready, pending, busyLine, add, change, note }), [cart, ready, pending, busyLine, add, change, note]);
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
