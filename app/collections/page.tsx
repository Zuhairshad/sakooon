import type { Metadata } from 'next';
import Link from 'next/link';
import { getCollection, getCollections } from '@/lib/shopify';
import { img } from '@/lib/utils';
import Boot from '@/components/theme/Boot';
import { Icon } from '@/components/ui/Icon';
import '@/components/listing/listing.css';

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Bed sheets, duvets, duvet covers, pillows and bed covers — every Sakooon collection in one place.',
  alternates: { canonical: '/collections' },
};

export default async function CollectionsPage() {
  const cols = (await getCollections().catch(() => [])).filter((c) => c.productCount > 0);
  // collection images are not set in Shopify, so use each collection's first product image
  const covers = await Promise.all(cols.map((c) => (c.image ? Promise.resolve(c.image.url) : getCollection(c.handle, { first: 1 }).then((d) => d?.products[0]?.featuredImage?.url ?? null).catch(() => null))));
  const all = await getCollection('all', { first: 1 }).catch(() => null);

  return (
    <section id="snms-collections" className="sn-s snms snms--cols" style={{ '--bg': '#F4EEE4', '--tx': '#1B2130', '--ac': '#A8834F', '--pt': '0px', '--pb': '100px' }}>
      <div className="snms__top" data-sn-silk-host="">
        <div className="sn-silk" data-sn-silk="" data-c1="#161B29" data-c2="#2B2B45" data-c3="#E3C793" data-speed=".45" data-amp=".8" />
        <div className="sn-wrap snms__tin">
          <p className="sn-eyebrow">
            <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="8" cy="8" r="6.3" />
              <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8Z" />
            </svg>
            {' Shop by category'}
          </p>
          <h1 className="sn-h sn-h--l">
            {'Everything for a '}
            <em>softer night</em>
          </h1>
          <p className="sn-lead">From crisp sheets to cloud-soft duvets.</p>
        </div>
      </div>
      <div className="sn-wrap snms__body">
        <div className="sn-grid snms__grid" style={{ '--cols': '3' }}>
          {cols.map((c, i) => (
            <Link key={c.handle} className="snms__doc sn-pillow" href={`/collections/${c.handle}`} data-r="" style={{ '--i': i }}>
              {covers[i] ? (
                <span className="sn-media snms__dimg" style={{ aspectRatio: '4 / 5' }}>
                  <img src={img(covers[i], 700)} alt={c.title} loading={i < 3 ? 'eager' : 'lazy'} width={700} height={875} />
                </span>
              ) : null}
              <small>
                {c.productCount} {c.productCount === 1 ? 'piece' : 'pieces'}
              </small>
              <b className="sn-h sn-h--s">{c.title}</b>
            </Link>
          ))}
        </div>
        {all ? (
          <p style={{ textAlign: 'center', marginTop: 50 }}>
            <Link className="sn-btn" href="/collections/all">
              <span>Shop all products</span>
              <Icon name="arrow" />
            </Link>
          </p>
        ) : null}
      </div>
      <Boot />
    </section>
  );
}
