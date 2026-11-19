import Link from 'next/link';
import type { Product } from '@/lib/shopify/types';
import { discountPct, img, money, srcset } from '@/lib/utils';
import { Icon, WishIcons } from '@/components/ui/Icon';

/** The theme's `sn-card` product card. */
export default function ProductCard({
  product: p,
  index = 0,
  ratio = '4 / 5',
  sizes = '(min-width: 990px) 25vw, 60vw',
  priority = false,
  maxSwatches = 5,
  lite = false,
}: {
  product: Product;
  index?: number;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  maxSwatches?: number;
  /** The theme's JS-built card (SN.cardHTML, used by "Recently viewed"): no swatches, a plain "Sale" badge. */
  lite?: boolean;
}) {
  const url = `/products/${p.handle}`;
  const first = p.featuredImage || p.images[0];
  const second = p.images.find((i) => i.url !== first?.url);
  const pct = discountPct(p.price, p.compareAtPrice);
  const sale = pct > 0;
  const colorOpt = p.options.find((o) => o.values.some((v) => v.color));
  const colorIdx = colorOpt ? p.options.indexOf(colorOpt) : -1;
  const swatches = colorOpt
    ? colorOpt.values.map((v) => {
        const variant = p.variants.find((x) => x.selectedOptions[colorIdx]?.value === v.name);
        return { ...v, variant };
      })
    : [];

  return (
    <article
      className="sn-card"
      data-r=""
      // above-the-fold cards render visible at first paint (no JS reveal) — see overrides.css
      data-atf={priority ? '' : undefined}
      style={{ '--i': index, '--ratio': ratio } as React.CSSProperties}
    >
      <div className="sn-card__stage">
        <Link className="sn-card__media sn-ripple" href={url} aria-label={p.title}>
          {first ? (
            <img
              src={img(first.url, 700)}
              srcSet={srcset(first.url, [400, 700, 1000])}
              sizes={sizes}
              alt={first.altText || p.title}
              width={first.width || 1024}
              height={first.height || 1280}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority && index < 2 ? 'high' : undefined}
            />
          ) : null}
          {second ? <img className="sn-card__b" src={img(second.url, 700)} alt="" loading="lazy" width={second.width || 1024} height={second.height || 1280} /> : null}
        </Link>
        <div className="sn-card__badges">
          {lite ? (
            <>
              {sale ? <span className="sn-badge sn-badge--sale">Sale</span> : null}
              {!p.available ? <span className="sn-badge sn-badge--out">Sold out</span> : null}
            </>
          ) : (
            <>
              {/* theme: a sold-out card shows "Sold out" in place of the discount */}
              {!p.available ? <span className="sn-badge sn-badge--out">Sold out</span> : sale ? <span className="sn-badge sn-badge--sale">−{pct}%</span> : null}
              {p.isNew ? <span className="sn-badge sn-badge--new">New</span> : null}
            </>
          )}
        </div>
        <button type="button" className="sn-card__wish" data-sn-wish={p.handle} aria-label={`Save ${p.title} to wishlist`} aria-pressed="false">
          <WishIcons />
        </button>
        <button type="button" className="sn-card__quick" data-sn-quick={p.handle}>
          <svg viewBox="0 0 24 24" fill="none" className="icon" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span>Quick add</span>
        </button>
      </div>
      <div className="sn-card__info">
        {lite ? null : <div className="sn-card__top">
          {swatches.length ? (
            <div className="sn-sw">
              {swatches.slice(0, maxSwatches).map((s) => (
                <Link
                  key={s.name}
                  href={s.variant ? `${url}?variant=${s.variant.numericId}` : url}
                  className="sn-sw__dot"
                  title={s.name}
                  aria-label={`${colorOpt!.name}: ${s.name}`}
                  style={{ '--sw': s.color || '#ccc' } as React.CSSProperties}
                  data-img={s.variant?.image?.url ? img(s.variant.image.url, 700) : undefined}
                />
              ))}
              {swatches.length > maxSwatches ? (
                <Link href={url} className="sn-sw__more">
                  +{swatches.length - maxSwatches}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>}
        <h3 className="sn-card__title">
          <Link href={url}>{p.title}</Link>
        </h3>
        <div className="sn-card__price">
          <span className="sn-price">
            <span className={`sn-price__now${sale ? ' is-sale' : ''}`}>
              {p.priceVaries ? <span className="sn-price__from">From </span> : null}
              {money(p.price)}
            </span>
            {sale ? <s className="sn-price__was">{money(p.compareAtPrice)}</s> : null}
          </span>
        </div>
      </div>
    </article>
  );
}

export { Icon };
