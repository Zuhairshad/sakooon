'use server';

import { cookies } from 'next/headers';
import { SHOPIFY_ENABLED, shopifyFetch } from './client';
import { findVariant } from '../data/local';
import { CART } from './queries';
import type { Cart } from './types';

const COOKIE = 'sn_cart';
const cents = (m?: { amount: string } | null) => (m ? Math.round(parseFloat(m.amount) * 100) : null);

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizeCart(c: any): Cart {
  return {
    id: c.id,
    checkoutUrl: c.checkoutUrl,
    totalQuantity: c.totalQuantity,
    note: c.note,
    subtotal: cents(c.cost?.subtotalAmount) ?? 0,
    total: cents(c.cost?.totalAmount) ?? 0,
    lines: (c.lines?.nodes || [])
      .filter((l: any) => l.merchandise?.id)
      .map((l: any) => ({
        id: l.id,
        quantity: l.quantity,
        cost: cents(l.cost?.totalAmount) ?? 0,
        variant: {
          id: l.merchandise.id,
          title: l.merchandise.title,
          price: cents(l.merchandise.price) ?? 0,
          compareAtPrice: cents(l.merchandise.compareAtPrice),
          image: l.merchandise.image,
          selectedOptions: l.merchandise.selectedOptions,
          product: l.merchandise.product,
        },
      })),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */


/* ---------------- local cart (no Shopify store connected) ----------------
   Lines live in a cookie and are priced from the local catalogue. Checkout
   points at /cart until SHOPIFY_STORE_DOMAIN is set. */
const LOCAL = 'sn_cart_local';
type LocalLine = { id: string; v: string; q: number; a?: { key: string; value: string }[] };
type LocalCart = { lines: LocalLine[]; note: string | null };

async function readLocal(): Promise<LocalCart> {
  try {
    return JSON.parse((await cookies()).get(LOCAL)?.value || '') as LocalCart;
  } catch {
    return { lines: [], note: null };
  }
}
async function writeLocal(c: LocalCart): Promise<Cart> {
  (await cookies()).set(LOCAL, JSON.stringify(c), { path: '/', httpOnly: true, sameSite: 'lax', secure: true, maxAge: 60 * 60 * 24 * 14 });
  return buildLocal(c);
}
function buildLocal(c: LocalCart): Cart {
  const lines = c.lines.flatMap((l) => {
    const hit = findVariant(l.v);
    if (!hit) return [];
    const { product: p, variant: v } = hit;
    return [{
      id: l.id,
      quantity: l.q,
      cost: v.price * l.q,
      variant: {
        id: v.id,
        title: v.title,
        price: v.price,
        compareAtPrice: v.compareAtPrice,
        image: v.image,
        selectedOptions: v.selectedOptions,
        product: { handle: p.handle, title: p.title, featuredImage: p.featuredImage },
      },
    }];
  });
  const subtotal = lines.reduce((s, l) => s + l.cost, 0);
  return { id: 'local', checkoutUrl: '/cart', totalQuantity: lines.reduce((s, l) => s + l.quantity, 0), note: c.note, subtotal, total: subtotal, lines };
}

async function setCartCookie(id: string) {
  (await cookies()).set(COOKIE, id, { path: '/', httpOnly: true, sameSite: 'lax', secure: true, maxAge: 60 * 60 * 24 * 14 });
}

export async function getCart(): Promise<Cart | null> {
  if (!SHOPIFY_ENABLED) {
    const c = await readLocal();
    return c.lines.length || c.note ? buildLocal(c) : null;
  }
  const id = (await cookies()).get(COOKIE)?.value;
  if (!id) return null;
  try {
    const d = await shopifyFetch<{ cart: unknown }>(`query($id: ID!) { cart(id: $id) { ...CartFields } } ${CART}`, { id });
    return d.cart ? normalizeCart(d.cart) : null;
  } catch {
    return null;
  }
}

type LineInput = { merchandiseId: string; quantity: number; attributes?: { key: string; value: string }[] };
const toGid = (id: string | number) => (String(id).startsWith('gid://') ? String(id) : `gid://shopify/ProductVariant/${id}`);

export async function addToCart(
  items: { id: string | number; quantity?: number; properties?: Record<string, string> }[],
): Promise<{ cart: Cart | null; error?: string }> {
  const lines: LineInput[] = items.map((i) => ({
    merchandiseId: toGid(i.id),
    quantity: Math.max(1, i.quantity || 1),
    ...(i.properties && Object.keys(i.properties).length ? { attributes: Object.entries(i.properties).map(([key, value]) => ({ key, value })) } : {}),
  }));
  if (!SHOPIFY_ENABLED) {
    const c = await readLocal();
    for (const l of lines) {
      if (!findVariant(l.merchandiseId)) return { cart: buildLocal(c), error: 'This item is unavailable' };
      const same = c.lines.find((x) => x.v === l.merchandiseId && JSON.stringify(x.a || []) === JSON.stringify(l.attributes || []));
      if (same) same.q += l.quantity;
      else c.lines.push({ id: `line-${Date.now().toString(36)}-${c.lines.length}`, v: l.merchandiseId, q: l.quantity, ...(l.attributes ? { a: l.attributes } : {}) });
    }
    return { cart: await writeLocal(c) };
  }
  const id = (await cookies()).get(COOKIE)?.value;
  try {
    if (id) {
      const d = await shopifyFetch<{ cartLinesAdd: { cart: unknown; userErrors: { message: string }[] } }>(
        `mutation($id: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $id, lines: $lines) { cart { ...CartFields } userErrors { message } } } ${CART}`,
        { id, lines },
      );
      if (d.cartLinesAdd.cart) {
        return { cart: normalizeCart(d.cartLinesAdd.cart), error: d.cartLinesAdd.userErrors[0]?.message };
      }
    }
    const d = await shopifyFetch<{ cartCreate: { cart: { id: string } | null; userErrors: { message: string }[] } }>(
      `mutation($lines: [CartLineInput!]) { cartCreate(input: { lines: $lines }) { cart { ...CartFields } userErrors { message } } } ${CART}`,
      { lines },
    );
    if (!d.cartCreate.cart) return { cart: null, error: d.cartCreate.userErrors[0]?.message || 'Could not add to cart' };
    await setCartCookie(d.cartCreate.cart.id);
    return { cart: normalizeCart(d.cartCreate.cart), error: d.cartCreate.userErrors[0]?.message };
  } catch {
    return { cart: null, error: 'Could not add to cart' };
  }
}

export async function updateLine(lineId: string, quantity: number): Promise<Cart | null> {
  if (!SHOPIFY_ENABLED) {
    const c = await readLocal();
    c.lines = c.lines.flatMap((l) => (l.id !== lineId ? [l] : quantity > 0 ? [{ ...l, q: quantity }] : []));
    return writeLocal(c);
  }
  const id = (await cookies()).get(COOKIE)?.value;
  if (!id) return null;
  if (quantity <= 0) {
    const d = await shopifyFetch<{ cartLinesRemove: { cart: unknown } }>(
      `mutation($id: ID!, $ids: [ID!]!) { cartLinesRemove(cartId: $id, lineIds: $ids) { cart { ...CartFields } } } ${CART}`,
      { id, ids: [lineId] },
    );
    return d.cartLinesRemove.cart ? normalizeCart(d.cartLinesRemove.cart) : null;
  }
  const d = await shopifyFetch<{ cartLinesUpdate: { cart: unknown } }>(
    `mutation($id: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $id, lines: $lines) { cart { ...CartFields } } } ${CART}`,
    { id, lines: [{ id: lineId, quantity }] },
  );
  return d.cartLinesUpdate.cart ? normalizeCart(d.cartLinesUpdate.cart) : null;
}

export async function updateNote(note: string): Promise<Cart | null> {
  if (!SHOPIFY_ENABLED) return writeLocal({ ...(await readLocal()), note });
  const id = (await cookies()).get(COOKIE)?.value;
  if (!id) return null;
  const d = await shopifyFetch<{ cartNoteUpdate: { cart: unknown } }>(
    `mutation($id: ID!, $note: String!) { cartNoteUpdate(cartId: $id, note: $note) { cart { ...CartFields } } } ${CART}`,
    { id, note },
  );
  return d.cartNoteUpdate.cart ? normalizeCart(d.cartNoteUpdate.cart) : null;
}
