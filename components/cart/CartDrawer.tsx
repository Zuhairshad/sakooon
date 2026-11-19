'use client';

import Link from 'next/link';
import { useState } from 'react';
import '@/app/styles/chrome/sn-cart-drawer.css';
import { useCart } from './CartProvider';
import { useHydrated } from './useHydrated';
import { money, img } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';
import { PillowArt } from '@/components/ui/Art';

export type Upsell = { handle: string; title: string; image: string | null; price: number; variantId: number; available: boolean };

export const FREE_SHIPPING = 500000; // Rs. 5,000 in cents (matches the announcement bar)
export const WHATSAPP = 'https://wa.me/';

export default function CartDrawer({ upsell = [] }: { upsell?: Upsell[] }) {
  const { cart: liveCart, busyLine, change, add, note } = useCart();
  const [adding, setAdding] = useState<number | null>(null);
  // The drawer sits in a Suspense boundary and can hydrate after the provider
  // has already loaded the cart; render the empty server state until mounted
  // so hydration always matches.
  const mounted = useHydrated();
  const cart = mounted ? liveCart : null;
  const lines = cart?.lines || [];
  const count = cart?.totalQuantity || 0;
  const subtotal = cart?.subtotal || 0;
  const pct = Math.min(100, (subtotal / FREE_SHIPPING) * 100);
  const left = Math.max(0, FREE_SHIPPING - subtotal);
  const savings = lines.reduce((s, l) => s + (l.variant.compareAtPrice && l.variant.compareAtPrice > l.variant.price ? (l.variant.compareAtPrice - l.variant.price) * l.quantity : 0), 0);
  const inCart = new Set(lines.map((l) => l.variant.product.handle));
  const ups = upsell.filter((u) => u.available && !inCart.has(u.handle)).slice(0, 3);

  return (
    <div className="sn-ov snc" id="SnCart" hidden aria-label="Cart">
      <div className="sn-ov__bg" data-sn-close="" />
      <aside className="sn-drawer snc__d" role="dialog" aria-modal="true" aria-labelledby="snc-t">
        <div data-sn-cart-inner="">
          <div className="sn-drawer__head">
            <p className="sn-drawer__title" id="snc-t">
              {'Your bag '}
              <sup>{count}</sup>
            </p>
            <button type="button" className="sn-ibtn sn-ibtn--sm" data-sn-close="" aria-label="Close">
              <Icon name="close" />
            </button>
          </div>

          {lines.length ? (
            <>
              <div className="snc__goal">
                <p className="snc__goal-t">
                  {left > 0 ? (
                    <>
                      You&apos;re <b>{money(left)}</b> away from free delivery
                    </>
                  ) : (
                    <>
                      <b>Free delivery</b> unlocked — sleep tight.
                    </>
                  )}
                </p>
                <div className="snc__track" style={{ '--p': `${pct}%` } as React.CSSProperties}>
                  <svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
                    <path className="b" d="M0 6 Q25 0 50 6 T100 6" />
                    <path className="d" d="M0 6 Q25 0 50 6 T100 6" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }} />
                  </svg>
                  <span className={`snc__moon${left > 0 ? '' : ' is-full'}`}>
                    <Icon name={left > 0 ? 'moon' : 'check'} />
                  </span>
                </div>
              </div>

              <div className="sn-drawer__body snc__body">
                <ul className="snc__items" role="list">
                  {lines.map((l, i) => {
                    const im = l.variant.image?.url || l.variant.product.featuredImage?.url;
                    const opts = l.variant.selectedOptions.filter((o) => o.value !== 'Default Title').map((o) => o.value).join(' / ');
                    const sale = l.variant.compareAtPrice && l.variant.compareAtPrice > l.variant.price;
                    return (
                      <li key={l.id} className={`snc__item${busyLine === l.id ? ' is-busy' : ''}`} style={{ '--i': i } as React.CSSProperties}>
                        <Link className="sn-media snc__img" href={`/products/${l.variant.product.handle}`}>
                          {im ? <img src={img(im, 240)} alt={l.variant.product.title} loading="lazy" width={86} height={108} /> : null}
                        </Link>
                        <div className="snc__info">
                          <Link className="snc__name" href={`/products/${l.variant.product.handle}`}>
                            {l.variant.product.title}
                          </Link>
                          {opts ? <p className="snc__var">{opts}</p> : null}
                          <div className="snc__row">
                            <div className="sn-qty sn-qty--sm">
                              <button type="button" aria-label="Decrease quantity" onClick={() => change(l.id, l.quantity - 1)}>
                                <Icon name="minus" />
                              </button>
                              <input type="number" value={l.quantity} min={0} aria-label="Quantity" readOnly />
                              <button type="button" aria-label="Increase quantity" onClick={() => change(l.id, l.quantity + 1)}>
                                <Icon name="plus" />
                              </button>
                            </div>
                            <span className="snc__price">
                              <span>{money(l.cost)}</span>
                              {sale ? <s>{money(l.variant.compareAtPrice! * l.quantity)}</s> : null}
                            </span>
                          </div>
                        </div>
                        <button type="button" className="snc__rm" aria-label={`Remove ${l.variant.product.title}`} onClick={() => change(l.id, 0)}>
                          <Icon name="close" />
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {ups.length ? (
                  <div className="snc__up">
                    <p className="sn-eyebrow">Complete the set</p>
                    <div className="snc__up-rail">
                      {ups.map((u) => (
                        <div className="snc__upc" key={u.handle}>
                          <Link className="sn-media" href={`/products/${u.handle}`}>
                            {u.image ? <img src={img(u.image, 160)} alt="" loading="lazy" width={56} height={70} /> : null}
                          </Link>
                          <div>
                            <Link className="snc__upn" href={`/products/${u.handle}`}>
                              {u.title}
                            </Link>
                            <span>{money(u.price)}</span>
                          </div>
                          <button
                            type="button"
                            className={`sn-ibtn sn-ibtn--sm${adding === u.variantId ? ' is-busy' : ''}`}
                            aria-label={`Add ${u.title}`}
                            onClick={() => {
                              setAdding(u.variantId);
                              add([{ id: u.variantId, quantity: 1 }], false).finally(() => setAdding(null));
                            }}
                          >
                            <Icon name="plus" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="sn-drawer__foot snc__foot">
                <details className="snc__note">
                  <summary>
                    <Icon name="note" />
                    Add a note to your order
                  </summary>
                  <textarea className="sn-input" defaultValue={cart?.note || ''} onBlur={(e) => note(e.target.value)} aria-label="Order note" />
                </details>
                <div className="snc__sum">
                  <span>Subtotal</span>
                  <b>{money(subtotal)}</b>
                </div>
                {savings > 0 ? <p className="snc__save">You&apos;re saving {money(savings)}</p> : null}
                <a className="sn-btn sn-btn--gold sn-btn--block" href={cart?.checkoutUrl}>
                  <span>Checkout</span>
                  <Icon name="lock" />
                </a>
                <div className="snc__links">
                  <Link className="sn-link" href="/cart">
                    View bag
                  </Link>
                  <span className="sn-small">Delivery calculated at checkout.</span>
                </div>
              </div>
            </>
          ) : (
            <div className="sn-drawer__body snc__body">
              <div className="snc__empty">
                <div className="snc__empty-art">
                  <PillowArt />
                </div>
                <p className="sn-h sn-h--s">Your bag is resting</p>
                <p className="sn-small">Let&apos;s find something soft to wake it up.</p>
                <Link className="sn-btn sn-btn--sm" href="/collections/all">
                  <span>Shop bedding</span>
                  <Icon name="arrow" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
