import type { Product } from '@/lib/shopify/types';
import ProductCard from './ProductCard';
import { Icon } from '@/components/ui/Icon';

/** The theme's "snrc" product rail (related products / recently viewed / cart recs). */
export function RailShell({
  id,
  variant,
  bg,
  eyebrow,
  title,
  em,
  dataCurrent,
  children,
}: {
  id: string;
  variant: 'related' | 'recent' | 'collection';
  bg: string;
  eyebrow: string;
  title: string;
  em: string;
  dataCurrent?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`sn-s snrc snrc--${variant}`}
      style={{ '--bg': bg, '--tx': '#1B2130', '--ac': '#A8834F', '--pt': '88px', '--pb': '88px' }}
      data-src={variant}
      data-limit="8"
      data-current={dataCurrent}
    >
      <div className="sn-wrap" data-sn-railwrap="">
        <div className="snrc__head">
          <div className="sn-head ">
            <div className="sn-head__main">
              <p className="sn-eyebrow" data-r="">
                <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.3" />
                  <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8Z" />
                </svg>
                {` ${eyebrow}`}
              </p>
              <h2 className="sn-h sn-h--m" data-sn-split="">
                {`${title} `}
                <em>{em}</em>
              </h2>
            </div>
          </div>
          <div className="sn-rail-nav">
            <button type="button" className="sn-ibtn" data-sn-prev="" aria-label="Previous">
              <Icon name="arrow-left" strokeWidth={1.6} />
            </button>
            <button type="button" className="sn-ibtn" data-sn-next="" aria-label="Next">
              <Icon name="arrow" />
            </button>
          </div>
        </div>
        <div className="snrc__out sn-rail" data-sn-rail="" style={{ '--col': '310px' }} data-snrc-out="">
          {children}
        </div>
        <div className="sn-progress snrc__prog">
          <i data-sn-prog="" />
        </div>
      </div>
    </section>
  );
}

export default function RecsRail({
  id,
  products,
  bg = '#F4EEE4',
  variant = 'related',
  eyebrow = 'Sleep in a set',
  title = 'You may',
  em = 'also love',
}: {
  id: string;
  products: Product[];
  bg?: string;
  variant?: 'related' | 'collection';
  eyebrow?: string;
  title?: string;
  em?: string;
}) {
  if (!products.length) return null;
  return (
    <RailShell id={id} variant={variant} bg={bg} eyebrow={eyebrow} title={title} em={em}>
      {products.map((p, i) => (
        <ProductCard key={p.handle} product={p} index={i} sizes="310px" />
      ))}
    </RailShell>
  );
}
