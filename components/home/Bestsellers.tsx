import { cacheLife, cacheTag } from 'next/cache';
import Link from 'next/link';
import './best.css';

import { getCollection } from '@/lib/shopify';
import ProductCard from '@/components/product/ProductCard';
import Static from '@/components/theme/Static';

export default async function Bestsellers() {
  'use cache';
  cacheLife('hours');
  cacheTag('products', 'collections');
  const products = (await getCollection('bed-sheets').catch(() => null))?.products.slice(0, 12) || [];
  return (
    <>
      <Static>
      <section
        id="snp-template--23876058939495__best"
        className="sn-s snp snp--rail"
        style={{
          '--bg': '#F4EEE4',
          '--tx': '#1B2130',
          '--ac': '#A8834F',
          '--pt': '112px',
          '--pb': '112px',
          '--cols': '4',
          '--col': '320px',
        }}
        data-sn-tabhost=""
      >
        <div className="sn-wrap">
          <div className="snp__head">
            <div className="sn-head ">
              <div className="sn-head__main">
                <p className="sn-eyebrow" data-r="">
                  <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.3" />
                    <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8 3.2 5.8 0 0 1 8 2.2Z" />
                  </svg>
                  {' Most loved'}
                </p>
                <h2 className="sn-h sn-h--l" data-sn-split="">
                  {'The '}
                  <em>bestsellers</em>
                </h2>
              </div>
            </div>
            <div className="snp__tools" data-r="" style={{ '--i': '3' }}>
              <div className="sn-rail-nav">
                <button type="button" className="sn-ibtn" data-snp-prev="" aria-label="Previous">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="icon"
                    aria-hidden="true"
                  >
                    <path d="M20 12H4M10 6l-6 6 6 6" />
                  </svg>
                </button>
                <button type="button" className="sn-ibtn" data-snp-next="" aria-label="Next">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="icon"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="snp__panel" data-panel="t1" data-sn-railwrap="">
          <div className="sn-rail sn-rail--bleed snp__list" data-sn-rail="">
            {products.map((p, i) => (
              <div className="snp__item" key={p.id}>
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
          <div className="sn-wrap snp__foot">
            <div className="sn-progress" data-sn-prog="">
              <i />
            </div>
            <Link className="sn-link" href="/collections/bed-sheets">
              View all
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      </Static>
    </>
  );
}
