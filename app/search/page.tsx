import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { searchProducts } from '@/lib/shopify';
import { SEARCH_SORTS, applyListing, readListingParams, searchDocs, type Doc } from '@/lib/shopify/listing';
import { Facets, FacetsBehavior, NoResults, ProductGrid, SortSelect } from '@/components/listing/Listing';
import { Icon } from '@/components/ui/Icon';
import Boot from '@/components/theme/Boot';
import { img } from '@/lib/utils';
import '@/components/listing/listing.css';

const SEC = 'template--23876058972263__main';
const HOST = `snms-${SEC}`;
const POPULAR = ['Bed sheets', 'T300', 'Duvet', 'Towels', 'Pillow covers'];
type SP = Record<string, string | string[] | undefined>;
const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || '';

async function results(sp: SP) {
  const q = str(sp.q).trim().slice(0, 100);
  const type = str(sp.type);
  if (!q) return { q, type, products: [], docs: [] as Doc[] };
  const [products, docs] = await Promise.all([type && type !== 'product' ? Promise.resolve([]) : searchProducts(q).catch(() => []), type === 'product' ? Promise.resolve([] as Doc[]) : searchDocs(q).catch(() => [] as Doc[])]);
  return { q, type, products, docs: type ? docs.filter((d) => d.type === type) : docs };
}

export async function generateMetadata({ searchParams }: PageProps<'/search'>): Promise<Metadata> {
  const sp = await searchParams;
  const { q, products, docs } = await results(sp);
  if (!q) return { title: 'Search', robots: { index: false } };
  const n = products.length + docs.length;
  return { title: `Search: ${n} result${n === 1 ? '' : 's'} found for "${q}"`, robots: { index: false } };
}

const searchHref = (q: string, type?: string) => `/search?${new URLSearchParams({ q, ...(type ? { type } : {}), 'options[prefix]': 'last' })}`;

function Top({ q }: { q: string }) {
  return (
    <div className="snms__top" data-sn-silk-host="">
      <div className="sn-silk" data-sn-silk="" data-c1="#161B29" data-c2="#2B2B45" data-c3="#E3C793" data-speed=".45" data-amp=".8" />
      <div className="sn-wrap snms__tin">
        <p className="sn-eyebrow" data-r="" data-atf="">
          <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="6.3" />
            <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8Z" />
          </svg>
          {' Search Sakooon'}
        </p>
        <h1 className="sn-h sn-h--l">
          {q ? (
            <>
              {'Results for '}
              <em>“{q}”</em>
            </>
          ) : (
            <>
              {'What are you '}
              <em>looking for?</em>
            </>
          )}
        </h1>
        <form action="/search" method="get" role="search" className="snms__form" data-r="" data-atf="" style={{ '--i': '2' }} data-sn-psearch="">
          <label className="snms__field">
            <Icon name="search" />
            <input type="search" name="q" defaultValue={q} key={q} placeholder="Try “sateen king”, “towels”, “T300”…" aria-label="Try “sateen king”, “towels”, “T300”…" autoComplete="off" />
            <input type="hidden" name="options[prefix]" value="last" />
            <button type="submit" className="sn-btn sn-btn--gold sn-btn--sm">
              <span>Search</span>
            </button>
          </label>
          <div className="snms__pres" data-sn-presults="" />
        </form>
        <div className="snms__sugs" data-r="" data-atf="" style={{ '--i': '3' }}>
          <span>Popular:</span>
          {POPULAR.map((p) => (
            <Link key={p} className="sn-chip" href={searchHref(p)}>
              {p}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

async function Body({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const { q, type, products, docs } = await results(sp);
  const lp = readListingParams(sp, SEARCH_SORTS);
  const { list, counts, priceMax, active } = applyListing(products, lp);
  const total = list.length + docs.length;
  const hidden: Record<string, string> = { q, 'options[prefix]': 'last', ...(type ? { type } : {}) };

  return (
    // same min-height as the Suspense fallback, so the footer never jumps into view (CLS)
    <div style={{ minHeight: '100vh' }}>
      <Top q={q} />
      {q ? (
        <div className="sn-wrap snms__body">
          <div className="snms__bar">
            <p className="snms__count" data-sn-region="count">
              {total} result{total === 1 ? '' : 's'}
            </p>
            <div className="snms__types">
              {[
                ['', 'All'],
                ['product', 'Products'],
                ['article', 'Journal'],
                ['page', 'Pages'],
              ].map(([t, label]) => (
                <Link key={t} className={`sn-chip${type === t ? ' is-on' : ''}`} href={searchHref(q, t)}>
                  {label}
                </Link>
              ))}
            </div>
            <SortSelect sorts={SEARCH_SORTS} value={lp.sort} />
          </div>
          <div className={`snms__layout${products.length ? ' has-f' : ''}`}>
            {products.length ? <Facets formId={`ms${SEC}-form`} hidden={hidden} params={lp} counts={counts} priceMax={priceMax} /> : null}
            <div className="snms__main">
              {list.length ? <ProductGrid products={list} /> : null}
              {docs.length ? (
                <div className="sn-grid snms__grid" style={{ '--cols': '3', marginTop: list.length ? 40 : 0 }}>
                  {docs.map((d, i) => (
                    <Link key={d.url} className="snms__doc sn-pillow" href={d.url} data-r="" style={{ '--i': i % 8 }}>
                      {d.image ? (
                        <span className="sn-media snms__dimg">
                          <img src={img(d.image, 600)} alt="" loading="lazy" />
                        </span>
                      ) : (
                        <span className="snms__dic">
                          <Icon name={d.type === 'page' ? 'note' : 'sparkle'} />
                        </span>
                      )}
                      <small>{d.type === 'page' ? 'Page' : 'Journal'}</small>
                      <b className="sn-h sn-h--s">{d.title}</b>
                      {d.excerpt ? <p>{d.excerpt.slice(0, 140)}</p> : null}
                    </Link>
                  ))}
                </div>
              ) : null}
              {!total ? (
                <NoResults
                  title={active ? 'Nothing matches those filters' : `Nothing found for “${q}”`}
                  text={active ? 'Try widening the price range or availability.' : 'Check the spelling or try a broader word like “sheets” or “duvet”.'}
                  clearHref={active ? searchHref(q, type || undefined) : undefined}
                />
              ) : null}
              <div data-sn-region="pager" />
            </div>
          </div>
        </div>
      ) : null}
      <FacetsBehavior hostId={HOST} />
      <Boot />
    </div>
  );
}

export default function SearchPage({ searchParams }: PageProps<'/search'>) {
  return (
    <section id={HOST} className="sn-s snms" style={{ '--bg': '#F4EEE4', '--tx': '#1B2130', '--ac': '#A8834F', '--pt': '0px', '--pb': '100px' }} data-sn-fhost="" data-section={SEC}>
      <Suspense fallback={<><Top q="" /><div style={{ minHeight: '100vh' }} aria-busy="true" /></>}>
        <Body searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
