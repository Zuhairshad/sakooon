import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getCollection, getCollections } from '@/lib/shopify';
import { COLLECTION_SORTS, applyListing, readListingParams } from '@/lib/shopify/listing';
import { Facets, FacetsBehavior, NoResults, ProductGrid, SortSelect } from '@/components/listing/Listing';
import Boot from '@/components/theme/Boot';
import { img } from '@/lib/utils';
import '@/components/listing/listing.css';

type SP = Record<string, string | string[] | undefined>;
const SEC = 'collection-main';
const HOST = `snms-${SEC}`;

/** Server-side sort keys; the rest are applied on the (small) cached list. */
const SERVER_SORT: Record<string, { sortKey: string; reverse?: boolean }> = {
  manual: { sortKey: 'COLLECTION_DEFAULT' },
  'best-selling': { sortKey: 'BEST_SELLING' },
};

export async function generateStaticParams() {
  const cols = await getCollections().catch(() => []);
  return [{ handle: 'all' }, ...cols.map((c) => ({ handle: c.handle }))];
}

export async function generateMetadata({ params }: PageProps<'/collections/[handle]'>): Promise<Metadata> {
  const { handle } = await params;
  const d = await getCollection(handle).catch(() => null);
  if (!d) return { title: '404 Not Found' };
  const c = d.collection;
  const image = c.image?.url || d.products[0]?.featuredImage?.url;
  return {
    title: c.seo.title || c.title,
    description: c.seo.description || c.description || `Shop ${c.title} at Sakooon — premium bedding delivered across Pakistan.`,
    alternates: { canonical: `/collections/${c.handle}` },
    openGraph: { title: c.title, url: `/collections/${c.handle}`, images: image ? [{ url: img(image, 1200) }] : undefined },
  };
}

function Top({ title, description, count }: { title: string; description: string; count: number | null }) {
  const [first, ...rest] = title.split(' ');
  return (
    <div className="snms__top" data-sn-silk-host="">
      <div className="sn-silk" data-sn-silk="" data-c1="#161B29" data-c2="#2B2B45" data-c3="#E3C793" data-speed=".45" data-amp=".8" />
      <div className="sn-wrap snms__tin">
        <nav className="sn-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <i />
          <Link href="/collections">Collections</Link>
        </nav>
        <p className="sn-eyebrow">
          <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="6.3" />
            <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8Z" />
          </svg>
          {count != null ? ` ${count} ${count === 1 ? 'piece' : 'pieces'}` : ' Collection'}
        </p>
        <h1 className="sn-h sn-h--l">
          {rest.length ? (
            <>
              {`${first} `}
              <em>{rest.join(' ')}</em>
            </>
          ) : (
            <em>{title}</em>
          )}
        </h1>
        {description ? <p className="sn-lead">{description}</p> : null}
      </div>
    </div>
  );
}

async function Body({ params, searchParams }: { params: PageProps<'/collections/[handle]'>['params']; searchParams: Promise<SP> }) {
  const [{ handle }, sp] = await Promise.all([params, searchParams]);
  const lp = readListingParams(sp, COLLECTION_SORTS);
  const d = await getCollection(handle, SERVER_SORT[lp.sort] || SERVER_SORT.manual);
  if (!d) notFound();
  const { collection: c, products } = d;
  const { list, counts, priceMax, active } = applyListing(products, lp);
  return (
    <>
      <Top title={c.title} description={c.description} count={products.length} />
      <div className="sn-wrap snms__body">
        <div className="snms__bar">
          <p className="snms__count" data-sn-region="count">
            {list.length} {list.length === 1 ? 'product' : 'products'}
          </p>
          <div className="snms__types" />
          <SortSelect sorts={COLLECTION_SORTS} value={lp.sort} />
        </div>
        <div className={`snms__layout${products.length ? ' has-f' : ''}`}>
          {products.length ? <Facets formId={`ms${SEC}-form`} hidden={{}} params={lp} counts={counts} priceMax={priceMax} /> : null}
          <div className="snms__main">
            {list.length ? (
              <ProductGrid products={list} />
            ) : (
              <NoResults
                title={active ? 'Nothing matches those filters' : 'This collection is resting'}
                text={active ? 'Try widening the price range or availability.' : 'New pieces are on their way — explore the rest of the range meanwhile.'}
                clearHref={active ? `/collections/${c.handle}` : undefined}
              />
            )}
            <div data-sn-region="pager" />
          </div>
        </div>
      </div>
      <FacetsBehavior hostId={HOST} />
      <Boot />
    </>
  );
}

export default function CollectionPage({ params, searchParams }: PageProps<'/collections/[handle]'>) {
  return (
    <section id={HOST} className="sn-s snms snms--col" style={{ '--bg': '#F4EEE4', '--tx': '#1B2130', '--ac': '#A8834F', '--pt': '0px', '--pb': '100px' }} data-sn-fhost="" data-section={SEC}>
      <Suspense fallback={<><Top title="Collection" description="" count={null} /><div style={{ minHeight: '100vh' }} aria-busy="true" /></>}>
        <Body params={params} searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
