import type { Product } from '@/lib/shopify/types';
import type { ListingParams, SortOption } from '@/lib/shopify/listing';
import ProductCard from '@/components/product/ProductCard';
import FacetsBehavior from './FacetsBehavior';

const Chev = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="icon" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export function SortSelect({ sorts, value }: { sorts: SortOption[]; value: string }) {
  return (
    <label className="snms__sort">
      <select className="sn-select" data-sn-sort="" aria-label="Sort" defaultValue={value} key={value}>
        {sorts.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Theme facet sidebar (availability + price range), URL-driven. */
export function Facets({
  formId,
  hidden,
  params,
  counts,
  priceMax,
}: {
  formId: string;
  hidden: Record<string, string>;
  params: ListingParams;
  counts: { inStock: number; outOfStock: number };
  priceMax: number;
}) {
  const a = params.gte != null && priceMax ? Math.min(100, (params.gte / priceMax) * 100) : 0;
  const b = params.lte != null && priceMax ? Math.min(100, (params.lte / priceMax) * 100) : 100;
  const key = `${params.avail.join()}|${params.gte}|${params.lte}`;
  return (
    <details className="snms__side" open>
      <summary className="snms__fsum">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="icon" aria-hidden="true">
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
        Filter
      </summary>
      <div data-sn-region="filters">
        <form className="sn-fac" data-sn-facets="" id={formId} key={key}>
          {Object.entries(hidden).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
          <details className="sn-fac__g" data-fid="filter.v.availability" open>
            <summary>
              <span>Availability</span>
              <Chev />
            </summary>
            <div className="sn-fac__b">
              <div className="sn-fac__list">
                <label className="sn-fac__opt">
                  <input type="checkbox" name="filter.v.availability" value="1" defaultChecked={params.avail.includes('1')} />
                  <i />
                  <span>In stock</span>
                  <small>{counts.inStock}</small>
                </label>
                <label className="sn-fac__opt">
                  <input type="checkbox" name="filter.v.availability" value="0" defaultChecked={params.avail.includes('0')} />
                  <i />
                  <span>Out of stock</span>
                  <small>{counts.outOfStock}</small>
                </label>
              </div>
            </div>
          </details>
          <details className="sn-fac__g" data-fid="filter.v.price" open>
            <summary>
              <span>Price</span>
              <Chev />
            </summary>
            <div className="sn-fac__b">
              <div className="sn-fac__price" data-sn-price="" style={{ '--a': `${a}%`, '--b': `${b}%` }}>
                <div className="sn-fac__rng">
                  <i />
                  <input type="range" min="0" max={priceMax} step="1" defaultValue={params.gte ?? 0} data-sn-pr="min" aria-label="Min" />
                  <input type="range" min="0" max={priceMax} step="1" defaultValue={params.lte ?? priceMax} data-sn-pr="max" aria-label="Max" />
                </div>
                <div className="sn-fac__pin">
                  <label>
                    <span>₨</span>
                    <input type="number" min="0" max={priceMax} name="filter.v.price.gte" defaultValue={params.gte ?? ''} placeholder="0" data-sn-pn="min" />
                  </label>
                  <em>—</em>
                  <label>
                    <span>₨</span>
                    <input type="number" min="0" max={priceMax} name="filter.v.price.lte" defaultValue={params.lte ?? ''} placeholder={String(priceMax)} data-sn-pn="max" />
                  </label>
                </div>
              </div>
            </div>
          </details>
        </form>
      </div>
    </details>
  );
}

export function ProductGrid({ products, cols = 3 }: { products: Product[]; cols?: number }) {
  return (
    <>
      <h2 className="visually-hidden">Products</h2>
      <div className="sn-grid snms__grid" style={{ '--cols': String(cols) }} data-sn-grid="" data-sn-region="grid">
        {products.map((p, i) => (
          <ProductCard key={p.handle} product={p} index={i % 8} sizes="(min-width: 990px) 25vw, 50vw" priority={i < 4} />
        ))}
      </div>
    </>
  );
}

export function NoResults({ title, text, clearHref }: { title: string; text: string; clearHref?: string }) {
  return (
    <div className="snms__none">
      <div className="snms__moon" aria-hidden="true">
        <i />
      </div>
      <p className="sn-h sn-h--m">{title}</p>
      <p className="sn-small">{text}</p>
      {clearHref ? (
        <a className="sn-link" href={clearHref}>
          Clear filters
        </a>
      ) : null}
    </div>
  );
}

export { FacetsBehavior };
