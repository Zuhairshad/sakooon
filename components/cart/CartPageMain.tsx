'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import './cart-page.css';
import { useCart } from './CartProvider';
import { useHydrated } from './useHydrated';
import { FREE_SHIPPING } from './CartDrawer';
import { img, money } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';
import { PillowArt } from '@/components/ui/Art';
import { WHATSAPP_NUMBER } from '@/lib/content/products';

const SEC = 'template--23876058775655__main';
/** Sign-in link: /account redirects to Shopify customer accounts once SHOPIFY_SHOP_ID is set (next.config.ts). */
export const ACCOUNT_URL = '/account';

const Ph = () => (
  <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="6.3" />
  </svg>
);

/** Port of the theme's cart template (snmk), driven by the Storefront API cart. */
export default function CartPageMain() {
  const { cart, ready, change, note, busyLine } = useCart();
  const [terms, setTerms] = useState(false);
  const goRef = useRef<HTMLAnchorElement>(null);
  const mounted = useHydrated();

  const lines = mounted ? cart?.lines || [] : [];
  const empty = !lines.length;
  const subtotal = cart?.subtotal || 0;
  const pct = Math.min(100, (subtotal / FREE_SHIPPING) * 100);
  const left = Math.max(0, FREE_SHIPPING - subtotal);
  const savings = lines.reduce((s, l) => s + (l.variant.compareAtPrice && l.variant.compareAtPrice > l.variant.price ? (l.variant.compareAtPrice - l.variant.price) * l.quantity : 0), 0);
  const count = lines.reduce((s, l) => s + l.quantity, 0);

  // re-run reveal / feathers when switching between empty and filled states
  useEffect(() => {
    if (!mounted || !ready) return;
    const r = document.getElementById(`snmk-${SEC}`);
    if (r) requestAnimationFrame(() => {
      window.SN?.boot?.(r);
      r.querySelectorAll('[data-r]').forEach((e) => e.classList.add('is-in'));
    });
  }, [empty, mounted, ready]);

  const waText = lines.length
    ? `Hi Sakooon, I would like to order:\n${lines.map((l) => `${l.quantity} x ${l.variant.product.title}${l.variant.title !== 'Default Title' ? ` (${l.variant.title})` : ''}`).join('\n')}`
    : '';

  return (
    <section
      id={`snmk-${SEC}`}
      className="sn-s snmk"
      style={{ '--bg': '#F4EEE4', '--tx': '#1B2130', '--ac': '#A8834F', '--pt': '60px', '--pb': '100px' }}
      data-section={SEC}
      aria-busy={!mounted || !ready}
    >
      <div className="sn-wrap" data-snmk-root="">
        {empty ? (
          <div className="snmk__empty" data-sn-silk-host="">
            <div className="sn-silk" data-sn-silk="" data-c1="#161B29" data-c2="#2B2B45" data-c3="#E3C793" data-speed=".45" data-amp=".8" />
            <div data-sn-feathers="26" data-color="#E3C793" style={{ position: 'absolute', inset: '0', zIndex: '0' }} />
            <div className="snmk__ein">
              <div className="snmk__bed" aria-hidden="true">
                <PillowArt id="cart" />
                <span className="snmk__z">z</span>
                <span className="snmk__z">z</span>
                <span className="snmk__z">z</span>
              </div>
              <p className="sn-eyebrow">
                <Ph />
                {" Shh, it's quiet here"}
              </p>
              <h1 className="sn-h sn-h--l">
                {'Your cart is '}
                <em>fast asleep</em>
              </h1>
              <p className="sn-lead">Wake it up with something soft.</p>
              <div className="snmk__ebtn">
                <Link className="sn-btn sn-btn--light" href="/collections/all">
                  <span>Explore bedding</span>
                  <Icon name="arrow" />
                </Link>
                <a className="sn-link snmk__login" href={ACCOUNT_URL}>
                  Have an account? Sign in
                </a>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="snmk__head">
              <div className="sn-head__main">
                <p className="sn-eyebrow" data-r="">
                  <Ph />
                  {' Your bag'}
                </p>
                <h1 className="sn-h sn-h--l">
                  {'Ready for '}
                  <em>bed</em>
                </h1>
              </div>
              <p className="snmk__cnt">
                <b>{count}</b> {count === 1 ? 'piece' : 'pieces'}
              </p>
            </div>

            <div className="snmk__goal sn-pillow">
              <p>
                {left > 0 ? (
                  <>
                    Add <b>{money(left)}</b> more for free delivery
                  </>
                ) : (
                  <>
                    <b>Free delivery</b> unlocked — sleep tight.
                  </>
                )}
              </p>
              <div className="snmk__track" style={{ '--p': `${pct}%` }}>
                <span className="snmk__tl">
                  <i />
                </span>
                {[0, 50, 100].map((x) => (
                  <span key={x} className={`snmk__ph${pct >= x ? ' is-on' : ''}`} style={{ '--x': `${x}%` }}>
                    <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                      <circle cx="8" cy="8" r="6.3" />
                      {x === 50 ? <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8Z" /> : x === 100 ? <circle cx="8" cy="8" r="6.3" fill="currentColor" /> : null}
                    </svg>
                  </span>
                ))}
              </div>
            </div>

            <div className="snmk__grid">
              <div>
                <div className="snmk__lh" aria-hidden="true">
                  <span>Product</span>
                  <span>Quantity</span>
                  <span>Total</span>
                </div>
                {lines.map((l) => {
                  const href = `/products/${l.variant.product.handle}`;
                  const im = l.variant.image?.url || l.variant.product.featuredImage?.url;
                  const sale = l.variant.compareAtPrice && l.variant.compareAtPrice > l.variant.price;
                  const opts = l.variant.selectedOptions.filter((o) => o.value !== 'Default Title');
                  return (
                    <div key={l.id} className={`snmk__line${busyLine === l.id ? ' is-busy' : ''}`} data-snmk-line={l.id}>
                      <Link className="snmk__img" href={href}>
                        {im ? <img src={img(im, 300)} alt={l.variant.product.title} width={110} height={138} loading="lazy" /> : <PillowArt id={`l${l.id.slice(-6)}`} />}
                      </Link>
                      <div className="snmk__info">
                        <span className="snmk__v">Sakooon</span>
                        <Link className="snmk__t" href={href}>
                          {l.variant.product.title}
                        </Link>
                        {opts.length ? (
                          <p className="snmk__opt">
                            {opts.map((o) => (
                              <span key={o.name}>
                                {o.name}: <b>{o.value}</b>
                              </span>
                            ))}
                          </p>
                        ) : null}
                        <p className="snmk__unit">
                          {sale ? <s>{money(l.variant.compareAtPrice)}</s> : null}
                          {money(l.variant.price)}
                        </p>
                        <button type="button" className="snmk__rm" onClick={() => change(l.id, 0)}>
                          <Icon name="close" />
                          Remove
                        </button>
                      </div>
                      <div className="snmk__qty">
                        <div className="sn-qty sn-qty--sm">
                          <button type="button" aria-label="Decrease quantity" onClick={() => change(l.id, l.quantity - 1)}>
                            <Icon name="minus" />
                          </button>
                          <input
                            type="number"
                            min={0}
                            key={l.quantity}
                            defaultValue={l.quantity}
                            aria-label="Quantity"
                            onChange={(e) => {
                              const v = Math.max(0, +e.target.value || 0);
                              clearTimeout((e.target as HTMLInputElement & { _t?: number })._t);
                              (e.target as HTMLInputElement & { _t?: number })._t = window.setTimeout(() => change(l.id, v), 400);
                            }}
                          />
                          <button type="button" aria-label="Increase quantity" onClick={() => change(l.id, l.quantity + 1)}>
                            <Icon name="plus" />
                          </button>
                        </div>
                      </div>
                      <div className="snmk__lt">
                        {sale ? <s>{money(l.variant.compareAtPrice! * l.quantity)}</s> : null}
                        <b>{money(l.cost)}</b>
                      </div>
                    </div>
                  );
                })}
                <details className="snmk__note">
                  <summary>
                    <Icon name="note" />
                    Add a note for your order
                  </summary>
                  <textarea className="sn-input" defaultValue={cart?.note || ''} onBlur={(e) => note(e.target.value)} aria-label="Order note" />
                </details>
              </div>

              <aside className="snmk__sum">
                <div className="snmk__card sn-pillow">
                  <dl className="snmk__rows">
                    <div>
                      <dt>Subtotal</dt>
                      <dd>{money(subtotal + savings)}</dd>
                    </div>
                    {savings > 0 ? (
                      <div className="is-disc">
                        <dt>
                          <Icon name="sparkle" />
                          Savings
                        </dt>
                        <dd>−{money(savings)}</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt>
                        <Icon name="truck" />
                        Delivery
                      </dt>
                      <dd>{left > 0 ? 'Calculated at checkout' : <span className="snmk__free">Free</span>}</dd>
                    </div>
                  </dl>
                  <div className="snmk__tot">
                    <span>Total</span>
                    <b>{money(cart?.total || subtotal)}</b>
                  </div>
                  {savings > 0 ? (
                    <p className="snmk__saved">
                      <Icon name="sparkle" />
                      You&apos;re saving {money(savings)} on this order
                    </p>
                  ) : null}
                  <label className="sn-check snmk__terms">
                    <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
                    <span>I agree to the terms &amp; exchange policy</span>
                  </label>
                  <div className="snmk__x">
                    <a
                      ref={goRef}
                      className="sn-btn sn-btn--gold sn-btn--block snmk__go"
                      href={cart?.checkoutUrl}
                      onClick={(e) => {
                        if (terms) return;
                        e.preventDefault();
                        const g = goRef.current!;
                        g.classList.remove('is-shake');
                        void g.offsetWidth;
                        g.classList.add('is-shake');
                        window.SN?.toast?.('Please accept the terms first', 'info');
                      }}
                    >
                      <span>Checkout</span>
                      <Icon name="lock" />
                    </a>
                    <a className="snmk__wa" href={`https://wa.me/${WHATSAPP_NUMBER}?${new URLSearchParams({ text: waText })}`} target="_blank" rel="noopener">
                      <Icon name="whatsapp" />
                      Order on WhatsApp
                    </a>
                  </div>
                  <ul className="snmk__trust">
                    <li>
                      <Icon name="lock" />
                      Secure checkout by Shopify
                    </li>
                    <li>
                      <Icon name="exchange" />
                      7-day easy exchange
                    </li>
                    <li>
                      <Icon name="truck" />
                      Cash on delivery across Pakistan
                    </li>
                  </ul>
                </div>
                <Link className="sn-link snmk__cont" href="/collections/all">
                  Continue shopping
                </Link>
              </aside>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
